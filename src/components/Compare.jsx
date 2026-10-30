import { useEffect, useImperativeHandle, useRef, useState } from "react";

/* YouTube lies on top of Focus Mode, with one corner folded back. A click
   peels that sheet off, so Focus Mode is the page. The rows are the same
   kind of sample the extension draws: made-up titles, real-looking channels. */

const REACH = 520;
const REST_PEEL = 112;
const MIN_PEEL = 120;
const DRAG_SLOP = 4;
const FLICK = 0.5;

/* Real thumbnail frames, saved in this site so the page never calls YouTube.
   The home page is the loud layer: faces, type, and color. Focus Mode stays
   the quiet list. */
const CARDS = [
  ["50 YouTubers Fight For $1,000,000", "MrBeast", "498M views · 2 years ago", "41:27", "/thumbs/4SNThp0YiU4.jpg", "#3b82f6"],
  ["World's Largest Elephant Toothpaste Experiment", "Mark Rober", "101M views · 7 years ago", "10:33", "/thumbs/Kou7ur5xt_4.jpg", "#e85d4c"],
  ["Last to Leave Their Circle Wins $500,000", "MrBeast", "241M views · 1 year ago", "38:38", "/thumbs/zajUgQLviwk.jpg", "#3b82f6"],
];

const MORE = [
  ["7 Days Stranded On An Island", "MrBeast", "536M views · 2 years ago", "20:44", "/thumbs/erLbbextvlY.jpg", "#3b82f6"],
  ["I Spent 100 Hours Inside The Pyramids!", "MrBeast", "273M views · 1 year ago", "21:42", "/thumbs/NDsO1LT_0lw.jpg", "#3b82f6"],
  ["The SAT Question Everyone Got Wrong", "Veritasium", "18M views · 2 years ago", "18:24", "/thumbs/FUHkTs-Ipfg.jpg", "#1f2937"],
];

const SHORTS = [
  ["0:18", "/thumbs/s-ZNt_GoOBHq8.jpg"],
  ["0:12", "/thumbs/s-0bhnBSHb0-Q.jpg"],
  ["0:56", "/thumbs/s-y4sBqb1ktSk.jpg"],
  ["0:48", "/thumbs/s-GpAVLH3fHpg.jpg"],
  ["0:34", "/thumbs/s-0ZYi2aoQwpk.jpg"],
  ["0:33", "/thumbs/s-zK2ay_8Q4IM.jpg"],
];

const RAIL = ["All", "Fireship", "Computerphile", "Veritasium", "3Blue1Brown", "Stanford", "Numberphile"];

const DAYS = [
  ["Today", [
    ["Fireship", "The last real programmers are dying out", "3h"],
    ["Computerphile", "How image watermarking works", "9h"],
    ["Veritasium", "A question with a slow answer", "11h"],
  ]],
  ["Yesterday", [
    ["Stanford Online", "EE292R: AI and Data for Science", "1d"],
    ["Y Combinator", "How to stand out in a world of AI designs", "1d"],
    ["3Blue1Brown", "A different way to see a matrix", "1d"],
    ["Numberphile", "A number nobody expected", "1d"],
  ]],
];

export function Compare({ ref }) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);
  const grip = useRef(null);

  /* The hero button calls this: bring the preview up, then peel the sheet. */
  useImperativeHandle(ref, () => ({
    reveal() {
      const stage = stageRef.current;
      if (!stage) return;
      let peeled = false;
      const peel = () => {
        if (peeled) return;
        peeled = true;
        setOpen(true);
      };
      window.addEventListener("scrollend", peel, { once: true });
      stage.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(peel, 700);
    },
  }));

  /* How far the sheet rolls back once open, from the stage's own size. */
  useEffect(() => {
    const stage = stageRef.current;
    const size = () => {
      const box = stage.getBoundingClientRect();
      /* Past the far corner, so the sheet and its roll leave the frame. */
      stage.style.setProperty("--peel-open", `${Math.round(box.width + box.height + 120)}px`);
    };
    size();
    const watch = new ResizeObserver(size);
    watch.observe(stage);
    return () => watch.disconnect();
  }, []);

  function lift(e) {
    if (grip.current || open) return;
    const box = e.currentTarget.getBoundingClientRect();
    const dist = Math.hypot(box.right - e.clientX, box.bottom - e.clientY);
    const t = 1 - Math.min(1, dist / REACH);
    e.currentTarget.style.setProperty("--peel", `${Math.round(REST_PEEL + t * 170)}px`);
  }

  function settle(e) {
    if (grip.current) return;
    e.currentTarget.style.removeProperty("--peel");
  }

  /* The fold runs through the pointer: its distance from the bottom-right
     corner, measured along both edges, is the peel. */
  function down(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const stage = stageRef.current;
    const box = stage.getBoundingClientRect();
    const peel = parseFloat(getComputedStyle(stage).getPropertyValue("--peel")) || REST_PEEL;
    const reach = box.right - e.clientX + (box.bottom - e.clientY);
    grip.current = {
      box,
      offset: peel - reach,
      x: e.clientX,
      y: e.clientY,
      moved: false,
      peel,
      at: e.timeStamp,
      speed: 0,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e) {
    const g = grip.current;
    if (!g) return;
    if (!g.moved) {
      if (Math.hypot(e.clientX - g.x, e.clientY - g.y) < DRAG_SLOP) return;
      g.moved = true;
      setDragging(true);
    }
    const { box } = g;
    const reach = box.right - e.clientX + (box.bottom - e.clientY);
    const peel = Math.min(box.width + box.height - 24, Math.max(MIN_PEEL, reach + g.offset));
    const dt = e.timeStamp - g.at;
    if (dt > 0) g.speed = (peel - g.peel) / dt;
    g.peel = peel;
    g.at = e.timeStamp;
    stageRef.current.style.setProperty("--peel", `${peel}px`);
  }

  function release(e, cancelled) {
    const g = grip.current;
    if (!g) return;
    grip.current = null;
    const stage = stageRef.current;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!g.moved) {
      if (!cancelled) setOpen((v) => !v);
    } else if (g.speed > FLICK) {
      setOpen(true);
    } else if (g.speed < -FLICK) {
      setOpen(false);
    } else {
      setOpen(g.peel > (g.box.width + g.box.height) * 0.4);
    }
    setDragging(false);
    stage.style.removeProperty("--peel");
  }

  const cls = ["cmp-stage", open && "is-open", dragging && "is-drag"].filter(Boolean).join(" ");

  return (
    <figure className="cmp">
      <div ref={stageRef} className={cls} onPointerMove={lift} onPointerLeave={settle}>
        <div className="cmp-under">
          <Focus />
        </div>
        <div className="cmp-over">
          <Youtube />
        </div>
        <div className="cmp-peel" aria-hidden="true">
          <div className="cmp-shadow" />
          <div className="cmp-flap" />
        </div>
        <button
          type="button"
          className="cmp-hit"
          aria-pressed={open}
          aria-label={open ? "Lay YouTube back on top" : "Reveal Focus Mode"}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={(e) => release(e, false)}
          onPointerCancel={(e) => release(e, true)}
          onClick={(e) => {
            if (e.detail === 0) setOpen((v) => !v);
          }}
        />
      </div>
    </figure>
  );
}

