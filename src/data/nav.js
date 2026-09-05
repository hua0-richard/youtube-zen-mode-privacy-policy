/* The three pages, in one place, so the header and the document title
   cannot disagree about what the site contains. */

export const PAGES = [
  {
    id: "index",
    path: "/",
    nav: "Privacy",
    documentTitle: "Privacy Policy — Focus Mode For YouTube",
    description:
      "Focus Mode For YouTube collects nothing, sends nothing, and has no server.",
  },
  {
    id: "features",
    path: "/features",
    nav: "Features",
    documentTitle: "Features — Focus Mode For YouTube",
    description:
      "A subscriptions-only reading list: no home feed, no recommendations, no Shorts.",
  },
  {
    id: "storage",
    path: "/storage",
    nav: "Storage",
    documentTitle: "Storage — Focus Mode For YouTube",
    description:
      "Every value the extension keeps, where it is kept, and why. Nothing is uploaded.",
  },
];

export function pageByPath(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  return PAGES.find((p) => (p.path.replace(/\/$/, "") || "/") === clean) ?? PAGES[0];
}
