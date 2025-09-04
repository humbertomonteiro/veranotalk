import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes/RoutesApp";
import { CheckoutProvider } from "./contexts/CheckoutContext";
import TransactionProvider from "./contexts/TransactionContext";
import { useEffect } from "react";

import Aos from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    Aos.init({
      duration: 1000,
    });
  }, []);

  return (
    <BrowserRouter>
      <CheckoutProvider>
        <TransactionProvider>
          <RoutesApp />
          <div className="area"></div>
        </TransactionProvider>
      </CheckoutProvider>
    </BrowserRouter>
  );
}

export default App;
