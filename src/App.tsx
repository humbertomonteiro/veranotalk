import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes/RoutesApp";
import { CheckoutProvider } from "./contexts/CheckoutContext";

function App() {
  return (
    <BrowserRouter>
      <CheckoutProvider>
        <RoutesApp />
        <div className="area"></div>
      </CheckoutProvider>
    </BrowserRouter>
  );
}

export default App;
