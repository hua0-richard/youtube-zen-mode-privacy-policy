import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "../App.jsx";

/* `renderToString`, not `renderToStaticMarkup`. The markup here is hydrated
   rather than served as the final word, and static markup drops the comment
   separators React puts between adjacent text nodes — which the sentences
   that mix prose with an API name all have. Without them hydration fails
   outright (React error #418) and the client throws the prerendered page away
   and rebuilds it, which is the one outcome prerendering exists to avoid. */
export function render(url = "/") {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
