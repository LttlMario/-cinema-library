(function () {
  'use strict';

  var isTv = false;
  try {
    isTv = new URLSearchParams(window.location.search).get('tv') === '1'
      || sessionStorage.getItem('cinemalibrary_tv_mode') === '1';
    if (isTv) sessionStorage.setItem('cinemalibrary_tv_mode', '1');
  } catch (_) {}
  if (!isTv || document.querySelector('.tv-pointer-cursor')) return;

  document.documentElement.classList.add('tv-mode');
  var style = document.createElement('style');
  style.textContent = '.tv-pointer-cursor{position:fixed;left:0;top:0;width:34px;height:34px;display:grid;place-items:center;pointer-events:none;z-index:10001;color:#fff;font:900 27px/1 Arial,sans-serif;text-shadow:0 2px 5px #000,0 0 4px #000;filter:drop-shadow(0 0 5px rgba(229,9,20,.95));transition:left .06s ease-out,top .06s ease-out}.tv-pointer-cursor:before{content:"◀"}.tv-pointer-hover{outline:4px solid #ff5260!important;outline-offset:4px;box-shadow:0 0 0 8px rgba(229,9,20,.22),0 14px 34px rgba(0,0,0,.65)!important}.free-pointer .tv-pointer-cursor{display:grid}';
  document.head.appendChild(style);

  var cursor = document.createElement('div');
  cursor.className = 'tv-pointer-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);
  var x = Math.round(window.innerWidth / 2);
  var y = Math.round(window.innerHeight / 2);
  var target = null;
  var speed = 26;

  function updateTarget() {
    if (target) target.classList.remove('tv-pointer-hover');
    var hit = document.elementFromPoint(x + 16, y + 16);
    target = hit && hit.closest ? hit.closest('button,a,input,select,[role="button"],.card,.nav-link,.server-card') : null;
    if (target) target.classList.add('tv-pointer-hover');
  }

  document.addEventListener('keydown', function (event) {
    var key = event.key || '';
    var dx = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : 0;
    var dy = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? 1 : 0;
    if (dx || dy) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.documentElement.classList.add('free-pointer');
      x = Math.max(4, Math.min(innerWidth - 38, x + dx * speed));
      y = Math.max(4, Math.min(innerHeight - 38, y + dy * speed));
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';
      updateTarget();
      return;
    }
    if ((key === 'Enter' || event.keyCode === 13) && target) {
      event.preventDefault();
      event.stopImmediatePropagation();
      target.click();
    }
  }, true);

  document.addEventListener('mousemove', function () {
    document.documentElement.classList.remove('free-pointer');
    if (target) { target.classList.remove('tv-pointer-hover'); target = null; }
  }, { passive: true });
  cursor.style.left = x + 'px';
  cursor.style.top = y + 'px';
  updateTarget();
})();
