(function () {
  'use strict';

  function isTauri() {
    return typeof window !== 'undefined' && (window.__TAURI__ || window.__TAURI_INTERNALS__);
  }

  if (isTauri() || !window.isSecureContext) return;

  if (!document.querySelector('meta[name="natally-release-id"]')) return;

  if ('serviceWorker' in navigator) {
    function reportRelease(worker) {
      var meta = document.querySelector('meta[name="natally-release-id"]');
      var releaseId = meta && meta.getAttribute('content');
      var recipient = worker || navigator.serviceWorker.controller;
      if (releaseId && releaseId.trim() && recipient) recipient.postMessage({ type: 'natally:document-release', releaseId: releaseId.trim() });
    }

    function registerWorker() {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(function (registration) {
        reportRelease(registration.active);
      }).catch(function () {});
    }

    navigator.serviceWorker.addEventListener('message', function (event) {
      if (event.data && event.data.type === 'natally:request-release') reportRelease(event.source);
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () { reportRelease(); });
    navigator.serviceWorker.ready.then(function (registration) { reportRelease(registration.active); }).catch(function () {});
    if (document.readyState === 'complete') registerWorker();
    else window.addEventListener('load', registerWorker, { once: true });
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
    var appName = document.querySelector('meta[name="application-name"]')?.content;
    if (!appName) throw new Error('Required application identity is missing.');
    installBtn.textContent = 'Install ' + appName;
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
