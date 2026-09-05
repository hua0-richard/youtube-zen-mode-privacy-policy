/* Vite's base, without a trailing slash. React Router treats `/` and
   `/repo` as the two legal shapes; `BASE_URL` is always slashed. */
export const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
