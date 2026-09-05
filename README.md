# focus-mode-privacy

The site for **Focus Mode For YouTube**: the privacy policy, what the extension
does, and what it stores. Built with Vite, so the Chrome Web Store's *Privacy
policy* field has a public URL to point at.

Three routes:

| | |
| --- | --- |
| `/` | The privacy policy. This is the URL for the store listing. |
| `/features` | What the extension does. |
| `/storage` | Every value it stores, the permissions, the service worker. |

The policy text is the same text as `PRIVACY.md` in the extension repository.
That file stays the source of record; this is the published form of it, and the
two are edited together.

## Built with

React 19, Vite 8, and React Router. One app, three routes.

```
src/
  App.jsx      routes
  entries/     client.jsx (hydrate), server.jsx (prerender)
  pages/       one component per route
  components/  Layout, Header, ThemeToggle, Rows, StorageTable, Rich, ...
  data/        nav.js, features.js, storage.js — the content, as data
  useTheme.js
  style.css
prerender.js   renders each route to static HTML after the client build
```

Content lives in `src/data` rather than in markup. The storage table is one
loop over `STORED`; the feature lists are one loop each over arrays. A cell
that mixes prose with an API name is an array of parts — strings and
`{ code }` — which `<Rich>` renders, so the data files never reach for tags.

`src/data/nav.js` is the single list of pages. The header nav and the cards at
the foot of each page both read it, so they cannot disagree about what the site
contains.

### A router, and still prerendered

React Router owns the three pages. Clicks stay in the app; a refresh or a
shared URL is a real document, because `prerender.js` writes `/`,
`/features/index.html` and `/storage/index.html` after the client build.

`npm run build` runs `vite build` and then that prerender: an SSR bundle,
`renderToString` for each path, and the markup baked into `#root`. The browser
bundle hydrates it rather than creating it. So every route is complete HTML on
arrival and still renders with JavaScript switched off — which matters here,
since a privacy policy that needs a bundle to say anything is a bad privacy
policy.

`features.html` and `storage.html` redirect to the new paths, so an old store
listing or a bookmark does not 404.

`renderToString` and not `renderToStaticMarkup`: the latter drops the comment
separators React puts between adjacent text nodes, which every cell built by
`<Rich>` has, and hydration then fails outright and rebuilds the page.

The one thing React costs is the bundle: ~78 kB gzipped for a site whose
interactive surface is one button and three routes.

## Design

The palette, the type and the spacing come from `css/list.css` in the extension
repository, so the two look like one product:

- Two hues on a ladder of cool greys. Blue (`#0b5fbf` / `#6aabff`) is *"this
  one"*: focus and links. Red (`#d7362d` / `#ff6257`) is *"careful"*, and with
  nothing here to warn about it is spent once, on the mark.
- Even rungs on the grey ladder, measured in perceived lightness, with the dark
  ground lifted off near-black so light text does not bloom.
- One typeface, San Francisco via `-apple-system`, told apart by size, weight
  and tracking. The extension has no second face and no monospace, so neither
  does this: an API name is told apart by colour and a ground. Both `code` and
  `kbd` set `font-family: inherit`, because the browser's own stylesheet would
  otherwise put a monospace face on the page.
- The feature list is a band of rows, the shape the extension's feed is.

The type scale sits a step above the extension's. That is a dense list read a
row at a time; this is prose read a paragraph at a time.

### The theme

The stylesheet answers `prefers-color-scheme` on its own and decides which of
the two icons the button shows, so the toggle is correct in the prerendered
HTML before React has hydrated, and correct for good if it never does. An
inline script in each page's head applies a stored choice before the first
paint, so a reader who picked a theme does not watch the other one flash past.

`useTheme` starts its state as `null` rather than reading `matchMedia` during
render: no rendered markup depends on the theme, only the button's label, and
guessing during render would be a hydration mismatch for nothing.

## No third-party anything

The extension loads no remote script and no remote font, and this site does the
same. There is nothing to fetch but the HTML, one stylesheet, one JS chunk and
one SVG, all first-party.

The one thing stored is which theme you picked, in `localStorage`.

## Development

```sh
npm install
npm run dev      # local server with reload
npm run build    # -> dist/
npm run preview  # serve the build
```

`base` is `"/"`, so the site wants to sit at the root of its host. A host
that puts it under a path should set `base` to that path.

## Deploying

`dist/` is a static directory; any host will do. The URL it lands on goes in
two places: the Web Store dashboard's **Privacy policy** field, and the
`PRIVACY.md` checklist item in the extension's `STORE.md`.
# youtube-zen-mode-privacy-policy
