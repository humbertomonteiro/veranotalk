import { config } from "../config";
import { type CheckoutStatus, Checkout } from "../domain/entities";

interface ResponseOutput {
  checkoutId: string;
  paymentUrl: string;
  status: CheckoutStatus;
  dataCheckout: Checkout;
}

export class CheckoutService {
  async createCheckout(checkoutData: any): Promise<ResponseOutput> {
    try {
      const response = await fetch(`${config.baseUrl}/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao processar checkout");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao criar pagamento");
    }
  }

  async createManualCheckout(checkoutData: {
    participants: Array<{
      name: string;
      email: string;
      phone: string;
      document: string;
      ticketType: "all";
    }>;
    checkout: {
      fullTickets: number;
      halfTickets: number;
      paymentMethod: string;
      installments: number;
      totalAmount: number;
      metadata: {
        eventId: string;
        manualPayment: boolean;
        processedBy: string;
      };
    };
  }): Promise<{
    success: boolean;
    checkoutId: string;
    participantIds: string[];
    status: string;
    message: string;
  }> {
    try {
      const response = await fetch(`${config.baseUrl}/webhook/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar checkout manual");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no createManualCheckout:", error);
      throw error;
    }
  }

  async deleteCheckout(uid: string): Promise<void> {
    try {
      const response = await fetch(`${config.baseUrl}/webhook/${uid}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao deletar checkout");
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao deletar checkout");
    }
  }
}
