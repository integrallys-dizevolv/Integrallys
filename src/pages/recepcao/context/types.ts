export type AppointmentStatus =
  | "confirmed"
  | "check-in"
  | "waiting"
  | "in-progress"
  | "checked-out"
  | "cancelled"
  | "delayed";
export type PaymentStatus = "paid" | "partial" | "pending" | "unpaid";

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  rg?: string; // Optional
  inscricaoEstadual?: string; // Optional
  phone: string;
  email: string;
  birthDate?: string; // DATE string YYYY-MM-DD
  gender?: "masculino" | "feminino" | "outro";
  source: string; // How they found us (Indicação)
  status: "complete" | "incomplete";
  activeStatus?: "Ativo" | "Inativo" | "Óbito"; // Added 'Óbito'
  photoUrl?: string;
  lastVisit?: string;
  age?: string;
  plan?: string;
  address?: string;
  addressDetails?: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  specialNeeds?: {
    hasNeeds: boolean | string;
    categories?: string[]; // 'Física', 'Auditiva', 'Visual', 'Intelectual'
    details?: string;
  };
  responsible?: {
    name: string;
    cpf: string;
    phone: string;
    relationship?: string;
    birthDate?: string;
    age?: string;
  };
  financial?: {
    requiresReceipt: boolean | string;
    receiptData?: {
      useProfileData: boolean | string;
      taxId?: string; // CNPJ/CPF for receipt
      name?: string; // Name for receipt
      address?: string; // Address for receipt
    };
  };
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  specialistId: string;
  specialistName: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  totalValue: number;
  procedure: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  price: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "income" | "expense";
  value: number;
  method: "cash" | "card" | "pix" | "transfer" | "credit" | "debit";
  status: "cleared" | "pending";
  responsible?: string;
  hour?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  specialistName: string;
  date: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  status: "draft" | "converted" | "cancelled";
  totalValue: number;
}
