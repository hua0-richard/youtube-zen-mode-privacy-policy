import { NavLink, Link } from "react-router-dom";
import { Mark } from "./Mark.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

/* A floating pill: the mark, the pages beside it, and the theme control at
   the far end. */
export function Header() {
  return (
    <header className="hdr">
      <div className="hdr-bar">
        <Link to="/" className="hdr-home" aria-label="Focus Mode">
          <Mark />
        </Link>
        <nav className="hdr-nav" aria-label="Pages">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
