import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { FeaturesPage } from "./pages/FeaturesPage.jsx";
import { PrivacyPage } from "./pages/PrivacyPage.jsx";
import { StoragePage } from "./pages/StoragePage.jsx";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PrivacyPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/storage" element={<StoragePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
