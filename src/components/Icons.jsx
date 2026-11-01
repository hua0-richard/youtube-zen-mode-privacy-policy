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

/* The privacy mark: a padlock on a tile. */
export function PrivacyIcon() {
  return (
    <svg className="pol-tile" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <rect width="28" height="28" rx="8" fill="currentColor" />
      <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8.5" y="12.5" width="11" height="8" rx="2.2" />
        <path d="M10.7 12.5V10.6a3.3 3.3 0 0 1 6.6 0v1.9" />
        <path d="M14 16v1.6" />
      </g>
    </svg>
  );
}

/* The Chrome Web Store icon, as Google draws it (the 2022 mark, from
   Wikimedia Commons): the store bag with its handle slot, and the Chrome wheel
   rising from the bottom edge. Colours and gradients are Google's own. */
export function ChromeStoreIcon() {
  return (
    <svg className="add-icon" viewBox="0 0 152.01 132" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="cws-r" gradientUnits="userSpaceOnUse" gradientTransform="translate(-20,-678)" x1="39.16" y1="775.015" x2="152.84" y2="775.015">
          <stop offset="0" stopColor="#d93025" />
          <stop offset="1" stopColor="#ea4335" />
        </linearGradient>
        <linearGradient id="cws-g" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-0.5,-0.866,0.866,-0.5,-553.5404,-800.0297)" x1="-1169.8269" y1="59.7414" x2="-1056.1232" y2="59.7414">
          <stop offset="0" stopColor="#1e8e3e" />
          <stop offset="1" stopColor="#34a853" />
        </linearGradient>
        <linearGradient id="cws-y" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-0.5,0.866,-0.866,-0.5,-423.9008,-292.818)" x1="56.7071" y1="-664.7747" x2="170.4071" y2="-664.7747">
          <stop offset="0" stopColor="#fbbc04" />
          <stop offset="1" stopColor="#fcc934" />
        </linearGradient>
      </defs>
      <path fill="#f1f3f4" d="M0 0v121.631C0 127.351 4.639 132 10.369 132h131.272c5.72 0 10.369-4.639 10.369-10.369L152 0Zm58.73 14.52h34.54a6.91 6.91 0 0 1 0 13.82H58.73a6.91 6.91 0 0 1 0-13.82z" />
      <path fill="#e8eaed" d="M0 0v66.35h152V0Zm58.73 14.52h34.54a6.91 6.91 0 0 1 0 13.82H58.73a6.91 6.91 0 0 1 0-13.82z" />
      <path fill="url(#cws-r)" d="M76 55.99c-24.29 0-45.49 13.19-56.84 32.81l9.05 27.61L42.18 132h8.89L76 88.81l56.84-.01C121.49 69.18 100.29 55.99 76 55.99Z" />
      <path fill="url(#cws-g)" d="M19.16 88.8C11.69 101.77 8.8 117.05 11.19 132h32.91z" />
      <path fill="url(#cws-y)" d="M76 88.81 100.93 132h39.88c2.39-14.94-.51-30.22-7.97-43.19z" />
      <path fill="#f1f3f4" d="M76 88.81c-18.12 0-32.81 14.69-32.81 32.82 0 3.63.6 7.11 1.68 10.37h62.25c1.09-3.26 1.68-6.74 1.68-10.37C108.81 103.5 94.12 88.81 76 88.81Z" />
      <path fill="#1a73e8" d="M76 94.96a26.66 26.67 0 0 0-26.66 26.67 26.66 26.67 0 0 0 2.15 10.37h49.03a26.66 26.67 0 0 0 2.14-10.37A26.66 26.67 0 0 0 76 94.96Z" />
    </svg>
  );
}
