import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export type Participant = {
  id: string;
  checkedIn: boolean;
  checkoutId: string;
  createdAt: string;
  document: string;
  email: string;
  eventId: string;
  name: string;
  phone: string;
  qrCode: string;
  ticketType: string;
  updatedAt: string;
};

export type Checkout = {
  id: string;
  couponCode?: string;
  createdAt: string;
  discountAmount?: number;
  fullTickets: number;
  halfTickets: number;
  mercadoPagoId?: string;
  mercadoPagoPreferenceId?: string;
  metadata: {
    eventId?: string;
    participantIds?: string[];
    retryCount?: number;
  };
  originalAmount?: number;
  payer: {
    document: string;
    name: string;
  };
  paymentMethod: string;
  status: string;
  totalAmount: number;
  updatedAt: string;
};

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
      const checkouts: Checkout[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Checkout encontrado:", { id: doc.id, ...data });
        return { id: doc.id, ...data } as Checkout;
      });
      console.log("Checkouts retornados:", checkouts);
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
      const participants: Participant[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Participante encontrado:", { id: doc.id, ...data });
        return { id: doc.id, ...data } as Participant;
      });
      console.log("Participantes retornados:", participants);
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
}
