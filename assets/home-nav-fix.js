(function () {
  function centerSearch() {
    const input = document.querySelector('#search');
    const clear = document.querySelector('#search-clear');
    const suggestions = document.querySelector('#search-suggestions');
    if (!input) return;

    // The shell header is the fixed sidebar. Move the floating search layer
    // to body so fixed coordinates are relative to the actual viewport.
    [input, clear, suggestions].forEach((element) => {
      if (element && element.parentElement !== document.body) document.body.appendChild(element);
    });

    const width = Math.min(420, Math.max(240, window.innerWidth * 0.6));
    const left = Math.round(window.innerWidth / 2);
    input.style.position = 'fixed';
    input.style.left = `${left}px`;
    input.style.top = '14px';
    input.style.right = 'auto';
    input.style.bottom = 'auto';
    input.style.transform = 'translateX(-50%)';
    input.style.width = `${width}px`;
    input.style.height = '42px';
    input.style.display = 'block';
    input.style.zIndex = '600';
    input.style.background = '#141419';
    input.style.color = '#f4f4f5';

    if (clear) {
      clear.style.position = 'fixed';
      clear.style.left = `${left + width / 2 - 30}px`;
      clear.style.right = 'auto';
      clear.style.top = '25px';
      clear.style.bottom = 'auto';
      clear.style.zIndex = '601';
    }
    if (suggestions) {
      suggestions.style.position = 'fixed';
      suggestions.style.left = `${left}px`;
      suggestions.style.top = '64px';
      suggestions.style.transform = 'translateX(-50%)';
      suggestions.style.width = `${width}px`;
      suggestions.style.zIndex = '610';
    }
  }

  function bind() {
    const header = document.querySelector('.cinema-shell-header, #header');
    if (!header || header.dataset.homeNavFix === '1') return;
    header.dataset.homeNavFix = '1';

    // The legacy home script also touches .nav-link.active. Restore the
    // page-level active state after it finishes, so it stays red.
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const currentType = new URLSearchParams(location.search).get('type');
    const activeKey = currentPage === 'catalog.html' && currentType === 'movie' ? 'movies'
      : currentPage === 'catalog.html' && currentType === 'tv' ? 'series'
      : currentPage === 'index.html' || currentPage === '' ? 'home' : '';
    const restoreActive = () => {
      header.querySelectorAll('.nav-link').forEach((item) => {
        const shouldBeActive = header.id === 'header'
          ? (activeKey === 'home' && item.dataset.nav === 'home')
          : (activeKey === 'home'
            ? item.tagName === 'A' && (item.getAttribute('href') || '').endsWith('index.html')
            : item.dataset.shellMenu === activeKey);
        item.classList.toggle('active', shouldBeActive);
      });
    };
    restoreActive();
    [0, 250, 1000].forEach((delay) => setTimeout(restoreActive, delay));
    const activeObserver = new MutationObserver(restoreActive);
    activeObserver.observe(header, { subtree: true, attributes: true, attributeFilter: ['class'] });

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
        searchWrap.classList.remove('open');
        centerSearch();
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
  if (!document.documentElement.dataset.globalSearchFix) {
    document.documentElement.dataset.globalSearchFix = '1';
    document.addEventListener('click', (event) => {
      const toggle = event.target.closest?.('#search-toggle');
      if (!toggle) return;
      const wrap = document.querySelector('#search-wrap');
      const input = document.querySelector('#search');
      if (!wrap || !input) return;
      event.preventDefault();
      event.stopPropagation();
      wrap.classList.add('search-open', 'open');
      centerSearch();
      input.focus();
    }, true);
  }
  window.addEventListener('resize', centerSearch);
  document.addEventListener('DOMContentLoaded', bind, { once: true });
  new MutationObserver(bind).observe(document.documentElement, { childList: true, subtree: true });
})();
