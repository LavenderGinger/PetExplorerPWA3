# Pet Explorer PWA

Pet Explorer is a Progressive Web App prototype designed with Materialize CSS. It features responsive UI, offline access via service worker, and installability.

Service Worker:

    Handles caching of essential assets (HTML, CSS, JS, images) to enable offline functionality.

    Caches specific URLs during the install event (urlsToCache array).

    Cleans up old caches during activation to keep storage efficient.

Caching Strategy:

    Precache: Core app files and images are added to cache on service worker install for fast loads and offline usability.

    Runtime caching: For fetch events, the service worker serves cached responses or fetches fresh data and adds it to cache.

Manifest File:

    Defines metadata for the PWA like app name, icons, start URL, theme colors, display mode, and orientation.

    Lists icons used across platforms, including sizes and paths relative to the manifest file.

    Includes shortcuts for quick navigation to essential app pages.

    Enables the browser’s install prompt to add the app to home screen or desktop.

How to Run the Project:

    Clone or download the repository.

    Serve files over HTTPS (required for service workers and PWA features).

    Open index.html in a modern browser (e.g. Microsoft Edge, Brave) supporting service workers and PWAs.

    Inspect PWA features via browser DevTools (Application tab).

    Test offline by loading once, then disabling network and refreshing.

    Try installing the PWA via browser install prompt or manual Add to Home Screen.
