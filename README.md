
<div align="center">
  <img src="assets/cinema-library-banner.svg" alt="Cinema Library" />
</div>
<br/>

[Cinema Library](https://lttlmario.github.io/cinema-library/) is a simple movie and TV show search website powered by the TMDB API.
It lets users discover movies and TV shows and stream them directly within the website.

🌐 Live demo: [Live Demo](https://lttlmario.github.io/cinema-library/)

## Features

- 🔍 Search movies and TV shows from TMDB
- 📄 View details such as title, release date, and poster
- ▶️ Stream directly within Cinema Library
- 📡 Choose from multiple predefined streaming servers
- 🇷🇴 Romanian subtitle preference remembered on the device
- ▶️ Continue Watching, favorites, history, and playback resume where supported
- 🎛️ Advanced search filters, dark/light theme, and TV keyboard navigation
- 📱 Installable PWA with a small offline shell cache
- 🔗 Links to official viewing options through TMDB
- 🖥️ Use it as a native **Windows desktop app** with no ads

## GitHub Pages deployment

The Pages workflow reads the TMDB Read Access Token from a repository secret named
`TMDB_TOKEN`. Add it under **Settings → Secrets and variables → Actions → New repository secret**.
The workflow refuses to publish if the secret is missing, so the token is not committed to the
public source files.

After adding or rotating the secret, run the **Deploy Website** workflow again from the
repository's **Actions** tab.

## Desktop App (Windows)

Prefer a real app over a browser tab? Cinema Library is also available as a native **Windows desktop app**.

- 🪟 Runs in its own window — no browser needed
- 🚫 Blocks the pop-ups and ad redirects (No Ads)
- 🔄 Always up to date — loads the live site, so new servers and fixes appear instantly
- ✅ No setup — no API token to enter, just install and open

📥 Download it from the [latest release](https://github.com/LttlMario/cinema-library/releases/latest).

🔄 Already installed? Download the newest installer from that same page and run it to update — no uninstall needed. See [Updating](app/windows/README.md#update) for details.

👉 See the [Windows app guide](app/windows/README.md) for more info.

<!-- ## Android App (Phone + Android TV)

Cinema Library is also available as a native **Android app** — one APK that works on phones,
tablets, and **Android TV** (it shows up in the TV launcher).

- 📱 Runs in its own app — no browser needed
- 🚫 Blocks the pop-ups and ad redirects (No Ads)
- 🔄 Always up to date — loads the live site, so new servers and fixes appear instantly
- 📺 Android TV ready — installs and launches from the Leanback launcher

📥 Download the APK from the [latest release](https://github.com/LttlMario/cinema-library/releases/latest)
and sideload it (on TV: install via a file-manager app or `adb install`).
 
👉 See the [Android app guide](app/android/README.md) for more info. -->


