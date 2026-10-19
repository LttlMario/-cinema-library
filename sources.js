// Player-ele apar pentru fiecare titlu, chiar dacă nu au încă un URL.
// Adaugă aici numai iframe-uri pentru conținut pe care ai dreptul să îl folosești.
window.CINEMA_PLAYERS = [
  { id: 'principal', label: 'YouTube Embed', icon: '▶' },
  { id: 'alternativ', label: 'Vimeo Embed', icon: '◉' },
  { id: 'server3', label: 'Internet Archive', icon: '◆' },
  { id: 'server4', label: 'HTML5 autorizat', icon: '◇' }
];

window.CINEMA_SOURCES = {
  'movie:550': {
    principal: { label: 'Player de test legal — Big Buck Bunny', url: 'https://www.youtube.com/embed/aqz-KE-bpKQ' }
  },
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
