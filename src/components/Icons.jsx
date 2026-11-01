/* The two theme icons.
 *
 * Both are always rendered and the stylesheet shows one, which is what lets
 * the button be correct in the prerendered HTML before React has hydrated —
 * and correct for good if it never does. Picking one here from state would
 * mean the server render has to guess a theme it cannot know. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function MoonIcon() {
  return (
    <svg className="icon-moon" viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...stroke}>
      <path d="M13.2 9.8A5.6 5.6 0 0 1 6.2 2.8 5.9 5.9 0 1 0 13.2 9.8Z" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg className="icon-sun" viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...stroke}>
      <circle cx="8" cy="8" r="3.1" />
      <path d="M12.8 8h1.5M3.2 8H1.7M8 12.8v1.5M8 3.2V1.7M11.39 11.39l1.06 1.06M4.61 4.61 3.55 3.55M4.61 11.39l-1.06 1.06M11.39 4.61l1.06-1.06" />
    </svg>
  );
}
