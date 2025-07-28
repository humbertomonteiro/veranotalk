// types.ts
export interface Participant {
  name: string;
  email: string;
  phone: string;
  tickets: Ticket;
  certificateAvailable: boolean;
}

export interface Ticket {
  type: string;
  batch: string;
  qrCode: string;
}

export interface EventInfo {
  name: string;
  date: string;
  time: string;
  address: string;
  speakers: string[];
}

export interface PaymentInfo {
  total: number;
  fullPriceTickets: number;
  halfPriceTickets: number;
  transactionId: string;
}
