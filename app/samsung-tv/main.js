(function () {
  'use strict';

  const frame = document.getElementById('app-frame');
  const EXIT_KEYS = new Set([10182, 27]); // TV Exit and Escape
  const BACK_KEY = 10009;

  function currentApplication() {
    try {
      return window.tizen?.application?.getCurrentApplication?.() || null;
    } catch (_) {
      return null;
    }
  }

  function exitApplication() {
    currentApplication()?.exit?.();
  }

  function goBack() {
    try {
      if (frame?.contentWindow && frame.contentWindow.history.length > 1) {
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
    } else if (EXIT_KEYS.has(keyCode)) {
      event.preventDefault();
      exitApplication();
    }
  }, true);

  window.addEventListener('error', () => {
    if (!frame || frame.dataset.failed) return;
    frame.dataset.failed = 'true';
    frame.src = 'https://lttlmario.github.io/cinema-library/';
  });
})();
