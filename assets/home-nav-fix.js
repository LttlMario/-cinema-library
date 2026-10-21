(function () {
  function bind() {
    const header = document.querySelector('.cinema-shell-header');
    if (!header || header.dataset.homeNavFix === '1') return;
    header.dataset.homeNavFix = '1';

    const pageBase = new URL('./', location.href);
    const go = (path) => { location.href = new URL(path, pageBase).href; };

    const favorites = header.querySelector('#favorites-nav');
    if (favorites && !favorites.dataset.homeNavFixBound) {
      favorites.dataset.homeNavFixBound = '1';
      favorites.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        go('index.html#favorites');
      });
    }

    header.querySelectorAll('[data-shell-menu]').forEach((button) => {
      if (button.dataset.homeNavFixBound) return;
      button.dataset.homeNavFixBound = '1';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const menu = header.querySelector(`#shell-${button.dataset.shellMenu}`);
        if (!menu) return;
        header.querySelectorAll('.nav-submenu.open').forEach((item) => {
          if (item !== menu) item.classList.remove('open');
        });
        menu.classList.toggle('open');
      });
    });

    const searchToggle = header.querySelector('#search-toggle');
    const searchWrap = header.querySelector('#search-wrap');
    const search = header.querySelector('#search');
    if (searchToggle && searchWrap && search && !searchToggle.dataset.homeNavFixBound) {
      searchToggle.dataset.homeNavFixBound = '1';
      searchToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        searchWrap.classList.add('search-open');
        search.focus();
      });
      search.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && search.value.trim()) {
          go(`index.html?search=${encodeURIComponent(search.value.trim())}`);
        }
      });
    }

    if (!document.body.dataset.homeNavFixCloseBound) {
      document.body.dataset.homeNavFixCloseBound = '1';
      document.addEventListener('click', () => {
        header.querySelectorAll('.nav-submenu.open').forEach((item) => item.classList.remove('open'));
      });
    }
  }

  bind();
  document.addEventListener('DOMContentLoaded', bind, { once: true });
  new MutationObserver(bind).observe(document.documentElement, { childList: true, subtree: true });
})();
