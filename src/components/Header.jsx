import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Mark } from "./Mark.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

/* The bar, in the shape of Vercel's: the mark, the pages beside it, and the
   controls at the far end. A hairline appears only once the page has moved. */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hdr" data-scrolled={scrolled ? "" : undefined}>
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
