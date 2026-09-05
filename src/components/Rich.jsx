/* A run of text that mixes prose with API names.
 *
 * Parts are strings or `{ code }`. Keeping it to these two means the content
 * files stay data and never reach for markup; anything that needs more than
 * this belongs in a page as JSX. */
export function Rich({ parts }) {
  return parts.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <code key={i}>{part.code}</code>
    )
  );
}
