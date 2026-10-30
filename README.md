# focus-mode-privacy

The privacy policy for **Focus Mode For YouTube**, as a page. Built with Vite,
so the Chrome Web Store's *Privacy policy* field has a public URL to point at.

Two pages: a landing page at `/` and the policy at `/privacy`.

The policy text is the same text as `PRIVACY.md` in the extension repository.
That file stays the source of record; this is the published form of it, and the
two are edited together.

## Built with

React 19, React Router 7 and Vite 8.

```
src/
  App.jsx        routes, header, footer
  pages/         LandingPage, PrivacyPage
  entries/       client.jsx (hydrate), server.jsx (prerender)
  components/    Header, Mark, ThemeToggle, Icons
  useTheme.js
  style.css
prerender.js     renders the page to static HTML after the client build
```

The policy is written as sections, each under a heading that is a question a
reader arrives with — what it collects, where it runs, what it stores, what it
may do, and how it changes — in the order they arrive with them. It is a
document to be skimmed by someone checking one thing, so nothing is folded into
a paragraph that a heading could have answered on its own.

### Prerendered

`npm run build` runs `vite build` and then `prerender.js`: an SSR bundle,
`renderToString` per route, and the markup baked into `#root` of `index.html` and `privacy/index.html`. The browser bundle
hydrates it rather than creating it, so the page is complete HTML on arrival
and still renders with JavaScript switched off — which matters here, since a
privacy policy that needs a bundle to say anything is a bad privacy policy.

`renderToString` and not `renderToStaticMarkup`: the latter drops the comment
separators React puts between adjacent text nodes, which every sentence that
mixes prose with an API name has, and hydration then fails outright and
rebuilds the page.

The site used to have three pages. `features.html` and `storage.html` are
written as redirects to `/`, so an old store listing or an old bookmark does
not 404; everything those pages said now has a section on the one page.

## Design

The palette, the type and the spacing come from `css/list.css` in the extension
repository, so the two look like one product:

- Neutral greys with ink as the accent (`#1a1a1a` / white), exactly the extension's values. The header mark is ink too (white in dark), as in the extension; there is no colour at all.
- Even rungs on the grey ladder, measured in perceived lightness, with the dark
  ground lifted off near-black so light text does not bloom.
- The extension's font stack, verbatim: Geist, Inter, then the system UI face. Nothing is bundled or fetched, so a reader without Geist or Inter gets the system face, exactly as in the extension. There is no monospace: an API name is told apart by colour and a ground, and `code` sets `font-family: inherit`.

The type scale sits a step above the extension's. That is a dense list read a
row at a time; this is prose read a paragraph at a time.

### The theme

The stylesheet answers `prefers-color-scheme` on its own and decides which of
the two icons the button shows, so the toggle is correct in the prerendered
HTML before React has hydrated, and correct for good if it never does. An
inline script in the head applies a stored choice before the first paint, so a
reader who picked a theme does not watch the other one flash past.

`useTheme` starts its state as `null` rather than reading `matchMedia` during
render: no rendered markup depends on the theme, only the button's label, and
guessing during render would be a hydration mismatch for nothing.

## No third-party anything

The extension loads no remote script and no remote font, and this site does the
same. There is nothing to fetch but the HTML, one stylesheet, one JS chunk, one
SVG, and the preview thumbnails, all first-party. The thumbnails are YouTube's
own frames, saved here so a visit never calls YouTube.

The one thing stored is which theme you picked, in `localStorage`.

## Development

```sh
npm install
npm run dev      # local server with reload
npm run build    # -> dist/
npm run preview  # serve the build
```

## Deploying

`dist/` is a static directory; any host will do. The URL it lands on goes in
two places: the Web Store dashboard's **Privacy policy** field, and the
`PRIVACY.md` checklist item in the extension's `STORE.md`.

The Web Store's **Privacy policy** field should point at `/privacy`.
