import { useEffect, useRef } from "react";
import { Compare } from "../components/Compare.jsx";
import { LockIcon } from "../components/Icons.jsx";

export function LandingPage() {
  const preview = useRef(null);

  useEffect(() => {
    document.title = "Focus Mode For YouTube";
  }, []);

  return (
    <>
      <div className="hero">
        <h1>YouTube Is Distracting.</h1>
        <p className="lede">
          A Chrome extension that shows only the channels you subscribe to,
          newest first.
        </p>
        <p className="cta">
          <button type="button" className="btn-action" onClick={() => preview.current?.reveal()}>
            <LockIcon />
            Focus
          </button>
        </p>
      </div>

      <Compare ref={preview} />
    </>
  );
}
