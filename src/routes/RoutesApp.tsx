import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Checkout from "../pages/Checkout";
import SuccessPage from "../pages/SuccessPage";
import AreaParticipante from "../pages/AreaParticipant";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Sponsor from "../pages/Sponsor";
import BoxesSponsors from "../pages/BoxesSponsors";
import ImageFly from "../pages/ImageFly";
import Login from "../pages/Login";

import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import WebArchive from "../pages/WebArchive";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      <Route path="/apoiar" element={<Sponsor />} />
      <Route path="/webarchive" element={<WebArchive />} />
      <Route path="/apoiar-local" element={<BoxesSponsors />} />
      <Route
        path="/apoiar-nacional"
        element={<BoxesSponsors type="national" />}
      />

      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/area-participant" element={<AreaParticipante />} />

      <Route path="/fly" element={<ImageFly />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<Home />} />
    </Routes>
  );
}
