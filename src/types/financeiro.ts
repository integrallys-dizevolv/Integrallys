export interface FinanceiroTransaction {
  id: number;
  data: string;
  tipo: string;
  unidade: string;
  descricao: string;
  categoria: string;
  valorTotal: number;
  valorPago: number;
  saldo: number;
  forma: string;
  status: string;
  numeroDocumento?: string;
  parcela?: string;
  dataEmissao?: string;
  cartaoBandeira?: string;
  cartaoFinal?: string;
  cartaoTitular?: string;
  fechamentoFatura?: string;
  vencimentoFatura?: string;
}

export interface FinanceiroAccount {
  id: number;
  name: string;
  balance: number;
  type: string;
}

export interface FinanceiroDailyMovement {
  id: number;
  hora: string;
  tipo: string;
  descricao: string;
  forma: string;
  valor: number;
  operador: string;
}

export interface DreItemDetail {
  label: string;
  value: number;
}

export interface DreItem {
  id: number;
  label: string;
  value: number;
  type: string;
  sub?: string;
  sub2?: string;
  expandable?: boolean;
  details?: DreItemDetail[];
}

export interface FinanceiroAdminData {
  transactions: FinanceiroTransaction[];
  accounts: FinanceiroAccount[];
  dailyMovements: FinanceiroDailyMovement[];
  dreItems: DreItem[];
}
