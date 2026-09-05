/* Renders each route to static HTML after the client build.
 *
 * React would otherwise leave a file whose body is an empty div, and a
 * privacy policy that needs JavaScript to say anything is a bad privacy
 * policy. Each route is written to its own file so `/`, `/features` and
 * `/storage` are complete on arrival. The browser bundle hydrates that
 * markup rather than creating it.
 *
 * The SSR bundle is built into a directory of its own and removed afterwards;
 * nothing it contains is served. */
import { mkdirSync } from "node:fs";
import { rm } from "node:fs/promises";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import { PAGES } from "./src/data/nav.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SSR_DIR = resolve(__dirname, ".ssr");
const OUT = resolve(__dirname, "dist");

await build({
  base: "/",
  logLevel: "warn",
  build: {
    ssr: resolve(__dirname, "src/entries/server.jsx"),
    outDir: SSR_DIR,
    emptyOutDir: true,
  },
});

const { render } = await import(resolve(SSR_DIR, "server.js"));
const template = readFileSync(resolve(OUT, "index.html"), "utf8");
if (!template.includes("<!--app-->")) {
  throw new Error("index.html has no <!--app--> placeholder to fill");
}

function apply(html, page) {
  return html
    .replace("<!--app-->", render(page.path))
    .replace(/<title>[^<]*<\/title>/, `<title>${page.documentTitle}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${page.description}">`
    );
}

for (const page of PAGES) {
  const file =
    page.path === "/"
      ? resolve(OUT, "index.html")
      : resolve(OUT, page.path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, apply(template, page));
  console.log(`prerendered ${page.path}`);
}

/* Old .html addresses, so a store listing or a bookmark does not 404. */
for (const page of PAGES.filter((p) => p.path !== "/")) {
  const to = page.path;
  writeFileSync(
    resolve(OUT, `${page.id}.html`),
    `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${to}">
<link rel="canonical" href="${to}">
<title>Redirecting</title>
<script>location.replace(${JSON.stringify(to)})</script>
`
  );
}

await rm(SSR_DIR, { recursive: true, force: true });
