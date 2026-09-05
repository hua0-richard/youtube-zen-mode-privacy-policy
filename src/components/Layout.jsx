import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header.jsx";
import { pageByPath } from "../data/nav.js";

export function Layout() {
  const { pathname } = useLocation();
  const page = pageByPath(pathname);

  useEffect(() => {
    document.title = page.documentTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", page.description);
  }, [page]);

  return (
    <>
      <Header />
      <div className="wrap">
        <main>
          <Outlet />
        </main>
        <footer className="foot">
          <p>
            Focus Mode For YouTube is not affiliated with YouTube or Google.
          </p>
        </footer>
      </div>
    </>
  );
}
