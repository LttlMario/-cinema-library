# Cinema Library

Catalog web pentru filme și seriale, cu metadate TMDB și playere externe autorizate.

## Configurare

1. Completează cheia TMDB în `config.js`.
2. În `sources.js`, adaugă numai playere video pentru care ai drept de utilizare și embed.
3. Accesează site-ul după rularea workflow-ului GitHub Pages.

TMDB furnizează metadatele și imaginile, nu filmele. Proiectul nu caută și nu include surse neautorizate.

## Pagini

- `index.html` — catalog și căutare
- `detail.html` — detalii titlu
- `watch.html` — redare player autorizat
