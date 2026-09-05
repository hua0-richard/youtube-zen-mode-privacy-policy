import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "../App.jsx";
import { basename } from "../basename.js";
import "../style.css";

/* Hydrate when the HTML already has the page (the prerender). Create a root
   in dev, where the file is still an empty comment. */
const tree = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById("root");
if (root.childElementCount > 0) {
  hydrateRoot(root, tree);
} else {
  createRoot(root).render(tree);
}
