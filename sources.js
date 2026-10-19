// Player-ele apar pentru fiecare titlu, chiar dacă nu au încă un URL.
// Adaugă aici numai iframe-uri pentru conținut pe care ai dreptul să îl folosești.
window.CINEMA_PLAYERS = [
  { id: 'principal', label: 'Player principal', icon: '▶' },
  { id: 'alternativ', label: 'Player alternativ', icon: '◉' },
  { id: 'server3', label: 'Server 3', icon: '◆' },
  { id: 'server4', label: 'Server 4', icon: '◇' }
];



// Șabloane de documentare pentru integrarea unui provider extern.
// Nu sunt activate automat în CINEMA_SOURCES; adaugă manual doar URL-uri pe care ai dreptul să le folosești.
window.CINEMA_PROVIDER_DOCS = {
  voidverse: {
    name: 'VoidVerse (documentație)',
    docsUrl: 'https://player.voidverse.me/#docs',
    movieTemplate: 'https://player.voidverse.me/embed/movie/{tmdbId}',
    tvTemplate: 'https://player.voidverse.me/embed/tv/{tmdbId}?s={season}&e={episode}',
    note: 'Șablon TMDB pentru documentare; nu este activat automat ca sursă de redare.'
  }
};

window.CINEMA_SOURCES = {
  'movie:27205': {
    principal: { label: 'Trailer oficial Warner Bros.', url: 'https://www.youtube.com/embed/Qwe6qXFTdgc' }
  },
  'movie:157336': {
    principal: { label: 'Trailer oficial Paramount Movies', url: 'https://www.youtube.com/embed/4T4wxDnTYLg' }
  }

  // Film:
  // 'movie:12345': {
  //   principal: { label: 'Server principal', url: 'https://domeniul-tau.example/embed/ID' },
  //   alternativ: { label: 'Server alternativ', url: 'https://alt-domeniu.example/embed/ID' }
  // },

  // Serial:
  // 'tv:1399': {
  //   principal: { label: 'Server principal', url: 'https://domeniul-tau.example/embed/ID' }
  // },

  // Episod:
  // 'tv:1399:s1e1': {
  //   principal: { label: 'Server principal', url: 'https://domeniul-tau.example/embed/EPISOD' }
  // }
};
