(function () {
  'use strict';

  function isTauri() {
    return typeof window !== 'undefined' && (window.__TAURI__ || window.__TAURI_INTERNALS__);
  }

  if (isTauri() || !window.isSecureContext) return;

  if (!document.querySelector('meta[name="natally-release-id"]')) return;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  var deferredPrompt = null;
  var installBtn = null;

  function removeButton() {
    if (installBtn && installBtn.parentNode) installBtn.parentNode.removeChild(installBtn);
    installBtn = null;
  }

  function showButton() {
    if (installBtn) return;
    var nav = document.querySelector('.site-head nav.head-nav');
    if (!nav) return;
    installBtn = document.createElement('button');
    installBtn.className = 'signin';
    installBtn.type = 'button';
    installBtn.textContent = 'Install Natally';
    installBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () {
        deferredPrompt = null;
        removeButton();
      });
    });
    nav.appendChild(installBtn);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    showButton();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    removeButton();
  });
})();
