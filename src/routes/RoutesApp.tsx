import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Checkout from "../pages/Checkout";
import SuccessPage from "../pages/SuccessPage";
import AreaParticipante from "../pages/AreaParticipant";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/area-participant" element={<AreaParticipante />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
