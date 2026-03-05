export interface PatientAppointment {
  id: number;
  medico: string;
  especialidade: string;
  data: string;
  local: string;
  status: 'Confirmada' | 'Agendado' | 'Concluido' | 'Concluído' | 'Cancelado';
}

export interface PatientHistoryItem {
  id: number;
  tipo: string;
  data: string;
  especialidade: string;
  medico: string;
  status: string;
  local?: string;
}

export interface PatientPaymentInvoice {
  id: number;
  descricao: string;
  vencimento: string;
  valor: string;
  status: 'Pendente' | 'Pago' | 'Atrasado' | 'Vencido';
  doutor?: string;
  pagamento?: string;
}

export interface PatientPrescriptionDoc {
  id: number;
  profissional: string;
  data: string;
  tipo: string;
  validade: string;
  status: 'Ativo' | 'Pendente' | 'Expirado';
}

export interface PatientSavedCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  holder: string;
  expiry: string;
  color: string;
  gradient: string;
}

export interface PatientEditableCardData {
  number?: string;
  holder?: string;
  expiry?: string;
  cvv?: string;
}
