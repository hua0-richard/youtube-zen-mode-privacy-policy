import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "../App.jsx";
import { basename } from "../basename.js";

/* `renderToString`, not `renderToStaticMarkup`. The markup here is hydrated
   rather than served as the final word, and static markup drops the comment
   separators React puts between adjacent text nodes — which every cell built
   by <Rich> has. Without them hydration fails outright (React error #418) and
   the client throws the prerendered page away and rebuilds it, which is the
   one outcome prerendering exists to avoid. */
export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter basename={basename} location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
