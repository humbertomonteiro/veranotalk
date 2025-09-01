import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.ts";
import UserProvider from "./contexts/UserContext.tsx";
import CouponProvider from "./contexts/CouponContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <CouponProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CouponProvider>
  </UserProvider>
);
