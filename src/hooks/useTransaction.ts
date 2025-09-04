import { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

export default function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransaction deve ser usado dentro de um TransactionProvider"
    );
  }
  return context;
}
