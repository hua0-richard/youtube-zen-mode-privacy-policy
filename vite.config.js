import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* One page, one entry. `base` is `/` because the site sits at the root of its
   host; a host that puts it under a path should set `base` to that path. */
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    target: "es2020",
    assetsInlineLimit: 4096,
  },
});