function Youtube() {
  return (
    <div className="yt" aria-hidden="true">
      <div className="yt-bar">
        <MenuIcon />
        <span className="yt-logo">
          <svg viewBox="0 0 28 20" width="26" height="18" aria-hidden="true">
            <rect width="28" height="20" rx="6" fill="#ff0000" />
            <path d="M11.2 5.6v8.8L19.2 10z" fill="#fff" />
          </svg>
          YouTube
        </span>
        <span className="yt-search">
          <span>Search</span>
          <span className="yt-go">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.2 10.2 13.2 13.2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </span>
        <span className="yt-avatar" />
      </div>
      <div className="yt-body">
        <div className="yt-guide">
          <span className="on"><GuideIcon name="home" />Home</span>
          <span><GuideIcon name="shorts" />Shorts</span>
          <span><GuideIcon name="subs" />Subscriptions</span>
          <span><GuideIcon name="you" />You</span>
        </div>
        <div className="yt-main">
          <div className="yt-chips">
            <span className="on">All</span>
            <span>Music</span>
            <span>Live</span>
            <span>Gaming</span>
            <span>News</span>
            <span>Mixes</span>
          </div>
          <div className="yt-grid">
            {CARDS.map(([title, ch, meta, time, thumb, avatar]) => (
              <Card key={title} title={title} ch={ch} meta={meta} time={time} thumb={thumb} avatar={avatar} />
            ))}
          </div>
          <div className="yt-shorts">
            <p>
              <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
                <rect width="16" height="16" rx="4" fill="#ff0033" />
                <path d="M6.4 4.6v6.8L12.2 8z" fill="#fff" />
              </svg>
              Shorts
            </p>
            <div>
              {SHORTS.map(([len, thumb]) => (
                <span key={thumb}>
                  <img src={thumb} alt="" />
                  <span>{len}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="yt-grid yt-more">
            {MORE.map(([title, ch, meta, time, thumb, avatar]) => (
              <Card key={title} title={title} ch={ch} meta={meta} time={time} thumb={thumb} avatar={avatar} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, ch, meta, time, thumb, avatar }) {
  return (
    <div className="yt-card">
      <div className="yt-thumb">
        <img src={thumb} alt="" />
        <span>{time}</span>
      </div>
      <div className="yt-info">
        <span className="yt-ava" style={{ background: avatar }} />
        <div>
          <p>{title}</p>
          <small>{ch}</small>
          <small>{meta}</small>
        </div>
      </div>
    </div>
  );
}

function GuideIcon({ name }) {
  const pen = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {name === "home" && <path {...pen} d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />}
      {name === "shorts" && <path {...pen} d="M8 4.5h5.2L15 7.2H18a2 2 0 0 1 2 2v8.3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2h2zm2.2 5.2v5.6L15.2 12z" />}
      {name === "subs" && <path {...pen} d="M5 7h14v12H5zM8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M9 12h6" />}
      {name === "you" && <path {...pen} d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM5.5 19.2a6.5 6.5 0 0 1 13 0" />}
    </svg>
  );
}

function Focus() {
  return (
    <div className="fm" aria-hidden="true">
      <div className="fm-head">
        <svg className="fm-mark" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6.5 4.5 L6.5 15.5 L16 10 Z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        </svg>
        <span className="fm-search">Search</span>
        <span className="fm-count">24</span>
        <span className="fm-act">shorts: shown</span>
      </div>
      <div className="fm-cols">
        <div className="fm-rail">
          {RAIL.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
        <div className="fm-list">
          {DAYS.map(([day, rows]) => (
            <div key={day}>
              <p className="fm-day">{day}</p>
              {rows.map(([ch, title, when]) => (
                <div className="fm-row" key={ch + title}>
                  <span>{ch}</span>
                  <span>{title}</span>
                  <span>{when}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg className="yt-menu" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
