import { Link, NavLink } from "react-router-dom";
import { Mark } from "./Mark.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { PAGES } from "../data/nav.js";

export function Header() {
  return (
    <header className="hdr">
      <div className="hdr-bar">
        <Link className="hdr-home" to="/">
          <Mark />
          <span className="hdr-name">Focus Mode</span>
        </Link>
        <nav className="hdr-nav">
          {PAGES.map((page) => (
            <NavLink
              key={page.id}
              className="btn"
              to={page.path}
              end={page.path === "/"}
            >
              {page.nav}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
