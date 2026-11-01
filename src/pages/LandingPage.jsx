import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Compare } from "../components/Compare.jsx";
import { PrivacyIcon } from "../components/Icons.jsx";
import { AddToChrome } from "../components/AddToChrome.jsx";

/* A pinned stage and a timeline. While the page scrolls through the story the
   preview stays put and the scroll position is its progress: the YouTube layer
   wipes away as a function of it, and the captions hand over at quarter marks.
   Without JavaScript the captions are an ordinary list above the preview. */
const CHAPTERS = [
  { lead: "Every page is tuned for the next click.", rest: "**Home**, **search**, even the **video page**." },
  { lead: "Only what you chose.", rest: "Your **subscriptions**, **newest first**, one line each." },
  { lead: "Yours to shape.", rest: "**One channel** or **all of them**. **Shorts off.**" },
  { lead: "Details, one click away.", rest: "Open any video **beside the list**. Nothing shifts." },
  { lead: "Nothing leaves your browser.", rest: "**No account**, **no server**, **no tracking**.", link: true },
];

/* **double stars** mark the words worth a second look. */
function emphasise(text) {
  return text.split("**").map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t));
}

const NARROW = { channel: "Veritasium", shorts: false };
const STATE = [{}, {}, NARROW, NARROW, NARROW];

const HIGHLIGHTS = [
  ["1", "line per video", "A title, a channel and an age. Fifty videos fit on one screen."],
  ["0", "recommendations", "Only the channels you subscribe to, newest first."],
  ["0", "servers", "No account, no tracking. Nothing leaves your browser."],
];

/* The floating nav pill and its margin: where pinned content starts. */
const HDR = 108;

const clamp = (x) => Math.max(0, Math.min(1, x));
const smooth = (x) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};

export function LandingPage() {
  const story = useRef(null);
  const [live, setLive] = useState(false);
  const [p, setP] = useState(0);
  const [away, setAway] = useState(false);
  /* Fades are for scrolling, not for the first measure after a refresh, when
     the browser may restore a scroll position and the buttons should simply
     start hidden. */
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    document.title = "Focus Mode For YouTube";
  }, []);

  /* The caption panel is as big as the caption in view. */
  const caps = useRef(null);
  const [box, setBox] = useState(null);

  /* Progress through the pinned stretch, 0 to 1. Measured before the first
     paint, so no frame is shown in a state the next one corrects. */
  const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useBeforePaint(() => {
    const el = story.current;
    if (!el) return;
    setLive(true);
    let frame = 0;
    const measure = () => {
      frame = 0;
      const pin = el.firstElementChild.offsetHeight;
      const run = el.offsetHeight - pin;
      const top = el.getBoundingClientRect().top;
      setAway(window.scrollY > 24);
      const next = run > 0 ? clamp((HDR - top) / run) : 0;
      setP((last) => (Math.abs(last - next) < 0.001 ? last : next));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    /* Fades start only after the load event and two frames, by which time
       the browser has put the scroll position back. */
    let settle = 0;
    const arm = () => {
      settle = requestAnimationFrame(() => {
        settle = requestAnimationFrame(() => setSettled(true));
      });
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("load", arm);
      cancelAnimationFrame(settle);
    };
  }, []);

  /* To where the video section pins, which is where the story starts. */
  function learnMore() {
    const el = story.current;
    if (!el) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY - HDR + 24;
    window.scrollTo({ top, behavior: calm ? "auto" : "smooth" });
  }

  const step = Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length));
  /* The wipe runs across the hand-over between the first two captions. */
  const reveal = live ? smooth((p - 0.14) / 0.12) : 1;
  /* Colour comes up first, over the opening of the pinned stretch. */
  const heat = live ? smooth(p / 0.1) : 1;
  /* The details panel slides open as the fourth caption arrives. */
  const pane = live ? smooth((p - 0.57) / 0.09) : 0;
  const now = STATE[step];

  const useMeasure = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useMeasure(() => {
    const ol = caps.current;
    if (!live || !ol) return;
    const fit = () => {
      const li = ol.children[step];
      if (!li) return;
      /* Width follows the caption in view; height is the tallest of them, so
         the panel only ever changes shape sideways. */
      const w = li.offsetWidth;
      const h = Math.max(...Array.from(ol.children, (c) => c.offsetHeight));
      setBox((b) => (b && b.w === w && b.h === h ? b : { w, h }));
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [live, step]);

  return (
    <>
      <div className="hero">
        <h1>YouTube, without the feed.</h1>
        <p className="lede">
          Focus Mode turns YouTube into a plain list of the channels you
          subscribe to, newest first.
        </p>
        <div className={"hero-actions" + (settled ? " is-settled" : "")} data-away={away ? "" : undefined} aria-hidden={away ? "true" : undefined}>
          <AddToChrome tabIndex={away ? -1 : 0} />
          <p className="cue">
          <button type="button" className="cue-btn" onClick={learnMore} tabIndex={away ? -1 : 0}>
            Learn more
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M4 6.4 8 10.4l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          </p>
        </div>
      </div>

      {/* Present from the prerender on, fully dark until measured, so the
          preview is never seen before its shadow. */}
      <div className="story-shade" style={{ opacity: live ? 1 - heat : 1 }} aria-hidden="true" />

      <section ref={story} className={"story" + (live ? " is-live" : "") + (settled ? " is-settled" : "")} data-away={away ? "" : undefined} aria-label="How Focus Mode works">
        <div className="story-pin">
          <ol ref={caps} className="story-caps" style={box ? { width: box.w, height: box.h } : undefined}>
            {CHAPTERS.map((c, i) => (
              <li key={c.lead} className={i === step ? "on" : ""}>
                <h2>
                  <span>{c.lead}</span> {emphasise(c.rest)}
                </h2>
              </li>
            ))}
          </ol>
          <p className={"pol-wrap" + (step === CHAPTERS.length - 1 ? " on" : "")}>
            <Link to="/privacy" className="pol" tabIndex={!live || step === CHAPTERS.length - 1 ? 0 : -1}>
              <span className="pol-text">Read the policy</span>
              <PrivacyIcon />
            </Link>
          </p>
          <Compare reveal={reveal} heat={heat} pane={pane} channel={now.channel} shorts={now.shorts} />
        </div>
      </section>

      <section className="highlights">
        <h2>The short version.</h2>
        <div className="hl-grid">
          {HIGHLIGHTS.map(([n, h, t]) => (
            <div className="hl-card" key={h}>
              <p className="hl-n">{n}</p>
              <h3>{h}</h3>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
