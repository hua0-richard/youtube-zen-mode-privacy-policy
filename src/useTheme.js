import { useCallback, useEffect, useState } from "react";

const KEY = "ut-theme";

/* Wrapped: a browser set to block site data throws on the accessor itself
   rather than returning null. */
export function readTheme() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function writeTheme(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    /* nothing to do about it */
  }
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/* The theme override.
 *
 * The attribute on <html> is the state; this hook only moves it. The
 * stylesheet answers `prefers-color-scheme` on its own and shows the right
 * icon for whichever attribute is or is not there, so nothing here has to run
 * for the page to be correct — which is the point, since the markup is
 * prerendered and hydrates late.
 *
 * `dark` starts as null rather than as a guess. Reading matchMedia during
 * render would make the first client render disagree with the prerendered
 * HTML, and there is nothing to disagree about: no rendered markup depends on
 * it, only the button's label. */
export function useTheme() {
  const [dark, setDark] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    const stored = readTheme();
    if (stored) root.setAttribute("data-theme", stored);
    setDark(stored ? stored === "dark" : systemPrefersDark());
  }, []);

  const toggle = useCallback(() => {
    setDark((was) => {
      const now = !(was ?? systemPrefersDark());
      const value = now ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", value);
      writeTheme(value);
      return now;
    });
  }, []);

  return { dark, toggle };
}
