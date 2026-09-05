/* The app's mark: a play triangle. YouTube's own is theirs to draw and not
   ours. It takes its colour from `--ut-mark`, the one red on the site. */
export function Mark() {
  return (
    <svg className="mark" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path
        d="M6.5 4.5 L6.5 15.5 L16 10 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
