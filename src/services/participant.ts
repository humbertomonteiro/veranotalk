import { config } from "../config";

interface UpdateRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  ticketType?: string;
  status?:
    | "pending"
    | "processing"
    | "approved"
    | "rejected"
    | "refunded"
    | "cancelled"
    | "failed";
  paymentMethod?: string;
  totalAmount?: number;
  repo?: "participant" | "checkout" | "both";
}

export class ParticipantService {
  async updateCheckoutAndParticipant(
    uid: string,
    checkoutData: UpdateRequestBody,
    repo: "participant" | "checkout" | "both"
  ) {
    try {
      const response = await fetch(`${config.baseUrl}/participant/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...checkoutData, repo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao editar Participante");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro em atualizar:", error);
      throw error;
    }
  }
}
