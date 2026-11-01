import { memo, useEffect, useRef } from "react";

/* The screen is drawn at a real laptop's size and scaled to fit the frame, so
   type, spacing and proportions are what they would be on the machine: 1240 by
   806 is the same shape as the hole in the frame image, set a little below a
   MacBook Pro 14's own 1352 by 878 so the type stays readable at this size. */
const DESIGN_W = 1240;

/* The preview: Focus Mode underneath, YouTube on top. `reveal` is how much of
   the stage has become Focus Mode, 0 to 1, and the page drives it from the
   scroll. The rows are the same kind of sample the extension draws: made-up
   titles, real-looking channels. */

/* Real thumbnail frames, saved in this site so the page never calls YouTube.
   The home page is the loud layer: faces, type, and color. Focus Mode stays
   the quiet list. */
const CARDS = [
  ["50 YouTubers Fight For $1,000,000", "MrBeast", "498M views • 2 years ago", "41:27", "/thumbs/4SNThp0YiU4.jpg", "#3b82f6"],
  ["World's Largest Elephant Toothpaste Experiment", "Mark Rober", "101M views • 7 years ago", "10:33", "/thumbs/Kou7ur5xt_4.jpg", "#e85d4c"],
  ["Last to Leave Their Circle Wins $500,000", "MrBeast", "241M views • 1 year ago", "38:38", "/thumbs/zajUgQLviwk.jpg", "#3b82f6"],
];

const MORE = [
  ["7 Days Stranded On An Island", "MrBeast", "536M views • 2 years ago", "20:44", "/thumbs/erLbbextvlY.jpg", "#3b82f6"],
  ["I Spent 100 Hours Inside The Pyramids!", "MrBeast", "273M views • 1 year ago", "21:42", "/thumbs/NDsO1LT_0lw.jpg", "#3b82f6"],
  ["The SAT Question Everyone Got Wrong", "Veritasium", "18M views • 2 years ago", "18:24", "/thumbs/FUHkTs-Ipfg.jpg", "#1f2937"],
];

const SHORTS = [
  ["0:18", "/thumbs/s-ZNt_GoOBHq8.jpg"],
  ["0:12", "/thumbs/s-0bhnBSHb0-Q.jpg"],
  ["0:56", "/thumbs/s-y4sBqb1ktSk.jpg"],
  ["0:48", "/thumbs/s-GpAVLH3fHpg.jpg"],
  ["0:34", "/thumbs/s-0ZYi2aoQwpk.jpg"],
  ["0:33", "/thumbs/s-zK2ay_8Q4IM.jpg"],
];

/* YouTube's Shorts mark: a tilted pill with a play triangle cut into it. */
const SHORTS_MARK =
  "M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z";

const RAIL = ["3Blue1Brown", "Computerphile", "Fireship", "Kurzgesagt", "Lex Fridman", "Mark Rober", "Numberphile", "Stanford Online", "Veritasium", "Wendover Productions", "Y Combinator"];

/* The row the details panel opens on, and what it shows. */
const OPEN = {
  ch: "Veritasium",
  title: "The SAT Question Everyone Got Wrong",
  meta: "11h ago · 18:24",
  thumb: "/thumbs/FUHkTs-Ipfg.jpg",
  about: "A question that looks like a warm-up, and the several ways a careful reader still gets it wrong. The answer is slower than the question.",
};

const DAYS = [
  ["Today", [
    ["Fireship", "The last real programmers are dying out", "3h ago"],
    ["Computerphile", "How image watermarking works", "9h ago"],
    ["Veritasium", "The SAT Question Everyone Got Wrong", "11h ago"],
    ["Lex Fridman", "A long conversation about the shape of intelligence", "14h ago"],
  ]],
  ["Yesterday", [
    ["Stanford Online", "EE292R: AI and Data for Science", "1d ago"],
    ["Y Combinator", "How to stand out in a world of AI designs", "1d ago"],
    ["3Blue1Brown", "A different way to see a matrix", "1d ago"],
    ["Numberphile", "A number nobody expected", "1d ago"],
    ["Kurzgesagt", "What happens if the sun goes quiet", "1d ago"],
  ]],
  ["Friday", [
    ["Mark Rober", "Building the world's quietest room", "3d ago"],
    ["Wendover Productions", "Why every airport is laid out the same way", "3d ago"],
    ["Fireship", "Ten tools I stopped using this year", "3d ago"],
    ["Veritasium", "The strange maths of a rolling ball", "3d ago"],
  ]],
];

