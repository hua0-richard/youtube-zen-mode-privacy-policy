import { MoonIcon, SunIcon } from "./Icons.jsx";
import { useTheme } from "../useTheme.js";

/* The theme control, an icon button like every control in the extension's own
   header. It carries the state it will move you to, not the state you are in:
   the sun offers light and appears in the dark.
 *
 * Before the effect has run, `dark` is null and the label is the neutral
 * "Switch theme". The icon is never neutral, because the stylesheet picks it. */
export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  const label =
    dark === null ? "Switch theme" : dark ? "Use the light theme" : "Use the dark theme";

  return (
    <button className="btn btn-icon" type="button" onClick={toggle} aria-label={label}>
      <MoonIcon />
      <SunIcon />
    </button>
  );
}
