export const STORED = [
  {
    what: ["Subscription list, and a slice of the feed"],
    where: [{ code: "chrome.storage.local" }],
  },
  {
    what: ["Which videos are Shorts"],
    where: [{ code: "chrome.storage.local" }],
  },
  {
    what: ["On/off, and picture quality"],
    where: [{ code: "chrome.storage.sync" }, " / ", { code: "local" }],
  },
  {
    what: ["Opened rows, hidden channels, column widths"],
    where: [{ code: "localStorage" }, " on youtube.com"],
  },
  {
    what: ["Which page you came from"],
    where: [{ code: "sessionStorage" }, " on youtube.com"],
  },
  {
    what: [{ code: "storage" }, " permission"],
    where: ["caches and settings"],
  },
  {
    what: [{ code: "https://www.youtube.com/*" }],
    where: ["the only site it runs on"],
  },
];
