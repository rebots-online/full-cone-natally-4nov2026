// Review wiring for the frozen Stitch export. This file is not imported by the app.
const views = new Set(['profile', 'balance', 'topup', 'offers', 'billing', 'alby', 'conversation']);
const originalSwitch = window.switchView;
const status = document.querySelector('#preview-status');
status.className = 'branch-status';
status.textContent = 'Branch preview. Payment accounts are not connected.';

window.switchView = function (view, updateHistory = true) {
  const target = views.has(view) ? view : 'profile';
  originalSwitch(target);
  if (updateHistory && location.hash !== `#${target}`) location.hash = target;
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.id === `view-${target}`) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });
  const heading = document.querySelector(`#section-${target} h1, #section-${target} h2`);
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
};
window.addEventListener('hashchange', () => window.switchView(location.hash.slice(1), false));

// Bind the supplied original character; never preserve a generated placeholder.
document.querySelectorAll('img').forEach(img => {
  if (img.src.includes('stitch-placeholder')) {
    img.src = '../atelier-conversation-20261017/assets/natally-mascot.webp';
    img.alt = 'Natally, the original observatory companion';
    img.style.objectFit = 'contain';
  }
});

// No paid upgrade is selected on behalf of the visitor.
document.querySelectorAll('input[name="offer"]').forEach(input => { input.checked = false; });
const notices = {
  'request-topup': 'Top-up is not connected. No quote was issued and no money was requested.',
  'buy-reading': 'RevenueCat checkout is not connected. No purchase was started.',
  'restore-purchases': 'Purchase recovery is not connected. No receipt was queried or access restored.',
  'open-billing-portal': 'Billing management is not connected. No account data was requested.',
  'quote-turn': 'Alby quoting is not connected. No invoice was created.',
  'pay-turn': 'A verified, unexpired quote is required before a wallet can be asked to pay.',
  'resume-turn': 'Turn recovery is not connected. No invoice was paid again.'
};
for (const [id, message] of Object.entries(notices)) {
  const button = document.getElementById(id);
  button.removeAttribute('onclick');
  button.addEventListener('click', () => {
    if (id === 'buy-reading' && !document.querySelector('input[name="offer"]:checked')) {
      status.textContent = 'Choose PDF only, PDF + SPA, or Bring Natally home before checkout.';
      document.querySelector('input[name="offer"]').focus();
    } else if (id === 'request-topup' && !document.querySelector('#topup-amount').reportValidity()) {
      status.textContent = 'Enter a valid top-up amount before requesting a quote.';
    } else if (id === 'quote-turn' && !document.querySelector('#reading-question').value.trim()) {
      status.textContent = 'Enter your reading question before requesting a per-turn quote.';
      document.querySelector('#reading-question').focus();
    } else status.textContent = message;
  });
}
const amount = document.querySelector('#topup-amount');
amount.readOnly = false;
amount.type = 'number';
amount.value = '';
amount.placeholder = 'Credits to quote';
amount.required = true;
amount.min = '1';
amount.step = '1';
document.querySelector('label[for="topup-amount"]').textContent = 'Credits to quote ($ROCHE)';
const currencyMark = amount.parentElement.querySelector('span');
if (currencyMark) currencyMark.textContent = '$ROCHE';
document.querySelector('#pay-turn').disabled = true;
document.querySelector('#pay-turn').title = 'Available only after a verified quote is issued';
const atelier = document.querySelector('#open-atelier');
atelier.removeAttribute('onclick');
atelier.href = './atelier.html';
window.switchView(location.hash.slice(1), false);
