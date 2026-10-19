(function () {
  'use strict';

  var frame = document.getElementById('app-frame');
  var loading = document.getElementById('app-loading');
  var error = document.getElementById('app-error');
  var retry = document.getElementById('retry');
  var EXIT_KEYS = { 10182: true, 27: true }; // TV Exit and Escape
  var BACK_KEY = 10009;
  var loaded = false;

  function openInTvBrowser(url) {
    if (!url || url.indexOf('https://lttlmario.github.io/cinema-library/') !== 0) return;
    try {
      if (window.tizen && tizen.application && typeof tizen.application.findAppControl === 'function' && typeof tizen.application.launchAppControl === 'function' && typeof tizen.ApplicationControl === 'function') {
        var control = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view', url, 'text/html', null);
        tizen.application.findAppControl(control, function (apps, resolvedControl) {
          var browser = (apps || []).find(function (app) {
            return app && (app.id === 'org.tizen.browser' || app.id === 'com.samsung.browser');
          });
          tizen.application.launchAppControl(resolvedControl || control, browser ? browser.id : null, function () {
            window.setTimeout(exitApplication, 350);
          }, function () {
            try { window.open(url, '_blank'); } catch (_) {}
          });
        }, function () {
          try { window.open(url, '_blank'); } catch (_) {}
        });
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

  function goBack() {
    try {
      if (frame && frame.contentWindow && frame.contentWindow.history && frame.contentWindow.history.length > 1) {
        frame.contentWindow.history.back();
        return;
      }
    } catch (_) {
      // Cross-origin history is intentionally protected by the TV browser.
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
    frame.src = 'https://lttlmario.github.io/cinema-library/?tv=1&v=20261020-5';
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
})();
