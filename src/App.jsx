import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer.jsx";
import { Header } from "./components/Header.jsx";
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
        <Footer />
      </div>
    </>
  );
}
