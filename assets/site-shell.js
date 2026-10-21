(function () {
  if (document.querySelector('.cinema-shell-header')) return;
  const path = location.pathname;
  const match = path.match(/^(.*\/cinema-library)(?:\/|$)/i);
  const base = match ? `${location.origin}${match[1]}/` : new URL('./', location.href).href;
  const appUrl = (value) => new URL(value, base).href;
  const page = (path.split('/').pop() || 'index.html').toLowerCase();
  const isHome = page === 'index.html' || page === '';
  const query = new URLSearchParams(location.search);
  const catalogType = query.get('type');
  const active = page === 'catalog.html' && catalogType === 'movie' ? 'movies'
    : page === 'catalog.html' && catalogType === 'tv' ? 'series'
    : isHome ? 'home' : '';
  const menus = {
    movies: [['Toate filmele', 'catalog.html?type=movie'], ['Lansări recente', 'catalog.html?type=movie&sort=latest'], ['Cele mai apreciate', 'catalog.html?type=movie&sort=top']],
    series: [['Toate serialele', 'catalog.html?type=tv'], ['Seriale recente', 'catalog.html?type=tv&sort=latest'], ['Cele mai apreciate', 'catalog.html?type=tv&sort=top']],
    top: [['Top filme', 'catalog.html?mode=top&type=movie'], ['Top seriale', 'catalog.html?mode=top&type=tv']]
  };
  const nav = [['Home', 'index.html', 'home'], ['Movies', '', 'movies'], ['TV Shows', '', 'series']];
  document.documentElement.classList.add('cinema-shell-page');
  document.body.classList.add('cinema-shell-page');
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = appUrl('assets/site-shell.css?v=20261021-tflix-skin10'); document.head.append(css);
  const parityCss = document.createElement('link'); parityCss.rel = 'stylesheet'; parityCss.href = appUrl('assets/nav-parity.css?v=20261021-6'); document.head.append(parityCss);
  const main = document.querySelector('body>main');
  document.querySelectorAll('body>header,body>.top,body>footer').forEach((node) => node.remove());
  const navHtml = nav.map(([label, href, key]) => menus[key]
    ? `<div class="nav-dropdown"><button class="nav-link ${active === key ? 'active' : ''}" type="button" data-shell-menu="${key}" data-menu="shell-${key}">${label}</button><div class="nav-submenu" id="shell-${key}">${menus[key].map(([text, target]) => `<a href="${target}">${text}</a>`).join('')}</div></div>`
    : `<a class="nav-link ${active === key ? 'active' : ''}" href="${href}">${label}</a>`).join('');
  const header = document.createElement('header');
  header.className = 'cinema-shell-header';
  header.id = 'header';
  header.innerHTML = `<div class="logo" id="logo">Cinema Library</div><button class="home-mobile-menu mobile-nav-toggle" id="home-mobile-menu" type="button" aria-expanded="false" aria-controls="home-nav" aria-label="Deschide meniul">☰</button><nav class="nav-links" id="home-nav" aria-label="Main navigation">${navHtml}<button class="library-nav-btn" id="favorites-nav" type="button" title="Open watchlist">▣<span>Watchlist</span></button><div class="search-wrap" id="search-wrap"><button class="search-toggle" id="search-toggle" type="button" aria-label="Search">⌕<span>Search</span></button><input id="search" type="text" placeholder="Search movies and series…" autocomplete="off"><button id="search-clear" type="button" aria-label="Clear">✕</button></div></nav>`;
  document.body.prepend(header);
  if (!isHome && main && !document.querySelector('.shell-hero')) {
    const hero = document.createElement('section'); hero.className = 'shell-hero'; hero.setAttribute('aria-label', 'Titluri populare');
    hero.innerHTML = '<div class="shell-hero-copy"><small>Cinema Library</small><h1>Filme și seriale pentru tine</h1><p>Descoperă titluri populare și găsește rapid următoarea vizionare.</p></div>';
    document.body.insertBefore(hero, main);
    ['7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', '8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', 'tmU7GeKVybMWFButWEGl2M4GeiP.jpg', 'q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'].forEach((image, index) => { const slide = document.createElement('div'); slide.className = `shell-hero-slide${index === 0 ? ' active' : ''}`; slide.style.backgroundImage = `url('https://image.tmdb.org/t/p/w1280/${image}')`; hero.prepend(slide); });
    let slideIndex = 0; setInterval(() => { const slides = hero.querySelectorAll('.shell-hero-slide'); slides[slideIndex]?.classList.remove('active'); slideIndex = (slideIndex + 1) % slides.length; slides[slideIndex]?.classList.add('active'); }, 8000);
  }
  const footerMarkup = `<div class="footer-main"><div class="footer-links"><div><h3>Linkuri</h3><a href="catalog.html?type=movie">Filme</a><a href="catalog.html?type=tv">Seriale</a><a href="watch-together.html">Vezi împreună</a><a href="catalog.html?mode=top">Top IMDB</a></div><div><h3>Genuri</h3><a href="genres.html">Toate genurile</a><a href="catalog.html?type=movie&genre=28">Filme de acțiune</a><a href="catalog.html?type=movie&genre=27">Filme horror</a><a href="catalog.html?type=movie&genre=878">Filme SF</a><a href="catalog.html?type=movie&genre=53">Filme thriller</a></div><div><h3>Informații</h3><a href="contact.html">Contact</a><a href="terms.html">Termeni și condiții</a><a href="sitemap.html">Hartă site</a><a href="privacy.html">Confidențialitate</a></div></div><div class="footer-about"><h3>Despre noi</h3><p>Cinema Library este un catalog pentru filme și seriale, cu linkuri către servicii media terțe.</p><p>Nu stocăm fișiere video pe serverele noastre; disponibilitatea și subtitrările pot varia în funcție de sursă.</p><div class="footer-features"><span>♛ Calitate înaltă</span><span>▶ Gratuit, mereu</span><span>ϟ Încărcare rapidă</span><span>▣ Subtitrări multiple</span></div><div class="footer-downloads"><h3>Descarcă aplicația</h3><div class="download-grid"><a class="download-card" href="download.html?platform=desktop"><span class="download-icon">▣</span><span><strong>Desktop</strong><small>Windows · .exe</small></span><span class="download-arrow">↓</span></a><a class="download-card" href="download.html?platform=android"><span class="download-icon">▣</span><span><strong>Android</strong><small>APK · vezi releases</small></span><span class="download-arrow">↓</span></a><a class="download-card download-card-disabled" href="download.html?platform=ios"><span class="download-icon">●</span><span><strong>iOS</strong><small>Disponibil în curând</small></span></a></div></div></div></div><div class="footer-bottom"><span class="footer-copy">© 2026 Cinema Library</span><div class="footer-bottom-links"><a href="sitemap.html">Hartă site</a><a href="contact.html">Contact</a><a href="terms.html">Termeni și condiții</a><a href="privacy.html">Confidențialitate</a></div></div>`;
  const normalizeLinks = (root = document) => root.querySelectorAll('a[href]').forEach((link) => { const href = link.getAttribute('href'); if (href && !/^(?:[a-z]+:|\/\/|#)/i.test(href)) link.href = appUrl(href); });
  const mountFooter = () => { document.querySelectorAll('body>footer').forEach((node) => node.remove()); const footer = document.createElement('footer'); footer.className = 'site-footer'; footer.innerHTML = footerMarkup; document.body.append(footer); normalizeLinks(footer); };
  if (main) mountFooter(); else document.addEventListener('DOMContentLoaded', mountFooter, { once: true });
  normalizeLinks(header);
  if (!isHome) {
  const theme = document.getElementById('theme-toggle');
  if (localStorage.getItem('cinemalibrary_theme') === 'light') document.documentElement.dataset.theme = 'light';
  if (theme) theme.onclick = () => { const light = document.documentElement.dataset.theme === 'light'; document.documentElement.dataset.theme = light ? '' : 'light'; localStorage.setItem('cinemalibrary_theme', light ? 'dark' : 'light'); };
  document.getElementById('favorites-nav').onclick = () => { location.href = appUrl('index.html#favorites'); };
  const search = document.getElementById('search');
  const searchWrap = document.getElementById('search-wrap');
  document.getElementById('search-toggle').onclick = () => { searchWrap.classList.add('search-open'); search.focus(); };
  search.onkeydown = (event) => { if (event.key === 'Enter' && search.value.trim()) location.href = appUrl(`index.html?search=${encodeURIComponent(search.value.trim())}`); };
  document.getElementById('search-clear').onclick = () => { search.value = ''; search.focus(); };
  document.querySelectorAll('[data-shell-menu]').forEach((button) => button.addEventListener('click', (event) => { event.stopPropagation(); const menu = document.getElementById(`shell-${button.dataset.shellMenu}`); document.querySelectorAll('.nav-submenu.open').forEach((item) => { if (item !== menu) item.classList.remove('open'); }); menu.classList.toggle('open'); }));
  document.addEventListener('click', () => document.querySelectorAll('.nav-submenu.open').forEach((item) => item.classList.remove('open')));
  const mobileToggle = document.getElementById('home-mobile-menu'), navElement = document.getElementById('home-nav'); mobileToggle.onclick = (event) => { event.stopPropagation(); const open = navElement.classList.toggle('mobile-open'); mobileToggle.setAttribute('aria-expanded', String(open)); }; navElement.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => navElement.classList.remove('mobile-open')));
  }

  // Search is part of the TFlix rail on every page, including the home page.
  // Bind it outside the non-home block so the visual rail remains functional.
  const shellSearch = document.getElementById('search');
  const shellSearchWrap = document.getElementById('search-wrap');
  const shellSearchToggle = document.getElementById('search-toggle');
  if (shellSearch && shellSearchWrap && shellSearchToggle && !shellSearchToggle.dataset.bound) {
    shellSearchToggle.dataset.bound = '1';
    shellSearchToggle.onclick = () => { shellSearchWrap.classList.add('search-open'); shellSearch.focus(); };
    shellSearch.onkeydown = (event) => { if (event.key === 'Enter' && shellSearch.value.trim()) location.href = appUrl(`index.html?search=${encodeURIComponent(shellSearch.value.trim())}`); };
    document.getElementById('search-clear')?.addEventListener('click', () => { shellSearch.value = ''; shellSearch.focus(); });
  }

  // The home page uses the same injected rail, so its dropdowns and watchlist
  // must receive handlers too (the old code only wired secondary pages).
  if (isHome) {
    document.getElementById('favorites-nav')?.addEventListener('click', () => { location.href = appUrl('index.html#favorites'); });
    document.querySelectorAll('[data-shell-menu]').forEach((button) => {
      if (button.dataset.bound) return;
      button.dataset.bound = '1';
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const menu = document.getElementById(`shell-${button.dataset.shellMenu}`);
        document.querySelectorAll('.nav-submenu.open').forEach((item) => { if (item !== menu) item.classList.remove('open'); });
        menu?.classList.toggle('open');
      });
    });
    if (!document.body.dataset.shellMenuCloseBound) {
      document.body.dataset.shellMenuCloseBound = '1';
      document.addEventListener('click', () => document.querySelectorAll('.nav-submenu.open').forEach((item) => item.classList.remove('open')));
    }
  }

  // Launch every direct stream link in the same Rioma fullscreen surface.
  // This keeps catalog, genres and watch-together consistent with the home
  // modal without navigating to a separate details/player page.
  function openRiomaFromLink(href) {
    let overlay = document.getElementById('rioma-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'rioma-overlay';
      overlay.className = 'rioma-overlay';
      overlay.hidden = true;
      overlay.innerHTML = '<iframe id="rioma-overlay-frame" title="Player Rioma" allowfullscreen allow="autoplay *; encrypted-media *; picture-in-picture *; fullscreen *; web-share *"></iframe>';
      document.body.append(overlay);
      const style = document.createElement('style');
      style.textContent = '.rioma-overlay{position:fixed;inset:0;z-index:10000;background:#000}.rioma-overlay[hidden]{display:none}.rioma-overlay iframe{display:block;width:100%;height:100%;border:0;background:#000}';
      document.head.append(style);
    }
    const frame = document.getElementById('rioma-overlay-frame');
    const destination = new URL(href, document.baseURI);
    destination.searchParams.set('embedded', '1');
    frame.src = destination.href;
    overlay.hidden = false;
    overlay.classList.add('open');
    const request = overlay.requestFullscreen || overlay.webkitRequestFullscreen;
    if (request) { try { Promise.resolve(request.call(overlay)).catch(() => {}); } catch {} }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || link.target === '_blank') return;
    const url = new URL(link.href, document.baseURI);
    if (!/(?:^|\/)stream\/(?:index\.html)?$/i.test(url.pathname.replace(/\/$/, '/'))) return;
    event.preventDefault();
    openRiomaFromLink(url.href);
  });
})();
