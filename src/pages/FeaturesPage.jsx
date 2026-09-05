import { Shortcut } from "../components/Kbd.jsx";
import { FEATURES } from "../data/features.js";

export function FeaturesPage() {
  return (
    <>
      <div className="mast">
        <h1>Features</h1>
        <p>YouTube, replaced with a subscriptions-only list.</p>
      </div>

      <ul className="plain">
        {FEATURES.map((item) => (
          <li key={item}>{item}</li>
        ))}
        <li>
          <Shortcut /> or the toolbar icon turns it off. Rebind at{" "}
          <code>chrome://extensions/shortcuts</code> if nothing happens.
        </li>
        <li>Chrome 111 or later, signed in to YouTube.</li>
      </ul>
    </>
  );
}
