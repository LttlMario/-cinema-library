# Cinema Library pentru Samsung Smart TV

Aceasta este aplicația Tizen pentru instalare personală pe un Samsung Smart TV.
Încarcă versiunea live a Cinema Library, deci actualizările site-ului apar fără să reinstalezi aplicația.

## Ce trebuie știut

- Televizorul trebuie să ruleze Samsung Tizen și să fie conectat la internet.
- Pentru instalarea personală se activează Developer Mode pe TV.
- Aplicația trebuie semnată cu un certificat Tizen creat în Tizen Studio.
- Pachetul rezultat este `Cinema Library.wgt`; acesta este formatul acceptat de Samsung TV.

## Pregătire pe PC

1. Instalează **Samsung TV SDK / Tizen Studio** cu extensiile TV.
2. Deschide **Certificate Manager** și creează un profil de certificat pentru TV.
3. Importă folderul `app/samsung-tv` ca proiect Tizen Web.
4. Selectează profilul `tv-samsung`, apoi construiește proiectul ca pachet `.wgt`.

## Activare Developer Mode pe TV

1. Deschide **Apps** din Smart Hub.
2. Introdu `12345` folosind telecomanda.
3. Activează **Developer mode**.
4. Introdu adresa IP a PC-ului și repornește televizorul.

## Instalare

În Tizen Studio deschide **Device Manager**, adaugă televizorul prin Remote Device Manager,
conectează-l și rulează proiectul pe TV. Pentru o instalare repetată, folosește același profil
de certificat și aceeași aplicație.

Aplicația folosește site-ul live: `https://lttlmario.github.io/cinema-library/`.
