import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Compare } from "../components/Compare.jsx";

/* A pinned stage and a timeline. While the page scrolls through the story the
   preview stays put and the scroll position is its progress: the YouTube layer
   wipes away as a function of it, and the captions hand over at quarter marks.
   Without JavaScript the captions are an ordinary list above the preview. */
const CHAPTERS = [
  { lead: "Every page is tuned for the next click.", rest: "Home, search, even the video page." },
  { lead: "Only what you chose.", rest: "Your subscriptions, newest first, one line each." },
  { lead: "Yours to shape.", rest: "One channel or all of them. Shorts off." },
  { lead: "Details, one click away.", rest: "Open any video beside the list, and nothing below it moves." },
  { lead: "Nothing leaves your browser.", rest: "No account, no server, no tracking.", link: true },
];

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

  useEffect(() => {
    document.title = "Focus Mode For YouTube";
  }, []);

  /* Progress through the pinned stretch, 0 to 1. */
  useEffect(() => {
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
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
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

  return (
    <>
      <div className="hero">
        <h1>YouTube, without the feed.</h1>
        <p className="lede">
          Focus Mode turns YouTube into a plain list of the channels you
          subscribe to, newest first.
        </p>
        <p className="cue" data-away={away ? "" : undefined} aria-hidden={away ? "true" : undefined}>
          <button type="button" className="cue-btn" onClick={learnMore} tabIndex={away ? -1 : 0}>
            Learn more
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M4 6.4 8 10.4l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </p>
      </div>

      {live && <div className="story-shade" style={{ opacity: 1 - heat }} aria-hidden="true" />}

      <section ref={story} className={"story" + (live ? " is-live" : "")} aria-label="How Focus Mode works">
        <div className="story-pin">
          <ol className="story-caps">
            {CHAPTERS.map((c, i) => (
              <li key={c.lead} className={i === step ? "on" : ""}>
                <h2>
                  <span>{c.lead}</span> {c.rest}
                  {c.link && (
                    <>
                      {" "}
                      <Link to="/privacy">Read the policy</Link>
                    </>
                  )}
                </h2>
              </li>
            ))}
          </ol>
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
