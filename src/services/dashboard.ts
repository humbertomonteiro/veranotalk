import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

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

import { type ParticipantProps, type CheckoutProps } from "../domain/entities";

// export type Participant = {
//   id: string;
//   checkedIn: boolean;
//   checkoutId: string;
//   createdAt: string;
//   document: string;
//   email: string;
//   eventId: string;
//   name: string;
//   phone: string;
//   qrCode: string;
//   ticketType: string;
//   updatedAt: string;
// };

// export type Checkout = {
//   id: string;
//   couponCode?: string;
//   createdAt: string;
//   discountAmount?: number;
//   fullTickets: number;
//   halfTickets: number;
//   mercadoPagoId?: string;
//   mercadoPagoPreferenceId?: string;
//   metadata: {
//     error?: string;
//     retryCount?: number;
//     participantIds?: string[];
//     eventId?: string;
//     manualPayment?: boolean;
//     processedBy?: string;
//   };
//   originalAmount?: number;
//   payer: {
//     document: string;
//     name: string;
//   };
//   paymentMethod: string;
//   status: string;
//   totalAmount: number;
//   updatedAt: string;
// };

export class DashboardService {
  async getCheckouts(filters: {
    checkoutId?: string;
    couponCode?: string;
    paymentMethod?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    try {
      console.log("Buscando checkouts com filtros:", filters);
      let q = query(collection(db, "checkouts"), orderBy("createdAt", "desc"));

      if (filters.checkoutId) {
        q = query(q, where("id", "==", filters.checkoutId));
      }
      if (filters.couponCode) {
        q = query(q, where("couponCode", "==", filters.couponCode));
      }
      if (filters.paymentMethod) {
        q = query(q, where("paymentMethod", "==", filters.paymentMethod));
      }
      if (filters.startDate) {
        q = query(
          q,
          where("createdAt", ">=", Timestamp.fromDate(filters.startDate))
        );
      }
      if (filters.endDate) {
        q = query(
          q,
          where("createdAt", "<=", Timestamp.fromDate(filters.endDate))
        );
      }
      if (filters.status) {
        q = query(q, where("status", "==", filters.status));
      }

      const querySnapshot = await getDocs(q);
      const checkouts: CheckoutProps[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as CheckoutProps;
      });
      return checkouts;
    } catch (err) {
      console.error("Erro ao buscar checkouts:", err);
      return [];
    }
  }

  async getParticipants(filters: {
    document?: string;
    email?: string;
    checkedIn?: boolean;
  }) {
    try {
      console.log("Buscando participantes com filtros:", filters);
      let q = query(
        collection(db, "participants"),
        orderBy("createdAt", "desc")
      );

      if (filters.document) {
        q = query(q, where("document", "==", filters.document));
      }
      if (filters.email) {
        q = query(q, where("email", "==", filters.email));
      }
      if (filters.checkedIn !== undefined) {
        q = query(q, where("checkedIn", "==", filters.checkedIn));
      }

      const querySnapshot = await getDocs(q);
      const participants: ParticipantProps[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as ParticipantProps;
      });
      return participants;
    } catch (err) {
      console.error("Erro ao buscar participantes:", err);
      return [];
    }
  }

  async getStats() {
    try {
      console.log("Buscando estatísticas para checkouts aprovados...");
      const approvedCheckouts = await this.getCheckouts({ status: "approved" });
      console.log("Checkouts aprovados encontrados:", approvedCheckouts);

      let totalValue = 0;
      let totalApprovedCheckouts = approvedCheckouts.length;
      let totalParticipantsInApproved = 0;

      approvedCheckouts.forEach((checkout) => {
        totalValue += checkout.totalAmount || 0;
        totalParticipantsInApproved +=
          checkout.metadata?.participantIds?.length || 0;
      });

      const stats = {
        totalValue,
        totalApprovedCheckouts,
        totalParticipantsInApproved,
      };
      console.log("Estatísticas calculadas:", stats);
      return stats;
    } catch (err) {
      console.error("Erro ao calcular stats:", err);
      return {
        totalValue: 0,
        totalApprovedCheckouts: 0,
        totalParticipantsInApproved: 0,
      };
    }
  }

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
        throw new Error(errorData.error || "Erro ao criar checkout manual");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro em atualizar:", error);
      throw error;
    }
  }
}
