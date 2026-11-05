import { digest, money } from './firebase-ledger.mjs';
import { renderInvoice } from './invoice.mjs';
import { createKeyCipher } from './key-cipher.mjs';

export function decimalMicros(value, label = 'USD amount') {
  const match = /^(\d+)(?:\.(\d{1,6}))?$/.exec(String(value));
  if (!match) throw new Error(`${label} must be an exact nonnegative decimal.`);
  const result = BigInt(match[1]) * 1000000n + BigInt((match[2] || '').padEnd(6, '0'));
  if (result > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label} exceeds the supported range.`);
  return Number(result);
}
export function customAmountCents(raw) {
  if (typeof raw !== 'string' || !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(raw)) throw Object.assign(new Error('Enter a USD amount with up to two decimal places.'), { status: 400 });
  const micros = decimalMicros(raw), cents = micros / 10000;
  if (!Number.isSafeInteger(cents) || cents < 500 || cents > 99999999) throw Object.assign(new Error('Choose US$5 or enter an amount greater than US$5 within the payment processor limit.'), { status: 400 });
  return cents;
}
const required = (env, name) => { if (!env[name]) throw new Error(`${name} is required.`); return env[name]; };
export function createCommerce(environment) {
  const rcKey = () => required(environment, 'REVENUECAT_SECRET_API_KEY');
  const project = () => required(environment, 'REVENUECAT_PROJECT_ID');
  async function rc(path, method = 'GET', body, headers = {}) {
    const response = await fetch(`https://api.revenuecat.com${path}`, { method, headers: { Authorization: headers.Authorization || `Bearer ${rcKey()}`, 'Content-Type': 'application/json', ...headers },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), redirect: 'error', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Purchase verification could not be completed (${response.status}).`);
    return response.json();
  }
  async function pages(path) {
    const results = [], seen = new Set(); let next = path;
    for (let i = 0; next && i < 200; i++) {
      const url = new URL(next, 'https://api.revenuecat.com');
      if (url.origin !== 'https://api.revenuecat.com' || url.pathname !== path.split('?')[0] || seen.has(url.href)) throw new Error('Purchase pagination was invalid.');
      seen.add(url.href);
      const result = await rc(url.pathname + url.search);
      if (!Array.isArray(result.items)) throw new Error('Purchase records were malformed.');
      results.push(...result.items); next = result.next_page;
    }
    if (next) throw new Error('Purchase pagination exceeded its limit.');
    return results;
  }
  async function stripe(path, method = 'GET', fields, idempotencyKey) {
    const response = await fetch(`https://api.stripe.com/v1${path}`, { method, headers: {
      Authorization: `Bearer ${required(environment, 'STRIPE_SECRET_KEY')}`, 'Stripe-Version': '2026-10-28.endive',
      ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}), ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
    }, ...(fields ? { body: new URLSearchParams(fields).toString() } : {}), redirect: 'error', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Payment verification could not be completed (${response.status}).`);
    const result = await response.json();
    if (result.livemode === false) throw new Error('Production billing cannot use a sandbox payment resource.');
    return result;
  }
  async function checkout(ledger, identity, amountUsd, requestId) {
    const cents = customAmountCents(amountUsd), id = digest(JSON.stringify([identity.uid, 'checkout', requestId]));
    // Complete fulfillment configuration is required before either creating or
    // returning a live payment URL, including an earlier open checkout.
    for (const name of ['REVENUECAT_SECRET_API_KEY', 'REVENUECAT_PROJECT_ID', 'REVENUECAT_STRIPE_PUBLIC_KEY',
      'REVENUECAT_WEBHOOK_AUTH', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'OPENROUTER_ADMIN_KEY',
      'BILLING_KEY_ENCRYPTION_KEY', 'BILLING_STRIPE_CREDIT_PRODUCT_ID', 'BILLING_CHECKOUT_RETURN_URL', 'BILLING_TOPUP_ALLOCATION_BPS']) {
      const value = required(environment, name);
      if (typeof value !== 'string' || !value.trim() || value.startsWith('kstore:')) throw new Error(`${name} must be resolved before checkout.`);
    }
    createKeyCipher(environment);
    if (Number(environment.BILLING_TOPUP_ALLOCATION_BPS) !== 4000) throw new Error('BILLING_TOPUP_ALLOCATION_BPS must match the approved 40% allocation.');
    const verifiedProject = await rc(`/v2/projects/${encodeURIComponent(project())}`);
    if (verifiedProject.id !== project()) throw new Error('The configured RevenueCat project could not be verified.');
    let record = await ledger.read('natallyBillingCheckouts', id);
    if (record && (record.payload.uid !== identity.uid || record.payload.cents !== cents)) throw Object.assign(new Error('This request belongs to a different checkout amount.'), { status: 409 });
    if (record?.payload.sessionId) {
      const session = await stripe(`/checkout/sessions/${encodeURIComponent(record.payload.sessionId)}`);
      if (session.status === 'expired') throw Object.assign(new Error('This checkout expired. Start a new checkout to continue.'), { status: 409, code: 'CHECKOUT_EXPIRED' });
      if (session.status === 'complete') throw Object.assign(new Error('This checkout completed. Confirm this payment before starting another.'), { status: 409, code: 'CHECKOUT_COMPLETED', checkoutSessionId: session.id });
      if (session.status !== 'open' || typeof session.url !== 'string') throw Object.assign(new Error('This checkout is awaiting provider confirmation. Retry the same request.'), { code: 'BILLING_PENDING' });
      return { accountUid: identity.uid, requestId, checkoutSessionId: session.id, checkoutUrl: session.url, amountUsdMicros: cents * 10000, currency: 'USD' };
    }
    if (!record) {
      const payload = { uid: identity.uid, requestId, cents, createdAt: Date.now(), sessionId: null, priceId: null };
      await ledger.commit([ledger.write('natallyBillingCheckouts', id, payload, { exists: false })]);
      record = await ledger.read('natallyBillingCheckouts', id);
    }
    if (!record || record.payload.uid !== identity.uid || record.payload.cents !== cents) throw Object.assign(new Error('This request ID is already assigned to a different checkout.'), { status: 409 });
    if (Date.now() - record.payload.createdAt > 23 * 3600000) throw Object.assign(new Error('This checkout request needs provider reconciliation. Do not submit another payment.'), { code: 'BILLING_PENDING' });
    const registration = await stripe('/tax/registrations?status=active&limit=100');
    if (!registration.data?.some(item => item.country === 'CA' && item.status === 'active')) throw new Error('The merchant Canadian tax registration is not active.');
    const productId = required(environment, 'BILLING_STRIPE_CREDIT_PRODUCT_ID');
    const product = await stripe(`/products/${encodeURIComponent(productId)}`);
    if (!product.active || !product.tax_code) throw new Error('The actual credit product requires its tax classification.');
    const lookup = `natally_usd_${cents}`;
    let prices = await stripe(`/prices?lookup_keys[]=${encodeURIComponent(lookup)}&active=true&limit=100`);
    let price = prices.data?.find(item => item.lookup_key === lookup);
    if (!price) price = await stripe('/prices', 'POST', { product: productId, currency: 'usd', unit_amount: String(cents), tax_behavior: 'exclusive', lookup_key: lookup }, `natally-price-${cents}`);
    if (price.product !== productId || price.currency !== 'usd' || price.unit_amount !== cents || price.type !== 'one_time' || price.tax_behavior !== 'exclusive') throw new Error('The payment price does not match the requested amount.');
    const returnBase = new URL(required(environment, 'BILLING_CHECKOUT_RETURN_URL'));
    if (returnBase.protocol !== 'https:' || returnBase.username || returnBase.password) throw new Error('BILLING_CHECKOUT_RETURN_URL is invalid.');
    const separator = returnBase.search ? '&' : '?';
    const session = await stripe('/checkout/sessions', 'POST', { mode: 'payment', 'line_items[0][price]': price.id, 'line_items[0][quantity]': '1',
      client_reference_id: identity.uid, 'metadata[natally_uid]': identity.uid, 'metadata[natally_request_id]': requestId,
      'metadata[natally_amount_cents]': String(cents), 'metadata[natally_price_id]': price.id,
      'payment_intent_data[metadata][natally_uid]': identity.uid, 'payment_intent_data[metadata][natally_request_id]': requestId,
      'automatic_tax[enabled]': 'true', billing_address_collection: 'required', customer_creation: 'always',
      ...(identity.email ? { customer_email: identity.email } : {}),
      'invoice_creation[enabled]': 'true',
      'invoice_creation[invoice_data][footer]': 'Roche Media Services | HST 826393555RT0001 | 88 CORPORATE DR., TORONTO, ON M1H 3G6',
      success_url: `${returnBase.href}${separator}billing_return={CHECKOUT_SESSION_ID}`, cancel_url: `${returnBase.href}${separator}billing_cancelled=1`,
    }, `natally-checkout-${id}`);
    if (!session.id?.startsWith('cs_live_') && session.livemode !== true) throw new Error('The payment processor did not create a live checkout.');
    if (typeof session.url !== 'string' || new URL(session.url).hostname !== 'checkout.stripe.com') throw new Error('The payment processor returned an invalid checkout address.');
    const latest = await ledger.read('natallyBillingCheckouts', id);
    if (!latest.payload.sessionId) await ledger.commit([ledger.write('natallyBillingCheckouts', id, { ...latest.payload, sessionId: session.id, priceId: price.id }, { updateTime: latest.updateTime })]);
    const saved = await ledger.read('natallyBillingCheckouts', id);
    if (!saved || saved.payload.sessionId !== session.id || saved.payload.priceId !== price.id || saved.payload.uid !== identity.uid || saved.payload.cents !== cents) {
      throw Object.assign(new Error('The checkout is awaiting durable account confirmation. Retry this request.'), { code: 'BILLING_PENDING' });
    }
    return { accountUid: identity.uid, requestId, checkoutSessionId: session.id, checkoutUrl: session.url, amountUsdMicros: cents * 10000, currency: 'USD' };
  }
  async function invoiceTaxDetails(invoice) {
    if (!invoice) return null;
    const rows = invoice.total_taxes || invoice.total_tax_amounts;
    if (!Array.isArray(rows)) return null;
    const normalized = [];
    for (const row of rows) {
      let rate = row.tax_rate_details?.tax_rate || row.tax_rate;
      if (typeof rate === 'string') rate = await stripe(`/tax_rates/${encodeURIComponent(rate)}`);
      if (!rate || typeof rate !== 'object' || !Number.isSafeInteger(row.amount)) throw new Error('Actual invoice tax details could not be retrieved.');
      normalized.push({ amount: row.amount, tax_rate: rate });
    }
    return normalized;
  }
  async function confirmStripe(ledger, uid, sessionId) {
    if (typeof sessionId !== 'string' || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw Object.assign(new Error('The checkout session is invalid.'), { status: 400 });
    const session = await stripe(`/checkout/sessions/${encodeURIComponent(sessionId)}?expand[]=line_items&expand[]=invoice&expand[]=payment_intent.latest_charge`);
    if (session.client_reference_id !== uid || session.metadata?.natally_uid !== uid) throw Object.assign(new Error('The purchase belongs to another account.'), { status: 403 });
    const requestId = session.metadata.natally_request_id;
    const record = await ledger.read('natallyBillingCheckouts', digest(JSON.stringify([uid, 'checkout', requestId])));
    const line = session.line_items?.data?.[0];
    if (!record || record.payload.sessionId !== session.id || session.line_items.data.length !== 1 || line.price?.id !== record.payload.priceId ||
        line.quantity !== 1 || session.currency !== 'usd' || session.amount_subtotal !== record.payload.cents || line.amount_subtotal !== record.payload.cents) throw new Error('The paid purchase does not match its account quote.');
    if (session.payment_status !== 'paid' || session.status !== 'complete') throw Object.assign(new Error('Payment is still awaiting confirmation.'), { code: 'BILLING_PENDING' });
    const charge = session.payment_intent?.latest_charge;
    if (!charge || charge.paid !== true || charge.status !== 'succeeded' || charge.refunded === true || charge.amount_refunded !== 0 || session.payment_intent.status !== 'succeeded') {
      throw new Error('The original payment is refunded or its settlement cannot be confirmed.');
    }
    if (session.automatic_tax?.status !== 'complete' || !Number.isSafeInteger(session.total_details?.amount_tax)) throw new Error('Actual checkout tax could not be verified.');
    await rc('/v1/receipts', 'POST', { app_user_id: uid, fetch_token: session.id }, { 'X-Platform': 'stripe', Authorization: `Bearer ${required(environment, 'REVENUECAT_STRIPE_PUBLIC_KEY')}` });
    const purchases = await listPurchases(uid);
    const paymentId = typeof session.payment_intent === 'object' ? session.payment_intent.id : session.payment_intent;
    const evidence = purchases.find(item => item.customer_id === uid && item.environment === 'production' && item.store === 'stripe' && item.status === 'owned' && item.ownership === 'purchased' &&
      [session.id, paymentId, session.payment_intent?.latest_charge?.id].includes(String(item.store_purchase_identifier)));
    if (!evidence) throw Object.assign(new Error('The paid purchase is being added to your account. Retry reconciliation; do not pay again.'), { code: 'BILLING_PENDING' });
    const subtotal = money(session.amount_subtotal * 10000), tax = money(session.total_details.amount_tax * 10000), total = money(session.amount_total * 10000);
    if (subtotal + tax !== total) throw new Error('The paid purchase totals could not be reconciled.');
    const invoice = typeof session.invoice === 'object' ? session.invoice : null;
    if (!invoice || invoice.status !== 'paid' || !invoice.id || !invoice.number || !invoice.invoice_pdf ||
        !Number.isFinite(invoice.status_transitions?.paid_at) || !session.customer_details?.name || !session.customer_details?.address) {
      throw Object.assign(new Error('Your payment succeeded and the official invoice is being finalized. Retry reconciliation; do not pay again.'), { code: 'BILLING_PENDING' });
    }
    const taxDetails = await invoiceTaxDetails(invoice);
    if (tax > 0 && (!taxDetails?.length || taxDetails.reduce((sum, row) => sum + row.amount * 10000, 0) !== tax)) throw new Error('Actual paid invoice taxes are still being reconciled.');
    const bps = Number(required(environment, 'BILLING_TOPUP_ALLOCATION_BPS'));
    if (!Number.isSafeInteger(bps) || bps !== 4000) throw new Error('BILLING_TOPUP_ALLOCATION_BPS must match the approved 40% allocation.');
    return { uid, source: 'payment', sourceId: `stripe:${paymentId}`, providerPurchaseId: evidence.id, productId: evidence.product_id,
      description: line.description, purchasedAt: new Date(session.created * 1000).toISOString(), currency: 'USD', subtotalMicros: subtotal,
      taxMicros: tax, totalMicros: total, eligiblePaidUsdMicros: subtotal, providerAllowanceUsdMicros: Number(BigInt(subtotal) * BigInt(bps) / 10000n),
      status: evidence.status, invoiceId: invoice?.id || null, invoiceNumber: invoice?.number || null,
      invoicePdf: invoice?.invoice_pdf || null, hostedInvoiceUrl: invoice?.hosted_invoice_url || null,
      purchaser: session.customer_details, taxDetails,
      paidAt: invoice?.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null,
      stripeSessionId: session.id, stripePaymentIntentId: paymentId, evidenceSource: 'stripe_checkout_and_revenuecat' };
  }
  const listPurchases = uid => pages(`/v2/projects/${encodeURIComponent(project())}/customers/${encodeURIComponent(uid)}/purchases?limit=100`);
  const listInvoices = uid => pages(`/v2/projects/${encodeURIComponent(project())}/customers/${encodeURIComponent(uid)}/invoices?limit=100`);
  async function grantPayment(ledger, uid, payment, context) {
    // A durable receipt must already contain verified official invoice facts;
    // later retries cannot freeze an incomplete invoice into customer history.
    renderInvoice(payment);
    const receiptId = digest(JSON.stringify([uid, 'payment', payment.sourceId]));
    const existing = await ledger.read('natallyCreditGrants', receiptId);
    if (existing) {
      if (existing.payload.providerAllowanceUsdMicros !== payment.providerAllowanceUsdMicros) throw new Error('Historical purchase allowance conflicts with its verified receipt.');
      return existing.payload;
    }
    const receipt = { ...payment, receiptId, createdAt: new Date().toISOString() };
    await context.update(account => {
      account.grantedUsdMicros = money(account.grantedUsdMicros + payment.providerAllowanceUsdMicros);
      // Actual tax remains separately identified in the invoice. Do not relabel
      // all international tax as Canadian HST without provider jurisdiction.
      const bucket = account.taxPayable[payment.currency] || 0;
      account.taxPayable[payment.currency] = money(bucket + payment.taxMicros);
      const hst = (payment.taxDetails || []).reduce((sum, item) => {
        const rate = item.tax_rate_details || item.tax_rate;
        return rate && typeof rate === 'object' && rate.country === 'CA' && /hst|harmonized/i.test(`${rate.tax_type || ''} ${rate.display_name || ''}`)
          ? money(sum + money(item.amount) * 10000) : sum;
      }, 0);
      account.hstPayable ||= {};
      account.hstPayable[payment.currency] = money((account.hstPayable[payment.currency] || 0) + hst);
    }, [ledger.write('natallyCreditGrants', receiptId, receipt, { exists: false })]);
    return receipt;
  }
  async function reversePayment(ledger, uid, receipt, context) {
    const reversalId = digest(JSON.stringify([uid, 'refund', receipt.sourceId]));
    if (await ledger.read('natallyCreditGrants', reversalId)) return;
    const paymentId = receipt.stripePaymentIntentId || receipt.sourceId.slice('stripe:'.length);
    let charge;
    if (paymentId.startsWith('pi_')) charge = (await stripe(`/payment_intents/${encodeURIComponent(paymentId)}?expand[]=latest_charge`)).latest_charge;
    else if (paymentId.startsWith('ch_')) charge = await stripe(`/charges/${encodeURIComponent(paymentId)}`);
    if (!charge || charge.refunded !== true || charge.amount_refunded !== charge.amount || charge.amount * 10000 !== receipt.totalMicros || charge.currency?.toUpperCase() !== receipt.currency) {
      throw Object.assign(new Error('The original full refund and its tax reversal require processor confirmation.'), { code: 'REFUND_FACTS_REQUIRED' });
    }
    const hst = (receipt.taxDetails || []).reduce((sum, item) => {
      const rate = item.tax_rate;
      return rate?.country === 'CA' && /hst|harmonized/i.test(`${rate.tax_type || ''} ${rate.display_name || ''}`) ? sum + item.amount * 10000 : sum;
    }, 0);
    const reversal = { uid, receiptId: reversalId, source: 'refund', sourceId: receipt.sourceId, originalReceiptId: receipt.receiptId,
      providerAllowanceUsdMicros: receipt.providerAllowanceUsdMicros, refundedTotalMicros: receipt.totalMicros, refundedTaxMicros: receipt.taxMicros,
      refundedHstMicros: hst, currency: receipt.currency, providerChargeId: charge.id, createdAt: new Date().toISOString() };
    await context.update(account => {
      account.revokedUsdMicros = money(account.revokedUsdMicros + receipt.providerAllowanceUsdMicros);
      account.taxPayable[receipt.currency] = money((account.taxPayable[receipt.currency] || 0) - receipt.taxMicros, 'Tax payable after refund', true);
      account.hstPayable ||= {};
      account.hstPayable[receipt.currency] = money((account.hstPayable[receipt.currency] || 0) - hst, 'HST payable after refund', true);
    },
      [ledger.write('natallyCreditGrants', reversalId, reversal, { exists: false })]);
  }
  async function historicalPayment(uid, purchase) {
    let mappings;
    try { mappings = JSON.parse(required(environment, 'BILLING_PRODUCTS_JSON')); } catch { throw new Error('BILLING_PRODUCTS_JSON must contain actual Natally product mappings.'); }
    const product = mappings[purchase.product_id];
    if (!product) return null;
    if (purchase.customer_id !== uid || purchase.environment !== 'production' || purchase.ownership !== 'purchased') throw new Error('Historical purchase ownership could not be verified.');
    const identifier = String(purchase.store_purchase_identifier);
    let paymentIntent, charge, invoice;
    if (identifier.startsWith('pi_')) {
      paymentIntent = await stripe(`/payment_intents/${encodeURIComponent(identifier)}?expand[]=latest_charge`);
      charge = paymentIntent.latest_charge;
    } else if (identifier.startsWith('ch_')) charge = await stripe(`/charges/${encodeURIComponent(identifier)}`);
    else if (identifier.startsWith('cs_')) {
      const session = await stripe(`/checkout/sessions/${encodeURIComponent(identifier)}?expand[]=payment_intent.latest_charge&expand[]=invoice`);
      paymentIntent = session.payment_intent; charge = paymentIntent?.latest_charge; invoice = session.invoice;
    } else throw Object.assign(new Error('This historical payment requires its original processor invoice to reconcile tax and credit.'), { code: 'HISTORICAL_FACTS_REQUIRED' });
    if (!charge || charge.paid !== true || charge.status !== 'succeeded') throw new Error('Historical payment settlement could not be verified.');
    if (!invoice && typeof charge.invoice === 'string') invoice = await stripe(`/invoices/${encodeURIComponent(charge.invoice)}?expand[]=total_tax_amounts.tax_rate`);
    if (!invoice || typeof invoice !== 'object' || invoice.status !== 'paid' || invoice.currency !== 'usd') throw Object.assign(new Error('The original paid USD invoice is required to restore this purchase accurately.'), { code: 'HISTORICAL_FACTS_REQUIRED' });
    const net = invoice.total_excluding_tax;
    if (!Number.isSafeInteger(net) || !Number.isSafeInteger(invoice.amount_paid) || invoice.amount_paid < net) throw new Error('The historical invoice tax-exclusive total is unavailable.');
    const subtotal = money(net * 10000), total = money(invoice.amount_paid * 10000), tax = total - subtotal;
    const bps = Number(required(environment, 'BILLING_TOPUP_ALLOCATION_BPS'));
    if (bps !== 4000) throw new Error('BILLING_TOPUP_ALLOCATION_BPS does not match the approved allocation.');
    return { uid, source: 'payment', sourceId: `stripe:${paymentIntent?.id || charge.payment_intent || charge.id}`, providerPurchaseId: purchase.id,
      productId: purchase.product_id, description: product.description || invoice.lines?.data?.map(item => item.description).filter(Boolean).join('; '),
      purchasedAt: new Date(purchase.purchased_at).toISOString(), paidAt: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
      currency: 'USD', subtotalMicros: subtotal, taxMicros: tax, totalMicros: total, eligiblePaidUsdMicros: subtotal,
      providerAllowanceUsdMicros: Number(BigInt(subtotal) * BigInt(bps) / 10000n), status: purchase.status,
      invoiceId: invoice.id, invoiceNumber: invoice.number, invoicePdf: invoice.invoice_pdf, hostedInvoiceUrl: invoice.hosted_invoice_url,
      purchaser: { name: invoice.customer_name, email: invoice.customer_email, address: invoice.customer_address },
      taxDetails: await invoiceTaxDetails(invoice), stripePaymentIntentId: paymentIntent?.id || charge.payment_intent || null,
      evidenceSource: 'processor_paid_invoice_and_revenuecat' };
  }
  async function reconcileHistory(ledger, uid, context) {
    const purchases = await listPurchases(uid), receipts = await ledger.list('natallyCreditGrants', uid), unresolved = [];
    for (const purchase of purchases) {
      const known = receipts.find(item => item.source === 'payment' && item.providerPurchaseId === purchase.id);
      if (known && purchase.status === 'refunded') { await reversePayment(ledger, uid, known, context); continue; }
      if (known || purchase.status !== 'owned') continue;
      try {
        const payment = await historicalPayment(uid, purchase);
        if (payment) await grantPayment(ledger, uid, payment, context);
      } catch (error) {
        if (error.code !== 'HISTORICAL_FACTS_REQUIRED') throw error;
        unresolved.push({ purchaseId: purchase.id, productId: purchase.product_id, message: error.message });
      }
    }
    return { purchaseCount: purchases.length, unresolved };
  }
  return { checkout, confirmStripe, grantPayment, reversePayment, reconcileHistory, listPurchases, listInvoices, stripe, rc };
}
