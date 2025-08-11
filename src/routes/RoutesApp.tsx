import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Checkout from "../pages/Checkout";
import SuccessPage from "../pages/SuccessPage";
import AreaParticipante from "../pages/AreaParticipant";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Sponsor from "../pages/Sponsor";
import Sponsors from "../components/sections/Sponsors";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/apoiar" element={<Sponsor />} />
      <Route path="/apoiar-categorias" element={<Sponsors />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/area-participant" element={<AreaParticipante />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
