import { useState, createContext, useEffect } from "react";
import { TransactionService } from "../services/transaction";

export enum TransactionCategory {
  Sponsor = "SPONSOR",
  Speaker = "SPEAKER",
  Marketing = "MARKETING",
  Infrastructure = "INFRASTRUCTURE",
  Collaborators = "COLLABORATORS",
  Other = "OTHER",
}

export interface TransactionProps {
  id?: string;
  amount: number;
  type: "deposit" | "expense";
  description: string;
  date: Date;
  category: TransactionCategory;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CashFlowSummary {
  totalDeposits: number;
  totalExpenses: number;
  balance: number;
  totalsByCategory: Record<
    TransactionCategory,
    { deposits: number; expenses: number }
  >;
}

interface TransactionContextType {
  transaction: TransactionProps | null;
  setTransaction: React.Dispatch<React.SetStateAction<TransactionProps | null>>;
  transactions: TransactionProps[] | [];
  setTransactions: React.Dispatch<
    React.SetStateAction<[] | TransactionProps[]>
  >;
  cashFlowSummary: CashFlowSummary | null;
  setCashFlowSummary: React.Dispatch<
    React.SetStateAction<CashFlowSummary | null>
  >;
}

export const TransactionContext = createContext<
  TransactionContextType | undefined
>(undefined);

export default function TransactionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transaction, setTransaction] = useState<TransactionProps | null>(null);
  const [transactions, setTransactions] = useState<TransactionProps[] | []>([]);
  const [cashFlowSummary, setCashFlowSummary] =
    useState<CashFlowSummary | null>(null);

  useEffect(() => {
    const transactionService = new TransactionService(); // Instantiate inside useEffect

    async function loadInitialData() {
      try {
        // Carregar todas as transações
        const transactionsData = await transactionService.getAllTransactions();
        setTransactions(transactionsData);

        // Carregar resumo do fluxo de caixa
        const summaryData = await transactionService.getCashFlowSummary();
        setCashFlowSummary(summaryData);
      } catch (error) {
        console.error(
          "Erro ao carregar dados iniciais do TransactionContext:",
          error
        );
      }
    }

    loadInitialData();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        transaction,
        setTransaction,
        transactions,
        setTransactions,
        cashFlowSummary,
        setCashFlowSummary,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
