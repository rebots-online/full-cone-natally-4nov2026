const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export function renderInvoice(receipt) {
  if (!receipt.invoiceNumber || !receipt.paidAt || !receipt.purchaser?.name || !receipt.purchaser?.address ||
      !receipt.description || !/^[A-Z]{3}$/.test(receipt.currency) || !Number.isSafeInteger(receipt.subtotalMicros) ||
      !Number.isSafeInteger(receipt.taxMicros) || !Number.isSafeInteger(receipt.totalMicros) ||
      receipt.subtotalMicros + receipt.taxMicros !== receipt.totalMicros || receipt.taxMicros > 0 && !receipt.taxDetails?.length) {
    throw new Error('The complete official invoice facts have not yet been retrieved.');
  }
  const format = value => new Intl.NumberFormat('en-CA', { style: 'currency', currency: receipt.currency }).format(value / 1000000);
  const address = Object.values(receipt.purchaser.address).filter(Boolean).join(', ');
  const taxRows = (receipt.taxDetails || []).map(tax => {
    const details = tax.tax_rate_details || tax.tax_rate;
    if (!details || typeof details !== 'object' || !Number.isFinite(details.percentage_decimal === undefined ? details.percentage : Number(details.percentage_decimal))) throw new Error('The actual tax rate has not been retrieved.');
    const rate = details.percentage_decimal ?? details.percentage;
    const label = details.display_name || details.tax_type;
    if (!label || !Number.isSafeInteger(tax.amount)) throw new Error('The actual tax description has not been retrieved.');
    return `<tr><td>${escape(label)} (${escape(rate)}%)</td><td>${escape(format(tax.amount * 10000))}</td></tr>`;
  }).join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Invoice ${escape(receipt.invoiceNumber)} — Roche Media Services</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:820px;margin:48px auto;padding:24px;color:#171717}h1{margin-bottom:4px}table{width:100%;border-collapse:collapse;margin:24px 0}td,th{text-align:left;padding:12px;border-bottom:1px solid #ddd}td:last-child,th:last-child{text-align:right}.total{font-weight:700}button{padding:10px 18px}@media print{button{display:none}body{margin:0}}</style><h1>Roche Media Services</h1><p>88 CORPORATE DR., TORONTO, ON M1H 3G6<br>HST registration: 826393555RT0001</p><h2>Paid invoice ${escape(receipt.invoiceNumber)}</h2><p>Invoice/payment date: ${escape(receipt.paidAt)}<br>Currency: ${escape(receipt.currency)}<br>Payment terms: Paid in full</p><h3>Bill to</h3><p>${escape(receipt.purchaser.name)}<br>${escape(address)}${receipt.purchaser.email ? `<br>${escape(receipt.purchaser.email)}` : ''}</p><table><thead><tr><th>Description</th><th>Amount (${escape(receipt.currency)})</th></tr></thead><tbody><tr><td>${escape(receipt.description)}</td><td>${escape(format(receipt.subtotalMicros))}</td></tr>${taxRows || `<tr><td>Tax charged</td><td>${escape(format(receipt.taxMicros))}</td></tr>`}<tr class="total"><td>Total paid</td><td>${escape(format(receipt.totalMicros))}</td></tr></tbody></table><p>Transaction reference: ${escape(receipt.sourceId)}</p><button onclick="window.print()">Print or save PDF</button></html>`;
}
