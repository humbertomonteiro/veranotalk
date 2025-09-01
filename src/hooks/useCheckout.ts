import { useContext } from "react";
import { CheckoutContext } from "../contexts/CheckoutContext";

export default function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout deve ser usado dentro de um CheckoutProvider");
  }
  return context;
}
