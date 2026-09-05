import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* One app, one entry. React Router owns the three pages. `base` is `/` so
   `/features` and `/storage` can load the same assets; a host that sits the
   site under a path should set `base` to that path. */
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    target: "es2020",
    assetsInlineLimit: 4096,
  },
});
