// Configurează aici doar playere iframe pentru conținut pe care ai dreptul să îl distribui.
// Cheia este "<tip>:<id TMDB>", de exemplu "movie:27205" sau "tv:1399".
// Poți adăuga mai multe servere; ele apar ca butoane pe pagina de vizionare.
// URL-ul trebuie să fie HTTPS și să permită încărcarea în iframe.
window.CINEMA_SOURCES = {
  "movie:27205": [
    { label: "Trailer oficial Warner Bros.", url: "https://www.youtube.com/embed/Qwe6qXFTdgc" }
  ],
  "movie:157336": [
    { label: "Trailer oficial Paramount Movies", url: "https://www.youtube.com/embed/4T4wxDnTYLg" }
  ],

  // Exemplu de structură pentru un titlu nou:
  // "tv:12345": [
  //   { label: "Server principal", url: "https://domeniul-tau.example/embed/ID" },
  //   { label: "Server alternativ", url: "https://alt-domeniu.example/embed/ID" }
  // ]
};
