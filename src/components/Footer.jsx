import { Link } from "react-router-dom";
import { Mark } from "./Mark.jsx";

/* Placeholder content throughout: the groups, the labels, the
   language are filler until there is something real to point at. A `to`
   is a page on this site; an `href` goes nowhere yet. */
const GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Add to Chrome", href: "#" },
      { label: "How it works", to: "/" },
      { label: "Features", href: "#" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our story", href: "#" },
      { label: "Press kit", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Report a bug", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of use", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-main">
        <div className="foot-id">
          <Link to="/" className="foot-brand">
            <Mark />
            Focus Mode For YouTube
          </Link>
          <p>YouTube as a plain list of the channels you chose.</p>
        </div>
        <nav className="foot-cols" aria-label="Footer">
          {GROUPS.map((g) => (
            <div className="foot-col" key={g.title}>
              <h3>{g.title}</h3>
              <ul>
                {g.links.map((l) => (
                  <li key={l.label}>{l.to ? <Link to={l.to}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}</li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="foot-base">
        <p>© 2026 Focus Mode For YouTube. Not affiliated with YouTube or Google.</p>
        <div className="foot-social">
          <span className="foot-lang">English</span>
        </div>
      </div>
    </footer>
  );
}
