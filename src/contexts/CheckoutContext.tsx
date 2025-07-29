import { createContext, useState, type ReactNode } from "react";
import { Checkout } from "../domain/entities";

// 2. Tipo do contexto exposto
type CheckoutContextType = {
  checkout: Checkout | undefined;
  setCheckout: (data: Checkout) => void;
};

// 3. Criação do contexto
export const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

// 4. Provider
type Props = {
  children: ReactNode;
};

export const CheckoutProvider = ({ children }: Props) => {
  const [checkout, setCheckout] = useState<Checkout>();

  return (
    <CheckoutContext.Provider value={{ checkout, setCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
};
