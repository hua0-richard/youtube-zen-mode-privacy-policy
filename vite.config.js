import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* One page, one entry. `base` is `/` because the site sits at the root of its
   host; a host that puts it under a path should set `base` to that path. */
/* In dev the page would otherwise be an empty div until the bundle runs, so
   the policy pops in. Fill it with the same server render the build uses. The
   client then hydrates it exactly as in production. */
function devPrerender() {
  let server;
  return {
    name: "dev-prerender",
    apply: "serve",
    configureServer(s) {
      server = s;
    },
    transformIndexHtml: {
      order: "pre",
      async handler(html, ctx) {
        const { render } = await server.ssrLoadModule("/src/entries/server.jsx");
        const url = (ctx.originalUrl || "/").split(/[?#]/)[0];
        return {
          html: html.replace("<!--app-->", render(url)),
          /* Dev injects CSS from the bundle, which would leave the markup
             unstyled until it runs. A link in the head is render-blocking. */
          tags: [{ tag: "link", attrs: { rel: "stylesheet", href: "/src/style.css" }, injectTo: "head" }],
        };
      },
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), devPrerender()],
  build: {
    target: "es2020",
    assetsInlineLimit: 4096,
  },
});
