(function () {
  'use strict';

  function isTauri() {
    return typeof window !== 'undefined' && (window.__TAURI__ || window.__TAURI_INTERNALS__);
  }

  if (isTauri() || !window.isSecureContext) return;

  var releaseMeta = document.querySelector('meta[name="natally-release-id"]');
  if (!releaseMeta) return;
  var RELEASE_ID = releaseMeta.getAttribute('content') || '';

  function registerSW() {
    return navigator.serviceWorker.register('/sw.js');
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

  var dirtyFields = new Set();
  var focusValues = new Map();
  var appDirty = false;
  var updateBtn = null;
  var pendingReload = false;

  function isTrackable(el) {
    if (!el || el.disabled || el.readOnly) return false;
    var tag = el.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (tag === 'INPUT') return el.type !== 'password';
    return el.isContentEditable === true;
  }

  function fieldKey(el) {
    return el;
  }

  document.addEventListener('focusin', function (e) {
    var el = e.target;
    if (!isTrackable(el)) return;
    var value = el.isContentEditable ? el.textContent : el.value;
    focusValues.set(fieldKey(el), value);
  });

  function checkDirty(el) {
    if (!focusValues.has(fieldKey(el))) return;
    var value = el.isContentEditable ? el.textContent : el.value;
    if (value !== focusValues.get(fieldKey(el))) dirtyFields.add(fieldKey(el));
    else dirtyFields.delete(fieldKey(el));
    syncChip();
  }

  document.addEventListener('input', function (e) {
    if (isTrackable(e.target)) checkDirty(e.target);
  });
  document.addEventListener('change', function (e) {
    if (isTrackable(e.target)) checkDirty(e.target);
  });

  window.addEventListener('natally:dirty-state', function (e) {
    appDirty = !!(e && e.detail && e.detail.dirty);
    syncChip();
  });

  function hasDirtyState() {
    return dirtyFields.size > 0 || appDirty;
  }

  function ensureChip() {
    if (updateBtn) return updateBtn;
    updateBtn = document.createElement('button');
    updateBtn.type = 'button';
    updateBtn.setAttribute('role', 'status');
    updateBtn.setAttribute('aria-live', 'polite');
    updateBtn.textContent = 'Update ready — reload';
    updateBtn.style.cssText = 'position:fixed;bottom:0;left:0;right:0;width:100%;z-index:2147483647;padding:12px;border:0;background:#111;color:#fff;font:inherit;cursor:pointer;';
    updateBtn.addEventListener('click', function () {
      pendingReload = true;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'NATALLY_ACTIVATE' });
      } else {
        location.reload();
      }
    });
    document.body.appendChild(updateBtn);
    return updateBtn;
  }

  function removeChip() {
    if (updateBtn && updateBtn.parentNode) updateBtn.parentNode.removeChild(updateBtn);
    updateBtn = null;
  }

  function syncChip() {
    if (hasDirtyState()) ensureChip();
    else if (updateBtn && !pendingReload) removeChip();
  }

  var waitingWorker = null;

  function handleWaiting(worker) {
    if (!worker) return;
    waitingWorker = worker;
    if (hasDirtyState()) {
      ensureChip();
    } else {
      worker.postMessage({ type: 'NATALLY_ACTIVATE' });
    }
  }

  function onStateChange() {
    if (this.state === 'installed' && navigator.serviceWorker.controller) {
      handleWaiting(this);
    }
  }

  function checkUpdate() {
    navigator.serviceWorker.ready.then(function (reg) {
      return reg.update();
    }).catch(function () {});
  }

  var hadController = !!navigator.serviceWorker.controller;

  function isReleaseDone(releaseId) {
    try {
      return sessionStorage.getItem('natally-sw-activated:' + releaseId) === '1';
    } catch (err) {
      return false;
    }
  }

  function markReleaseDone(releaseId) {
    try {
      for (var i = sessionStorage.length - 1; i >= 0; i--) {
        var k = sessionStorage.key(i);
        if (k && k.indexOf('natally-sw-activated:') === 0 && k !== 'natally-sw-activated:' + releaseId) {
          sessionStorage.removeItem(k);
        }
      }
      sessionStorage.setItem('natally-sw-activated:' + releaseId, '1');
    } catch (err) {}
  }

  function queryActiveRelease() {
    return new Promise(function (resolve) {
      var worker = navigator.serviceWorker.controller;
      if (!worker) return resolve(null);
      var channel = new MessageChannel();
      var done = false;
      channel.port1.onmessage = function (e) {
        done = true;
        resolve(e.data && e.data.releaseId ? e.data.releaseId : null);
      };
      try {
        worker.postMessage({ type: 'NATALLY_RELEASE_QUERY' }, [channel.port2]);
      } catch (err) {
        return resolve(null);
      }
      setTimeout(function () {
        if (!done) resolve(null);
      }, 2000);
    });
  }

  function maybeReload(newReleaseId) {
    if (!hadController) return;
    var rid = newReleaseId || RELEASE_ID;
    if (isReleaseDone(rid)) return;
    if (hasDirtyState()) {
      pendingReload = true;
      ensureChip();
      return;
    }
    markReleaseDone(rid);
    location.reload();
  }

  navigator.serviceWorker.addEventListener('message', function (e) {
    var data = e.data;
    if (data && data.type === 'NATALLY_RELEASE' && data.releaseId) {
      maybeReload(data.releaseId);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!hadController) {
      hadController = true;
      return;
    }
    var worker = navigator.serviceWorker.controller;
    if (worker) {
      queryActiveRelease().then(function (releaseId) {
        maybeReload(releaseId);
      });
    } else {
      maybeReload(null);
    }
  });

  var docReloadDone = false;

  function isChunkError(message) {
    return /Failed to fetch dynamically imported module|Loading chunk|Importing a module script failed/.test(message || '');
  }

  function chunkReload() {
    if (docReloadDone) return;
    if (hasDirtyState()) {
      pendingReload = true;
      ensureChip();
      return;
    }
    docReloadDone = true;
    location.reload();
  }

  window.addEventListener('vite:preloadError', function (e) {
    var message = e && e.payload ? (e.payload.message || String(e.payload)) : '';
    if (isChunkError(message)) {
      e.preventDefault();
      chunkReload();
    }
  });

  window.addEventListener('unhandledrejection', function (e) {
    var reason = e && e.reason;
    var message = reason instanceof Error ? reason.message : String(reason || '');
    if (isChunkError(message)) chunkReload();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      registerSW().then(function (reg) {
        if (reg.waiting && navigator.serviceWorker.controller) handleWaiting(reg.waiting);
        reg.addEventListener('updatefound', function () {
          var worker = reg.installing;
          if (worker) worker.addEventListener('statechange', onStateChange);
        });
        setInterval(checkUpdate, 60 * 60 * 1000);
      }).catch(function () {});
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') checkUpdate();
    });
  }
})();
