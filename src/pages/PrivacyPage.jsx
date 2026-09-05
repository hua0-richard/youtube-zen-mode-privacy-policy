import { Link } from "react-router-dom";

export function PrivacyPage() {
  return (
    <>
      <div className="mast">
        <h1>Privacy Policy</h1>
        <p className="lede">
          Focus Mode For YouTube is a Chrome extension that replaces YouTube's
          feed with a subscriptions-only reading list.
        </p>
        <p className="stamp">Last updated 3 September 2026</p>
      </div>

      <p className="claim">
        The extension collects nothing, sends nothing, and has no server.
      </p>
      <p>
        It runs only on <code>https://www.youtube.com/*</code>. While you are
        there it asks YouTube, as you, for subscriptions, uploads, playlists,
        history, search, and descriptions, and it draws its own pages from
        those answers. It does not talk to anyone else.
      </p>
      <p>
        What it keeps stays in your browser, in Chrome's extension storage and{" "}
        <code>localStorage</code>. Nothing is uploaded. The{" "}
        <Link to="/storage">storage page</Link> lists every value. Remove the
        extension, or clear site data for youtube.com, and it is gone.
      </p>
      <p>
        These pages do not load third-party scripts, remote fonts, or
        analytics. The theme you pick is stored in <code>localStorage</code> on
        this machine. Changes are committed to the repository, and the date
        above is updated. Open an issue there if you need to.
      </p>
    </>
  );
}
