(function () {
  'use strict';

  var frame = document.getElementById('app-frame');
  var loading = document.getElementById('app-loading');
  var error = document.getElementById('app-error');
  var retry = document.getElementById('retry');
  var EXIT_KEYS = { 10182: true, 27: true }; // TV Exit and Escape
  var BACK_KEY = 10009;
  var loaded = false;

  function inspectBrowserHandlers() {
    try {
      if (!window.tizen || !tizen.application || typeof tizen.application.findAppControl !== 'function' || typeof tizen.ApplicationControl !== 'function') return;
      var probe = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view', 'https://lttlmario.github.io/cinema-library/', null, null);
      tizen.application.findAppControl(probe, function (apps) {
        console.log('[CinemaLibrary] browser handlers: ' + (apps || []).map(function (app) { return app.id + ' / ' + app.name; }).join(' | '));
      }, function (error) {
        console.log('[CinemaLibrary] findAppControl failed: ' + (error && error.message ? error.message : 'unknown'));
      });
    } catch (error) {
      console.log('[CinemaLibrary] browser probe exception: ' + (error && error.message ? error.message : 'unknown'));
    }
  }

  function openInTvBrowser(url) {
    if (!url || url.indexOf('https://lttlmario.github.io/cinema-library/') !== 0) return;
    try {
      if (window.tizen && tizen.application && typeof tizen.application.launchAppControl === 'function' && typeof tizen.ApplicationControl === 'function') {
        var operation = 'http://tizen.org/appcontrol/operation/view';
        var control = new tizen.ApplicationControl(operation, url, null, null, null, 'SINGLE');
        var fallback = function () {
          try {
            var implicitControl = new tizen.ApplicationControl(operation, url, null, null, null, 'SINGLE');
            tizen.application.launchAppControl(implicitControl, null, function () {
              window.setTimeout(hideApplication, 350);
            }, function () { try { window.open(url, '_blank'); } catch (_) {} }, null);
          } catch (_) { try { window.open(url, '_blank'); } catch (_) {} }
        };
        console.log('[CinemaLibrary] requesting browser for ' + url);
        tizen.application.launchAppControl(control, null, function () {
          console.log('[CinemaLibrary] implicit browser launch succeeded');
          window.setTimeout(hideApplication, 350);
        }, function (error) {
          console.log('[CinemaLibrary] implicit browser launch failed: ' + (error && error.message ? error.message : 'unknown'));
          fallback();
        }, null);
        return;
      }
    } catch (_) {}
    try { window.open(url, '_blank'); } catch (_) {}
  }

  function currentApplication() {
    try {
      if (window.tizen && tizen.application && typeof tizen.application.getCurrentApplication === 'function') {
        return tizen.application.getCurrentApplication();
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  function exitApplication() {
    var app = currentApplication();
    if (app && typeof app.exit === 'function') app.exit();
  }

  function hideApplication() {
    try {
      var app = currentApplication();
      if (app && typeof app.hide === 'function') { app.hide(); return; }
    } catch (_) {}
    exitApplication();
  }

  function goBack() {
    try {
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({ type: 'cinema:remote-key', key: 'Back' }, '*');
        return;
      }
    } catch (_) {
      // Fall through to the application exit if the embedded page is unavailable.
    }
    exitApplication();
  }

  function focusFrame() {
    try {
      frame.setAttribute('tabindex', '0');
      frame.focus();
    } catch (_) {
      // Some older TV WebViews do not expose focus on iframe elements.
    }
  }

  function handleKeydown(event) {
    const keyCode = Number(event.keyCode || event.which);
    if (keyCode === BACK_KEY) {
      event.preventDefault();
      goBack();
    } else if (EXIT_KEYS[keyCode]) {
      event.preventDefault();
      exitApplication();
    } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].indexOf(event.key) !== -1) {
      try { frame.contentWindow.postMessage({ type: 'cinema:remote-key', key: event.key }, '*'); } catch (_) {}
    }
  }

  function handleHardwareKey(event) {
    var keyName = String((event && event.keyName) || '').toLowerCase();
    if (keyName === 'back') {
      event.preventDefault();
      goBack();
    } else if (keyName === 'exit') {
      event.preventDefault();
      exitApplication();
    }
  }

  // Samsung Smart Remote sends Back/Exit through this Tizen-specific event.
  document.addEventListener('tizenhwkey', handleHardwareKey, false);
  document.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('message', function (event) {
    if (event.origin !== 'https://lttlmario.github.io') return;
    var data = event.data || {};
    if (data.type === 'open-in-tv-browser') openInTvBrowser(String(data.url || ''));
  }, false);

  frame.addEventListener('load', function () {
    loaded = true;
    loading.hidden = true;
    error.hidden = true;
    focusFrame();
    window.setTimeout(focusFrame, 150);
  });

  function retryLoad() {
    loaded = false;
    loading.hidden = false;
    error.hidden = true;
    frame.src = 'https://lttlmario.github.io/cinema-library/?tv=1&v=20261020-tv-fast-v1';
    window.setTimeout(showError, 12000);
  }

  function showError() {
    if (!loaded) {
      loading.hidden = true;
      error.hidden = false;
    }
  }

  retry.addEventListener('click', retryLoad);
  window.setTimeout(showError, 12000);
  window.setTimeout(inspectBrowserHandlers, 1000);
})();