export function Compare({ reveal = 1, heat = 1, pane = 0, channel = "", shorts = true }) {
  const stageRef = useRef(null);
  const edge = Math.min(1, Math.max(0, reveal));
  /* The shadow itself is the page's, at the bottom of the screen (see
     LandingPage). Here YouTube is only eased a little darker until the story
     reaches it, and is left entirely alone from then on. */
  const h = Math.min(1, Math.max(0, heat));
  const tone = h >= 1 ? undefined : `brightness(${0.78 + h * 0.22})`;

  /* Scale the desktop to the hole in the frame. */
  useEffect(() => {
    const el = stageRef.current;
    const fit = () => el.style.setProperty("--k", String(el.clientWidth / DESIGN_W));
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(el);
    return () => watch.disconnect();
  }, []);

  return (
    <figure className="cmp">
      <div className="cmp-device">
        <div className="cmp-stage" ref={stageRef}>
          <div className="cmp-canvas">
            <MenuBar />
            <div className="cmp-page">
              <div className="cmp-under">
                <Focus channel={channel} shorts={shorts} pane={pane} />
              </div>
              {edge < 1 && (
                <>
                  <div className="cmp-over" style={{ clipPath: `inset(0 0 0 ${edge * 100}%)`, filter: tone }}>
                    <Youtube />
                  </div>
                  {edge > 0.015 && (
                    <>
                      <div className="cmp-edge" style={{ left: `${edge * 100}%` }} />
                      <div className="cmp-line" style={{ left: `${edge * 100}%` }} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <img className="cmp-frame" src="/device/laptop.png" width="1216" height="735" alt="" />
      </div>
    </figure>
  );
}

/* The macOS menu bar: the front app's name, its menus, and the status items.
   No logos. The notch sits in the middle of it, so nothing is drawn there.
   Every glyph is the same 15px box and 1.4 stroke, and the type is 13px. */
function MenuBar() {
  const pen = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  const icon = (key, children) => (
    <svg key={key} className="mac-i" viewBox="0 0 16 16" width="15" height="15">
      {children}
    </svg>
  );
  return (
    <div className="mac-menu" aria-hidden="true">
      <span className="mac-menu-l">
        <b>Chrome</b>
        {["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </span>
      <span className="mac-menu-r">
        <svg className="mac-i mac-bat" viewBox="0 0 28 14" width="27" height="14">
          <rect x="0.6" y="0.6" width="23.6" height="12.8" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <rect x="2.3" y="2.3" width="17.2" height="9.4" rx="2.6" fill="currentColor" />
          <path d="M25.6 4.8c.9.3 1.5 1.1 1.5 2.2s-.6 1.9-1.5 2.2z" fill="currentColor" opacity="0.55" />
        </svg>
        {icon("wifi", <path {...pen} d="M1.8 6a8.4 8.4 0 0 1 12.4 0M4 8.5a5.2 5.2 0 0 1 8 0M6.2 11a2 2 0 0 1 3.6 0" />)}
        {icon("find", (
          <>
            <circle {...pen} cx="7" cy="7" r="4.2" />
            <path {...pen} d="M10.2 10.2 13.4 13.4" />
          </>
        ))}
        <span>Sun 9:41 AM</span>
      </span>
    </div>
  );
}

const Youtube = memo(function Youtube() {
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
        <span className="yt-mic">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z" />
          </svg>
        </span>
        <span className="yt-right">
          <span className="yt-create">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7z" />
            </svg>
            Create
          </span>
          <svg className="yt-bell" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.2L5 15.5V17h14v-1.5l-1.5-3.3V9A5.5 5.5 0 0 0 12 3.5zM10 19.5a2 2 0 0 0 4 0" />
          </svg>
          <span className="yt-avatar" />
        </span>
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
            {[...CARDS, MORE[0]].map(([title, ch, meta, time, thumb, avatar]) => (
              <Card key={title} title={title} ch={ch} meta={meta} time={time} thumb={thumb} avatar={avatar} />
            ))}
          </div>
          <div className="yt-shorts">
            <p>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="#ff0033" d={SHORTS_MARK} />
                <path fill="#fff" d="M10 14.65v-5.3L15 12l-5 2.65z" />
              </svg>
              Shorts
            </p>
            <div>
              {SHORTS.map(([len, thumb]) => (
                <span key={thumb}>
                  <img src={thumb} alt="" loading="lazy" decoding="async" />
                  <span>{len}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="yt-grid yt-more">
            {MORE.slice(1).map(([title, ch, meta, time, thumb, avatar]) => (
              <Card key={title} title={title} ch={ch} meta={meta} time={time} thumb={thumb} avatar={avatar} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

function Card({ title, ch, meta, time, thumb, avatar }) {
  return (
    <div className="yt-card">
      <div className="yt-thumb">
        <img src={thumb} alt="" loading="lazy" decoding="async" />
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
      {name === "shorts" && (
        <>
          <path {...pen} strokeWidth="1.5" d={SHORTS_MARK} />
          <path fill="currentColor" d="M10 14.65v-5.3L15 12l-5 2.65z" />
        </>
      )}
      {name === "subs" && <path {...pen} d="M5 7h14v12H5zM8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M9 12h6" />}
      {name === "you" && <path {...pen} d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM5.5 19.2a6.5 6.5 0 0 1 13 0" />}
    </svg>
  );
}

/* The extension's home screen, drawn from its own markup: the header (mark,
   "home", search, refresh and theme), the band (channels, Shorts switch,
   sort), the channel rail and the list, one row per video with the panel
   toggle at its head. Class names follow the extension's, with an fm- prefix. */
const Focus = memo(function Focus({ channel, shorts, pane }) {
  const shown = pane > 0.01;
  const pen = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <div className="fm" aria-hidden="true">
      <div className="fm-head">
        <span className="fm-home">
          <svg viewBox="0 0 20 20" width="20" height="20">
            <path d="M6.5 4.5 L6.5 15.5 L16 10 Z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="fm-brand">Home</span>
        <span className="fm-search">
          <svg viewBox="0 0 16 16" width="12" height="12">
            <circle cx="6.6" cy="6.6" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.1 10.1 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Search YouTube…</span>
        </span>
        <span className="fm-actions">
          <span className="fm-icon">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path {...pen} strokeWidth="1.4" d="M13 8a5 5 0 1 1-1.6-3.7" />
              <path {...pen} strokeWidth="1.4" d="M13.3 2.6v2.9h-2.9" />
            </svg>
          </span>
          <span className="fm-icon">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <circle {...pen} strokeWidth="1.4" cx="8" cy="8" r="3.2" />
              {["M8 1v1.6", "M8 13.4V15", "M1 8h1.6", "M13.4 8H15", "M3.05 3.05l1.13 1.13", "M11.82 11.82l1.13 1.13", "M3.05 12.95l1.13-1.13", "M11.82 4.18l1.13-1.13"].map((d) => (
                <path key={d} {...pen} strokeWidth="1.4" d={d} />
              ))}
            </svg>
          </span>
        </span>
      </div>
      <div className="fm-bar">
        <span className="fm-pill">
          <svg viewBox="0 0 16 16" width="16" height="16">
            <path {...pen} strokeWidth="1.4" d="M2.6 3.4h10.8L9.3 8.2v4.5l-2.6 1.4V8.2z" />
          </svg>
          {channel ? `1 of ${RAIL.length} channels` : "All channels"}
          <svg viewBox="0 0 16 16" width="10" height="10" className="fm-fold">
            <path {...pen} strokeWidth="1.4" d="M4.2 6.4 8 10.1l3.8-3.7" />
          </svg>
        </span>
        <span className="fm-pill">
          Shorts
          <span className={"fm-switch" + (shorts ? "" : " off")} />
        </span>
        <span className="fm-count" />
        <span className="fm-sortwrap">
          <span className="fm-barlabel">Sort</span>
          <span className="fm-tabs">
            <span className="on">Newest</span>
            <span>Oldest</span>
            <span>Channel</span>
          </span>
        </span>
      </div>
      <div className="fm-cols">
        <div className="fm-rail">
          <span className={"fm-chan" + (channel ? "" : " on")}>
            <span className="fm-ava fm-ava-all">
              <svg viewBox="0 0 18 18">
                {[5, 9, 13].map((cx) => (
                  <circle key={cx} cx={cx} cy="9" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
                ))}
              </svg>
            </span>
            <span>All channels</span>
          </span>
          {RAIL.map((name) => (
            <span className={"fm-chan" + (name === channel ? " on" : "")} key={name}>
              <span className="fm-ava">{name[0]}</span>
              <span>{name}</span>
            </span>
          ))}
        </div>
        <div className="fm-list">
          {DAYS.map(([day, all]) => [day, channel ? all.filter(([ch]) => ch === channel) : all]).filter(([, rows]) => rows.length).map(([day, rows]) => (
            <div key={day + channel} className="fm-fresh">
              <p className="fm-day">{day}</p>
              {rows.map(([ch, title, when]) => (
                <div className={"fm-row" + (shown && ch === OPEN.ch && title === OPEN.title ? " on" : "")} key={ch + title}>
                  <svg className="fm-open" viewBox="0 0 16 16" width="16" height="16">
                    <rect x="2.25" y="3.65" width="11.5" height="8.7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M10 3.65v8.7" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    <path className="fm-open-fill" d="M10 3.65h1.75a2 2 0 0 1 2 2v4.7a2 2 0 0 1-2 2H10z" fill="currentColor" />
                  </svg>
                  <span className="fm-ch">{ch}</span>
                  <span className="fm-title">{title}</span>
                  <span className="fm-when">{when}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {shown && (
          <div className="fm-pane" style={{ width: `${pane * 340}px`, opacity: Math.min(1, pane * 1.6) }}>
            <div className="fm-pane-in">
              <div className="fm-pane-thumb">
                <img src={OPEN.thumb} alt="" loading="lazy" decoding="async" />
              </div>
              <p className="fm-pane-title">{OPEN.title}</p>
              <p className="fm-pane-meta">
                {OPEN.ch} · {OPEN.meta}
              </p>
              <p className="fm-pane-about">{OPEN.about}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

function MenuIcon() {
  return (
    <svg className="yt-menu" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
