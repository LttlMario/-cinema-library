const cfg = window.CINEMA_CONFIG || {};
const img = cfg.imageBaseUrl || 'https://image.tmdb.org/t/p/w500';
const api = 'https://api.themoviedb.org/3';
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function getApiKey(){const saved=localStorage.getItem('cinema_tmdb_api_key');return saved||(cfg.tmdbApiKey&&!cfg.tmdbApiKey.includes('INTRODU')?cfg.tmdbApiKey:'')}
function setupBox(){return '<div class="setup"><h2>Configurează catalogul</h2><p>Introdu cheia ta TMDB. Este salvată doar în acest browser și nu este inclusă în repository.</p><input id="tmdbKey" type="password" placeholder="TMDB API key"><button id="saveKey" class="button">Salvează cheia</button></div>'}
async function tmdb(path){const key=getApiKey();if(!key)throw Error('SETUP_TMDB');const response=await fetch(`${api}${path}${path.includes('?')?'&':'?'}api_key=${encodeURIComponent(key)}&language=${encodeURIComponent(cfg.tmdbLanguage||'ro-RO')}`);if(!response.ok)throw Error(`TMDB a răspuns cu ${response.status}`);return response.json()}

function sourceKey(type,id){return `${type}:${id}`}
function configuredSources(type,id){
  const all=window.CINEMA_SOURCES||{};
  const value=all[sourceKey(type,id)] ?? all[String(id)] ?? [];
  return (Array.isArray(value)?value:[value]).filter(source=>source&&typeof source.url==='string');
}
function safeEmbedUrl(value){
  try{
    const url=new URL(value);
    return url.protocol==='https:' ? url.href : '';
  }catch(_){return ''}
}
function sourceLabel(source,index){return esc(source.label||`Server ${index+1}`)}

function card(item){
  const type=item.media_type||'movie';
  const sources=configuredSources(type,item.id);
  return `<a class="card" href="detail.html?id=${item.id}&type=${type}">
    <div class="poster">${item.poster_path?`<img src="${img+item.poster_path}" alt="">`:'<span>Fără poster</span>'}</div>
    <div class="info"><b>${esc(item.title||item.name)}</b><small>${esc((item.release_date||item.first_air_date||'').slice(0,4))} · ${type==='tv'?'Serial':'Film'}</small>${sources.length?'<span class="source-badge">Player configurat</span>':''}</div>
  </a>`
}
async function home(){
  const grid=$('#grid'),search=$('#search');
  if(!grid)return;
  try{
    const data=await tmdb('/trending/all/week');
    grid.innerHTML=data.results.filter(item=>item.media_type!=='person').map(card).join('')
  }catch(error){
    grid.innerHTML=error.message==='SETUP_TMDB'?setupBox():`<p class="error">${esc(error.message)}</p>`;
    $('#saveKey')?.addEventListener('click',()=>{const key=$('#tmdbKey')?.value.trim();if(key){localStorage.setItem('cinema_tmdb_api_key',key);location.reload()}})
  }
  search?.addEventListener('keydown',async event=>{
    if(event.key!=='Enter'||!search.value.trim())return;
    try{
      const data=await tmdb(`/search/multi?query=${encodeURIComponent(search.value)}`);
      grid.innerHTML=data.results.filter(item=>item.media_type==='movie'||item.media_type==='tv').map(card).join('')
    }catch(error){grid.innerHTML=`<p class="error">${esc(error.message)}</p>`}
  })
}
async function detail(){
  const params=new URLSearchParams(location.search),id=params.get('id'),type=params.get('type')||'movie';
  if(!id||!$('#detail'))return;
  try{
    const item=await tmdb(`/${type}/${id}`);
    const sources=configuredSources(type,id);
    const action=sources.length
      ? `<a class="button" href="watch.html?id=${encodeURIComponent(id)}&type=${encodeURIComponent(type)}">Vezi</a>`
      : '<p class="muted">Nu există încă un player configurat pentru acest titlu.</p>';
    $('#detail').innerHTML=`<article class="detail"><img class="hero-poster" src="${item.poster_path?img+item.poster_path:''}" alt=""><div><h1>${esc(item.title||item.name)}</h1><p class="muted">${esc((item.release_date||item.first_air_date||'').slice(0,4))} · ${type==='tv'?'Serial':'Film'} · ⭐ ${item.vote_average?.toFixed(1)||'—'}</p><p>${esc(item.overview||'Descriere indisponibilă.')}</p>${action}</div></article>`
  }catch(error){$('#detail').innerHTML=`<p class="error">${esc(error.message)}</p>`}
}
async function watch(){
  const container=$('#watch');
  if(!container)return;
  const params=new URLSearchParams(location.search),id=params.get('id'),type=params.get('type')||'movie';
  const sources=configuredSources(type,id);
  if(!sources.length){container.innerHTML='<h1>Player indisponibil</h1><p class="muted">Adaugă un iframe autorizat în <code>sources.js</code>.</p>';return}
  const valid=sources.map((source,index)=>({...source,embedUrl:safeEmbedUrl(source.url),index})).filter(source=>source.embedUrl);
  if(!valid.length){container.innerHTML='<h1>Player indisponibil</h1><p class="error">Linkurile configurate nu folosesc HTTPS sau nu sunt valide.</p>';return}
  container.innerHTML=`<h1>Vizionare</h1><div class="server-picker" role="tablist" aria-label="Alege serverul">${valid.map((source,index)=>`<button class="server-button${index===0?' active':''}" data-index="${index}" type="button">${sourceLabel(source,index)}</button>`).join('')}</div><div id="player-frame" class="player-shell"><iframe class="video" title="Player video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><p id="player-label" class="muted"></p><p class="player-note">Folosește doar linkuri iframe pentru conținut pe care ai dreptul să îl distribui.</p>`;
  const frame=container.querySelector('iframe'),label=container.querySelector('#player-label');
  const load=(index)=>{
    const source=valid[index];
    frame.src=source.embedUrl;
    label.textContent=source.label||`Server ${index+1}`;
    container.querySelectorAll('.server-button').forEach((button,buttonIndex)=>button.classList.toggle('active',buttonIndex===index));
  };
  container.querySelectorAll('.server-button').forEach(button=>button.addEventListener('click',()=>load(Number(button.dataset.index))));
  load(0);
}
home();detail();watch();
