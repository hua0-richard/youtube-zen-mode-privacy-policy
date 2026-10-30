import { useEffect } from "react";

/* The privacy policy, in the shape of a Vercel legal page: a contents list
 * beside the document, a large title, a date. Each heading is a question a
 * reader arrives with. Under each one, points rather than paragraphs — a
 * policy is read to check one thing, not from the top. */

const SECTIONS = [
  ["collects", "What it collects"],
  ["runs", "Where it runs"],
  ["stores", "What it stores, and where"],
  ["permissions", "Permissions"],
  ["this-page", "This page"],
  ["changes", "Changes"],
];

export function PrivacyPage() {
  useEffect(() => {
    document.title = "Privacy Policy — Focus Mode For YouTube";
  }, []);

  return (
    <article className="legal">
      <nav className="legal-toc" aria-label="On this page">
        <p>On this page</p>
        <ol>
          {SECTIONS.map(([id, title]) => (
            <li key={id}>
              <a href={`#${id}`}>{title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="legal-doc">
        <header className="legal-head">
          <h1>Privacy Policy</h1>
          <p className="stamp">Last updated 3 September 2026</p>
        </header>

        <p>
          Focus Mode For YouTube is a Chrome extension that replaces
          YouTube's feed with a subscriptions-only reading list.
        </p>
        <p className="claim">
          The extension collects nothing, sends nothing, and has no server.
        </p>

        <section className="sect" id="collects">
          <h2>What it collects</h2>
          <ul className="plain">
            <li>Nothing. No account, no sign-in, no analytics.</li>
            <li>There is no server, and no service of ours to send anything to.</li>
            <li>Nothing is shared with, or sold to, anyone.</li>
          </ul>
        </section>

        <section className="sect" id="runs">
          <h2>Where it runs</h2>
          <ul className="plain">
            <li>
              Only on <code>https://www.youtube.com/*</code>.
            </li>
            <li>
              There, it asks YouTube — as you — for subscriptions, uploads,
              playlists, history, search, and descriptions.
            </li>
            <li>It draws its own pages from those answers, and talks to nobody else.</li>
          </ul>
        </section>

        <section className="sect" id="stores">
          <h2>What it stores, and where</h2>
          <ul className="plain">
            <li>
              Your subscription list, a slice of the feed, and which videos
              are Shorts — <code>chrome.storage.local</code>
            </li>
            <li>
              Whether the extension is on, and picture quality —{" "}
              <code>chrome.storage.sync</code> / <code>local</code>
            </li>
            <li>
              Opened rows, hidden channels, and column widths —{" "}
              <code>localStorage</code> on youtube.com
            </li>
            <li>
              Which page you came from — <code>sessionStorage</code> on
              youtube.com
            </li>
            <li>All of it stays in your browser. Nothing is uploaded.</li>
            <li>
              Remove the extension, or clear site data for youtube.com, and it
              is gone.
            </li>
          </ul>
        </section>

        <section className="sect" id="permissions">
          <h2>Permissions</h2>
          <ul className="plain">
            <li>
              <code>storage</code> — for the caches and settings above.
            </li>
            <li>
              <code>https://www.youtube.com/*</code> — the only site it runs
              on.
            </li>
            <li>
              No <code>tabs</code> permission, and no access to any other
              host.
            </li>
          </ul>
        </section>

        <section className="sect" id="this-page">
          <h2>This page</h2>
          <ul className="plain">
            <li>No third-party scripts, no remote fonts, no analytics.</li>
            <li>
              The one thing stored is the theme you picked, in{" "}
              <code>localStorage</code> on this machine.
            </li>
          </ul>
        </section>

        <section className="sect" id="changes">
          <h2>Changes</h2>
          <ul className="plain">
            <li>
              Changes are committed to the repository, and the date above is
              updated.
            </li>
            <li>Open an issue there if you need to.</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
