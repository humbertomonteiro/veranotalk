import { config } from "../config";
import {
  type TransactionProps,
  TransactionCategory,
} from "../contexts/TransactionContext";

export class TransactionService {
  async createTransaction(
    transactionData: Omit<TransactionProps, "id" | "createdAt" | "updatedAt">
  ): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
          date: transactionData.date.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar transação");
      }

      const data = await response.json();
      return {
        ...data,
        date: new Date(data.date), // Converte a data de volta para objeto Date
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error("Erro no frontend ao criar transação:", error);
      throw error; // Relança o erro para ser tratado no componente
    }
  }

  async getTransactionById(id: string): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/transactions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar transação");
      }

      const data = await response.json();
      return {
        ...data,
        date: new Date(data.date),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error(
        `Erro no frontend ao buscar transação por ID ${id}:`,
        error
      );
      throw error;
    }
  }

  async updateTransaction(
    id: string,
    transactionData: Partial<
      Omit<TransactionProps, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<any> {
    try {
      const response = await fetch(`${config.baseUrl}/transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...transactionData,
          date: transactionData.date
            ? transactionData.date.toISOString()
            : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar transação");
      }

      const data = await response.json();
      return {
        ...data,
        date: new Date(data.date),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error(`Erro no frontend ao atualizar transação ${id}:`, error);
      throw error;
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    try {
      const response = await fetch(`${config.baseUrl}/transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao deletar transação");
      }
    } catch (error) {
      console.error(`Erro no frontend ao deletar transação ${id}:`, error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<any[]> {
    try {
      const response = await fetch(`${config.baseUrl}/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar transações");
      }

      const data = await response.json();
      return data.map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      }));
    } catch (error) {
      console.error("Erro no frontend ao buscar todas as transações:", error);
      throw error;
    }
  }

  async getTransactionsByCategory(
    category: TransactionCategory
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${config.baseUrl}/transactions/category/${category}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao buscar transações por categoria"
        );
      }

      const data = await response.json();
      return data.map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      }));
    } catch (error) {
      console.error(
        `Erro no frontend ao buscar transações por categoria ${category}:`,
        error
      );
      throw error;
    }
  }

  async getTransactionsByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      const response = await fetch(
        `${
          config.baseUrl
        }/transactions/period?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao buscar transações por período"
        );
      }

      const data = await response.json();
      return data.map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.createdAt),
        updatedAt: new Date(transaction.updatedAt),
      }));
    } catch (error) {
      console.error(
        `Erro no frontend ao buscar transações por período ${startDate} a ${endDate}:`,
        error
      );
      throw error;
    }
  }

  async getCashFlowSummary(): Promise<{
    totalDeposits: number;
    totalExpenses: number;
    balance: number;
    totalsByCategory: Record<
      TransactionCategory,
      { deposits: number; expenses: number }
    >;
  }> {
    try {
      const response = await fetch(
        `${config.baseUrl}/transactions/cashflow/summary`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao buscar resumo do fluxo de caixa"
        );
      }

      return await response.json();
    } catch (error) {
      console.error(
        "Erro no frontend ao buscar resumo do fluxo de caixa:",
        error
      );
      throw error;
    }
  }

  async getCashFlowByPeriod(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalDeposits: number;
    totalExpenses: number;
    balance: number;
    transactions: any[];
  }> {
    try {
      const response = await fetch(
        `${
          config.baseUrl
        }/transactions/cashflow/period?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao buscar fluxo de caixa por período"
        );
      }

      const data = await response.json();
      return {
        ...data,
        transactions: data.transactions.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
          createdAt: new Date(transaction.createdAt),
          updatedAt: new Date(transaction.updatedAt),
        })),
      };
    } catch (error) {
      console.error(
        `Erro no frontend ao buscar fluxo de caixa por período ${startDate} a ${endDate}:`,
        error
      );
      throw error;
    }
  }
}
