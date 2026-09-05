import { Rich } from "../components/Rich.jsx";
import { STORED } from "../data/storage.js";

export function StoragePage() {
  return (
    <>
      <div className="mast">
        <h1>Storage</h1>
      </div>

      <ul className="plain">
        {STORED.map((row) => (
          <li key={row.what[0]}>
            <Rich parts={row.what} />
            {" — "}
            <Rich parts={row.where} />
          </li>
        ))}
      </ul>
      <p>
        Remove the extension, or clear youtube.com, to erase it. No{" "}
        <code>tabs</code> permission, and no host beyond YouTube.
      </p>
    </>
  );
}
