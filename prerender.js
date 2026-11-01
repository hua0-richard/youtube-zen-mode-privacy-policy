/* Renders the page to static HTML after the client build.
 *
 * React would otherwise leave a file whose body is an empty div, and a
 * privacy policy that needs JavaScript to say anything is a bad privacy
 * policy. The browser bundle hydrates that markup rather than creating it.
 *
 * The SSR bundle is built into a directory of its own and removed afterwards;
 * nothing it contains is served. */
import { rm } from "node:fs/promises";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

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

const meta = {
  "/": ["Focus Mode For YouTube", "Focus Mode turns YouTube into a plain list of the channels you subscribe to, newest first. No recommendations, no feed, no account, no server."],
  "/privacy": ["Privacy Policy — Focus Mode For YouTube", "Focus Mode For YouTube collects nothing, sends nothing, and has no server."],
};

for (const [route, [title, description]] of Object.entries(meta)) {
  const html = template
    .replace("<!--app-->", render(route))
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`);
  const file = route === "/" ? resolve(OUT, "index.html") : resolve(OUT, route.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  /* Also as `privacy.html`: a host that serves `/privacy` by looking for that
     file (most do) then finds the right page, rather than falling back to the
     landing page, whose markup would not hydrate and would be thrown away. */
  if (route !== "/") writeFileSync(resolve(OUT, route.slice(1) + ".html"), html);
  console.log("prerendered " + route);
}

await rm(SSR_DIR, { recursive: true, force: true });
