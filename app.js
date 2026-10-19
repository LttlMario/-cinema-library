const cfg = window.CINEMA_CONFIG || {};
const img = cfg.imageBaseUrl || 'https://image.tmdb.org/t/p/w500';
const backdrop = cfg.backdropBaseUrl || 'https://image.tmdb.org/t/p/w1280';
const api = 'https://api.themoviedb.org/3';
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const getApiKey = () => localStorage.getItem('cinema_tmdb_api_key') || (cfg.tmdbApiKey && !cfg.tmdbApiKey.includes('INTRODU') ? cfg.tmdbApiKey : '');
const setupBox = () => '<div class="setup"><h2>Configurează catalogul</h2><p>Introdu cheia TMDB. Este salvată doar în acest browser și nu este inclusă în repository.</p><input id="tmdbKey" type="password" placeholder="TMDB API key"><button id="saveKey" class="button">Salvează cheia</button></div>';
async function tmdb(path) {
  const key = getApiKey();
  if (!key) throw Error('SETUP_TMDB');
  const response = await fetch(`${api}${path}${path.includes('?') ? '&' : '?'}api_key=${encodeURIComponent(key)}&language=${encodeURIComponent(cfg.tmdbLanguage || 'ro-RO')}`);
  if (!response.ok) throw Error(`TMDB a răspuns cu ${response.status}`);
  return response.json();
}
const genres = {28:'Acțiune',12:'Aventură',16:'Animație',35:'Comedie',80:'Crimă',99:'Documentar',18:'Dramă',10751:'Familie',14:'Fantezie',36:'Istorie',27:'Groază',10402:'Muzică',9648:'Mister',10749:'Romantic',878:'SF',10770:'Film TV',53:'Thriller',10752:'Război',37:'Western'};
const countries = {US:'Statele Unite',GB:'Marea Britanie',FR:'Franța',CA:'Canada',JP:'Japonia',KR:'Coreea de Sud',DE:'Germania',IN:'India',IT:'Italia',AU:'Australia',ES:'Spania',CN:'China',BE:'Belgia',MX:'Mexic',SE:'Suedia',PL:'Polonia',BR:'Brazilia',TR:'Turcia',RU:'Rusia'};
const defaultPlayers = window.CINEMA_PLAYERS || [
  {id:'principal', label:'Player principal', icon:'▶'},
  {id:'alternativ', label:'Player alternativ', icon:'◉'},
  {id:'server3', label:'Server 3', icon:'◆'},
  {id:'server4', label:'Server 4', icon:'◇'}
];
const sources = window.CINEMA_SOURCES || {};
function sourceKey(type,id,season,episode){ return season && episode ? `${type}:${id}:s${season}e${episode}` : `${type}:${id}`; }
function sourceMap(type,id,season,episode){
  const current = sources[sourceKey(type,id,season,episode)] || sources[`${type}:${id}`] || sources[String(id)] || {};
  if (Array.isArray(current)) return Object.fromEntries(current.map((item,index)=>[(defaultPlayers[index]||{}).id || `server${index+1}`, item]));
  return current;
}
function playerStatus(type,id,player,season,episode){ const value = sourceMap(type,id,season,episode)[player.id]; return value && typeof value.url === 'string' && value.url.trim() ? 'ready' : 'empty'; }
function safeUrl(value){ try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch (_) { return ''; } }
function year(item){ return (item.release_date || item.first_air_date || '').slice(0,4); }
function title(item){ return item.title || item.name || 'Fără titlu'; }
function typeLabel(type){ return type === 'tv' ? 'Serial' : 'Film'; }
function setupKeyHandler(){ $('#saveKey')?.addEventListener('click', () => { const key = $('#tmdbKey')?.value.trim(); if(key){ localStorage.setItem('cinema_tmdb_api_key', key); location.reload(); } }); }
function injectShell(){
  if ($('#siteHeader')) return;
  document.body.insertAdjacentHTML('afterbegin', `<header id="siteHeader" class="site-header"><div class="header-inner"><button id="menuToggle" class="menu-toggle" aria-label="Deschide meniul">☰</button><a class="brand" href="index.html">CINEMA<span>LIBRARY</span></a><nav class="desktop-nav"><a href="index.html">Acasă</a><a href="movies.html">Filme</a><a href="series.html">Seriale</a><a href="genres.html">Genuri</a><a href="countries.html">Țări</a><a href="movies.html?sort=vote_average.desc">Top IMDb</a></nav><div class="header-tools"><button id="headerSearchButton" class="icon-button" aria-label="Caută">⌕</button></div></div><div id="mobileNav" class="mobile-nav"><a href="index.html">Acasă</a><a href="movies.html">Filme</a><a href="series.html">Seriale</a><a href="genres.html">Genuri</a><a href="countries.html">Țări</a><a href="movies.html?sort=vote_average.desc">Top IMDb</a></div><div id="searchPanel" class="search-panel"><input id="globalSearch" placeholder="Introdu cuvinte cheie..." autocomplete="off"><button id="globalSearchButton" class="button">Caută</button></div></header>`);
  document.body.insertAdjacentHTML('beforeend', '<footer class="site-footer"><div><a class="brand small-brand" href="index.html">CINEMA<span>LIBRARY</span></a><p>Catalog personal cu metadate TMDB și playere configurabile.</p></div><div><h4>Linkuri</h4><a href="movies.html">Filme</a><a href="series.html">Seriale</a><a href="genres.html">Genuri</a></div><div><h4>Informații</h4><a href="index.html">Despre catalog</a><a href="genres.html">Hartă genuri</a></div><p class="copyright">Metadate furnizate de TMDB. Conținutul iframe trebuie să fie autorizat.</p></footer>');
  $('#menuToggle')?.addEventListener('click', () => $('#mobileNav')?.classList.toggle('open'));
  $('#headerSearchButton')?.addEventListener('click', () => $('#searchPanel')?.classList.toggle('open'));
  const runSearch = () => { const query = $('#globalSearch')?.value.trim(); if(query) location.href = `movies.html?query=${encodeURIComponent(query)}`; };
  $('#globalSearchButton')?.addEventListener('click', runSearch);
  $('#globalSearch')?.addEventListener('keydown', event => { if(event.key === 'Enter') runSearch(); });
}
function card(item){
  const type = item.media_type || item._type || (item.first_air_date ? 'tv' : 'movie');
  const image = item.poster_path ? `<img src="${img + item.poster_path}" alt="" loading="lazy">` : '<span>Fără poster</span>';
  const labels = (item.genre_ids || []).slice(0,2).map(id => genres[id]).filter(Boolean).join(', ');
  const status = defaultPlayers.map(player => playerStatus(type,item.id,player)).some(x => x === 'ready');
  return `<a class="media-card" href="detail.html?id=${encodeURIComponent(item.id)}&type=${type}"><div class="poster-wrap"><div class="poster">${image}</div><span class="quality-badge">${item.vote_average >= 7 ? 'HD' : 'ONLINE'}</span><span class="play-overlay">▶</span></div><div class="card-info"><h3>${esc(title(item))}</h3><p>${esc(year(item))} <span>•</span> ${typeLabel(type)}</p><p class="card-genres">${esc(labels || 'Catalog')}</p>${status ? '<span class="ready-label">Player configurat</span>' : '<span class="ready-label muted-label">Player neconfigurat</span>'}</div></a>`;
}
function episodeCard(item,type='tv'){
  return `<a class="episode-card" href="detail.html?id=${item.id}&type=${type}"><div class="episode-poster">${item.poster_path ? `<img src="${img+item.poster_path}" alt="" loading="lazy">` : ''}<span class="episode-play">▶</span></div><div><small>SERIAL</small><h3>${esc(title(item))}</h3><p>${esc(item.overview || 'Descoperă detaliile și episoadele disponibile.')}</p></div></a>`;
}
function renderGrid(selector,items){ const node=$(selector); if(node) node.innerHTML = items.length ? items.map(card).join('') : '<p class="empty-state">Nu există rezultate pentru filtrele alese.</p>'; }
async function home(){
  if(!$('#homePage')) return;
  try{
    const [trending, movies, series] = await Promise.all([tmdb('/trending/all/week'), tmdb('/movie/now_playing'), tmdb('/tv/on_the_air')]);
    const all = (trending.results || []).filter(x => x.media_type === 'movie' || x.media_type === 'tv');
    renderGrid('#trendingGrid', all.slice(0,12));
    renderGrid('#movieGrid', (movies.results || []).slice(0,6).map(x => ({...x, media_type:'movie'})));
    const episodeNode = $('#episodeGrid');
    if(episodeNode) episodeNode.innerHTML = (series.results || []).slice(0,6).map(x => episodeCard(x,'tv')).join('');
  }catch(error){
    const page = $('#homePage');
    if(error.message === 'SETUP_TMDB') page.innerHTML = setupBox();
    else page.innerHTML = `<div class="error-panel">${esc(error.message)}</div>`;
    setupKeyHandler();
  }
}
function filterOptions(type){
  const genreSelect = $('#genreFilter');
  if(genreSelect) genreSelect.innerHTML = '<option value="">Toate genurile</option>' + Object.entries(genres).map(([id,name]) => `<option value="${id}">${name}</option>`).join('');
  const yearSelect = $('#yearFilter');
  if(yearSelect){ const current = new Date().getFullYear(); yearSelect.innerHTML = '<option value="">Toți anii</option>' + Array.from({length:current-1949},(_,i)=>current-i).map(y=>`<option value="${y}">${y}</option>`).join(''); }
  const countrySelect = $('#countryFilter');
  if(countrySelect) countrySelect.innerHTML = '<option value="">Toate țările</option>' + Object.entries(countries).map(([code,name]) => `<option value="${code}">${name}</option>`).join('');
}
async function catalog(type){
  const page = $('#catalogPage'); if(!page) return;
  filterOptions(type);
  const params = new URLSearchParams(location.search);
  if(params.get('query')) $('#catalogQuery').value = params.get('query');
  if(params.get('sort') && $('#sortFilter')) $('#sortFilter').value = params.get('sort');
  const load = async () => {
    const query = $('#catalogQuery')?.value.trim() || '';
    const genre = $('#genreFilter')?.value || params.get('genre') || '';
    const yearValue = $('#yearFilter')?.value || '';
    const country = $('#countryFilter')?.value || params.get('country') || '';
    const sort = $('#sortFilter')?.value || 'popularity.desc';
    try{
      let data;
      if(query) data = await tmdb(`/search/${type}?query=${encodeURIComponent(query)}&page=1`);
      else data = await tmdb(`/discover/${type}?sort_by=${sort}&with_genres=${encodeURIComponent(genre)}&with_origin_country=${encodeURIComponent(country)}&primary_release_year=${type==='movie' ? encodeURIComponent(yearValue) : ''}&first_air_date_year=${type==='tv' ? encodeURIComponent(yearValue) : ''}&page=1`);
      const results = (data.results || []).map(x => ({...x, media_type:type}));
      renderGrid('#catalogGrid', results);
      const resultCount = $('#resultCount'); if(resultCount) resultCount.textContent = `${data.total_results || results.length} rezultate`;
    }catch(error){ $('#catalogGrid').innerHTML = error.message === 'SETUP_TMDB' ? setupBox() : `<p class="error">${esc(error.message)}</p>`; setupKeyHandler(); }
  };
  $('#applyFilters')?.addEventListener('click', load);
  $('#catalogQuery')?.addEventListener('keydown', e => { if(e.key === 'Enter') load(); });
  load();
}
function actionStore(key){ try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(_) { return []; } }
function setStore(key,value){ localStorage.setItem(key, JSON.stringify(value)); }
function toggleStore(key,value){ const list=actionStore(key); const index=list.indexOf(value); if(index >= 0) list.splice(index,1); else list.push(value); setStore(key,list); return index < 0; }
function detailActions(type,id,item){
  const key = `${type}:${id}`;
  document.querySelectorAll('[data-store]').forEach(button => {
    const applyState = active => {
      button.classList.toggle('active', active);
      button.textContent = active ? button.dataset.activeLabel : button.dataset.label;
    };
    applyState(actionStore(button.dataset.store).includes(key));
    button.addEventListener('click', () => {
      applyState(toggleStore(button.dataset.store, key));
    });
  });
  document.querySelectorAll('[data-trailer]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.trailer;
    if(key) window.open(`https://www.youtube.com/watch?v=${encodeURIComponent(key)}`, '_blank', 'noopener');
    else showNotice('Trailer indisponibil', 'TMDB nu are momentan un trailer YouTube disponibil pentru acest titlu.');
  }));
  document.querySelectorAll('[data-action="party"]').forEach(button => button.addEventListener('click', () => showNotice('Vezi împreună', 'Funcția de cameră este pregătită pentru o integrare viitoare.')));
}
function showNotice(titleText,message){
  let modal=$('#noticeModal');
  if(!modal){ document.body.insertAdjacentHTML('beforeend', '<div id="noticeModal" class="notice-modal"><div class="notice-card"><button class="notice-close">×</button><h3></h3><p></p><button class="button notice-ok">Am înțeles</button></div></div>'); modal=$('#noticeModal'); modal.querySelector('.notice-close').addEventListener('click',()=>modal.classList.remove('open')); modal.querySelector('.notice-ok').addEventListener('click',()=>modal.classList.remove('open')); }
  modal.querySelector('h3').textContent=titleText; modal.querySelector('p').textContent=message; modal.classList.add('open');
}
function playerButtons(type,id,season,episode){
  return defaultPlayers.map(player => {
    const ready = playerStatus(type,id,player,season,episode);
    return `<a class="player-choice ${ready}" href="watch.html?id=${encodeURIComponent(id)}&type=${type}${season ? `&season=${season}&episode=${episode}` : ''}#${player.id}"><span class="player-icon">${player.icon || '▶'}</span><span><b>${esc(player.label)}</b><small>${ready === 'ready' ? 'Disponibil' : 'Nu este configurat'}</small></span><strong>›</strong></a>`;
  }).join('');
}
async function detail(){
  const page=$('#detailPage'); if(!page)return;
  const params=new URLSearchParams(location.search), id=params.get('id'), type=params.get('type')||'movie';
  if(!id){page.innerHTML='<div class="error-panel">Titlu invalid.</div>';return;}
  try{
    const item=await tmdb(`/${type}/${id}`);
    const videos=await tmdb(`/${type}/${id}/videos`).catch(()=>({results:[]}));
    const trailer=(videos.results||[]).find(v=>v.site==='YouTube' && (v.type==='Trailer'||v.type==='Teaser'));
    const genresText=(item.genres||[]).map(g=>g.name).join(', ');
    let episodes='';
    if(type==='tv'){
      const season=await tmdb(`/tv/${id}/season/1`).catch(()=>null);
      if(season?.episodes?.length) episodes=`<section class="episodes-section"><div class="section-title"><h2>Sezonul 1</h2><span>${season.episodes.length} episoade</span></div><div class="episodes-list">${season.episodes.map(ep=>`<a href="watch.html?id=${id}&type=tv&season=1&episode=${ep.episode_number}" class="episode-row"><span class="episode-number">E${String(ep.episode_number).padStart(2,'0')}</span><span><b>${esc(ep.name)}</b><small>${esc(ep.overview||'Episod disponibil pentru configurare')}</small></span><strong>▶</strong></a>`).join('')}</div></section>`;
    }
    page.innerHTML=`<section class="detail-hero" style="--backdrop:url('${item.backdrop_path ? backdrop+item.backdrop_path : ''}')"><div class="detail-backdrop"></div><div class="detail-content"><img class="detail-poster" src="${item.poster_path?img+item.poster_path:''}" alt=""><div class="detail-copy"><div class="eyebrow">${typeLabel(type)} · ${esc(year(item))}</div><h1>${esc(title(item))}</h1><div class="rating-line"><span class="imdb-pill">IMDb</span><b>${item.vote_average ? item.vote_average.toFixed(1) : '—'}</b><span>•</span><span>${esc(genresText || 'Gen necunoscut')}</span></div><p>${esc(item.overview||'Descriere indisponibilă.')}</p><div class="action-row">${`<button class="button trailer-button" data-trailer="${trailer ? esc(trailer.key) : ''}" type="button">▶ Trailer</button>`}<button class="outline-button" data-store="cinema_watched" data-label="Marchează ca vizionat" data-active-label="✓ Vizionat">Marchează ca vizionat</button><button class="outline-button" data-store="cinema_watchlist" data-label="＋ Lista de urmărit" data-active-label="✓ În lista mea">＋ Lista de urmărit</button><button class="outline-button" data-store="cinema_favorites" data-label="♡ Favorite" data-active-label="♥ Favorit">♡ Favorite</button><button class="outline-button" data-action="party">Vezi împreună</button></div></div></div></section><section class="player-section"><div class="section-title"><div><h2>Player-e disponibile</h2><p>Dacă un player nu este configurat, butonul rămâne vizibil și îți explică motivul.</p></div><span>Servere</span></div><div class="player-grid">${playerButtons(type,id)}</div></section>${episodes}<section class="comments-box"><h2>Discuția comunității</h2><p>Comentariile sunt dezactivate momentan pentru acest catalog personal.</p></section>`;
    detailActions(type,id,item);
  }catch(error){page.innerHTML=error.message==='SETUP_TMDB'?setupBox():`<div class="error-panel">${esc(error.message)}</div>`;setupKeyHandler();}
}
async function watch(){
  const page=$('#watchPage'); if(!page)return;
  const params=new URLSearchParams(location.search),id=params.get('id'),type=params.get('type')||'movie',season=params.get('season'),episode=params.get('episode');
  if(!id){page.innerHTML='<div class="error-panel">Player invalid.</div>';return;}
  let item={title:'Titlu video'};
  try{ item=await tmdb(`/${type}/${id}`); }catch(_){}
  const map=sourceMap(type,id,season,episode);
  page.innerHTML=`<section class="watch-head"><a href="detail.html?id=${id}&type=${type}" class="back-link">← Înapoi la detalii</a><div><span class="eyebrow">${typeLabel(type)}${episode ? ` · S${season} E${episode}` : ''}</span><h1>${esc(title(item))}</h1><p>Încearcă unul dintre player-ele de mai jos.</p></div></section><section class="watch-layout"><div class="watch-player-area"><div id="iframeNotice" class="iframe-notice"><span class="notice-symbol">!</span><div><b id="iframeNoticeTitle">Alege un player</b><p id="iframeNoticeText">Selectează un buton pentru a începe.</p></div></div><div id="iframeBox" class="iframe-box hidden"><iframe id="contentFrame" title="Player video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></div><aside class="watch-sidebar"><h2>Servere disponibile</h2><p class="muted">Butoanele sunt afișate pentru fiecare titlu, chiar și înainte de configurarea linkurilor.</p><div class="watch-player-buttons">${defaultPlayers.map(player=>`<button class="watch-player-button ${map[player.id]?.url ? 'ready':''}" data-player="${player.id}" type="button"><span class="player-icon">${player.icon||'▶'}</span><span><b>${esc(player.label)}</b><small>${map[player.id]?.url ? 'Configurat' : 'Nu este configurat'}</small></span><strong>›</strong></button>`).join('')}</div></aside></section><section class="provider-docs"><div class="section-title"><div><h2>Adaptor documentație</h2><p>VoidVerse folosește TMDB ID pentru filme și TMDB ID + sezon + episod pentru seriale.</p></div><a class="outline-button" href="https://player.voidverse.me/#docs" target="_blank" rel="noopener">Deschide documentația</a></div><div class="provider-docs-grid"><code>${esc(window.CINEMA_PROVIDER_DOCS?.voidverse?.movieTemplate || "https://player.voidverse.me/embed/movie/{tmdbId}")}</code><code>${esc(window.CINEMA_PROVIDER_DOCS?.voidverse?.tvTemplate || "https://player.voidverse.me/embed/tv/{tmdbId}?s={season}&e={episode}")}</code></div></section>`;
  const noticeTitle=$('#iframeNoticeTitle'), noticeText=$('#iframeNoticeText'), iframeBox=$('#iframeBox'), frame=$('#contentFrame');
  const selectPlayer=(idPlayer)=>{
    const player=defaultPlayers.find(x=>x.id===idPlayer), value=map[idPlayer];
    document.querySelectorAll('.watch-player-button').forEach(button=>button.classList.toggle('active',button.dataset.player===idPlayer));
    if(!value?.url){ iframeBox.classList.add('hidden'); noticeTitle.textContent=`${player.label} nu este configurat`; noticeText.textContent='Adaugă un URL iframe pentru acest titlu în sources.js, apoi republică site-ul.'; return; }
    const url=safeUrl(value.url);
    if(!url){ iframeBox.classList.add('hidden'); noticeTitle.textContent='Link invalid'; noticeText.textContent='Playerul are nevoie de un URL HTTPS valid.'; return; }
    noticeTitle.textContent=`${player.label} este activ`; noticeText.textContent='Dacă rămâne gol, domeniul playerului poate bloca încărcarea în iframe.'; iframeBox.classList.remove('hidden'); frame.src=url;
  };
  document.querySelectorAll('.watch-player-button').forEach(button=>button.addEventListener('click',()=>selectPlayer(button.dataset.player)));
  selectPlayer(location.hash ? location.hash.slice(1) : defaultPlayers[0].id);
}
function genresPage(){
  if(!$('#genresPage'))return;
  $('#genresPage').innerHTML=`<div class="page-heading"><span class="eyebrow">Explorează</span><h1>Genuri</h1><p>Alege o categorie pentru a descoperi filme și seriale.</p></div><div class="genre-grid">${Object.entries(genres).map(([id,name])=>`<a class="genre-tile" href="movies.html?genre=${id}"><span>✦</span><b>${name}</b><small>Vezi titlurile</small></a>`).join('')}</div>`;
}
function countriesPage(){
  if(!$('#countriesPage')) return;
  $('#countriesPage').innerHTML = `<div class="page-heading"><span class="eyebrow">Explorează</span><h1>Țări</h1><p>Alege țara de producție pentru a filtra catalogul.</p></div><div class="genre-grid">${Object.entries(countries).map(([code,name])=>`<a class="genre-tile" href="movies.html?country=${code}"><span>◎</span><b>${name}</b><small>Vezi titlurile</small></a>`).join('')}</div>`;
}
function accountPage(){
  if(!$('#accountPage'))return;
  const render=()=>{
    const list=actionStore('cinema_watchlist'), fav=actionStore('cinema_favorites'), watched=actionStore('cinema_watched');
    $('#accountPage').innerHTML=`<div class="page-heading"><span class="eyebrow">Profil local</span><h1>Lista mea</h1><p>Listele sunt salvate doar în browserul tău.</p></div><div class="account-stats"><div><b>${list.length}</b><span>De urmărit</span></div><div><b>${fav.length}</b><span>Favorite</span></div><div><b>${watched.length}</b><span>Vizionate</span></div></div><div class="account-empty"><h2>Gestionează titlurile direct din pagina lor</h2><p>Apasă „Lista de urmărit”, „Favorite” sau „Marchează ca vizionat” pe orice titlu.</p><a href="movies.html" class="button">Descoperă filme</a></div>`;
  }; render();
}
function setupVoidverseProgress(){
  window.addEventListener('message', event => {
    const data = event.data;
    if(!data || data.source !== 'voidverse' || data.type !== 'progress') return;
    const params = new URLSearchParams(location.search);
    const type = params.get('type') || 'movie';
    const id = params.get('id');
    if(!id || !Number.isFinite(Number(data.currentTime))) return;
    const key = `cinema_progress_${sourceKey(type,id,params.get('season'),params.get('episode'))}`;
    localStorage.setItem(key, JSON.stringify({ title:data.title || '', currentTime:Number(data.currentTime), duration:Number(data.duration)||0, updatedAt:Date.now() }));
  });
}

function boot(){
  injectShell();
  setupVoidverseProgress();
  home(); catalog(document.body.dataset.catalogType); detail(); watch(); genresPage(); countriesPage();
}
boot();
