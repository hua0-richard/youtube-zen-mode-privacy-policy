import { Link, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { Mark } from "./components/Mark.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { PrivacyPage } from "./pages/PrivacyPage.jsx";

/* Two pages: the landing page at `/` and the privacy policy at `/privacy`. */
export function App() {
  return (
    <>
      <Header />
      <div className="wrap">
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
        <footer className="foot">
          <div className="foot-top">
            <Link to="/" className="foot-brand">
              <Mark />
              Focus Mode For YouTube
            </Link>
            <nav className="foot-nav" aria-label="Footer">
              <Link to="/">Home</Link>
              <Link to="/privacy">Privacy policy</Link>
            </nav>
          </div>
          <p className="foot-fine">Focus Mode For YouTube is not affiliated with YouTube or Google.</p>
        </footer>
      </div>
    </>
  );
}
