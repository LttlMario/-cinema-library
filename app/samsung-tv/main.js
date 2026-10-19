(function () {
  'use strict';

  var frame = document.getElementById('app-frame');
  var loading = document.getElementById('app-loading');
  var error = document.getElementById('app-error');
  var retry = document.getElementById('retry');
  var EXIT_KEYS = { 10182: true, 27: true }; // TV Exit and Escape
  var BACK_KEY = 10009;
  var loaded = false;

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

  document.addEventListener('keydown', (event) => {
    const keyCode = Number(event.keyCode || event.which);
    if (keyCode === BACK_KEY) {
      event.preventDefault();
      goBack();
    } else if (EXIT_KEYS[keyCode]) {
      event.preventDefault();
      exitApplication();
    }
  }, true);

  frame.addEventListener('load', function () {
    loaded = true;
    loading.hidden = true;
    error.hidden = true;
  });

  function retryLoad() {
    loaded = false;
    loading.hidden = false;
    error.hidden = true;
    frame.src = 'https://lttlmario.github.io/cinema-library/?tv=1';
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
