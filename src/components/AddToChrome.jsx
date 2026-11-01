import { ChromeStoreIcon } from "./Icons.jsx";

/* TODO: replace with the extension's Chrome Web Store listing URL. */
export const STORE_URL = "https://chromewebstore.google.com/";

/* A link, since it goes to the store. `size` is "lg" or "sm". */
export function AddToChrome({ size = "lg", className = "", tabIndex }) {
  return (
    <a
      className={`add-btn add-${size} ${className}`.trim()}
      href={STORE_URL}
      tabIndex={tabIndex}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ChromeStoreIcon />
      Add to Chrome
    </a>
  );
}
