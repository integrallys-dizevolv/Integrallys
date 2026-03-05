export const CAIXA_STORAGE_KEYS = {
  transactions: 'recepcao_caixa_transactions_mock_db',
  fechamentos: 'recepcao_caixa_fechamentos_mock_db',
  reabertura: 'recepcao_caixa_reabertura_autorizada',
  status: 'recepcao_caixa_status_mock_db',
  abertura: 'recepcao_caixa_abertura_mock_db',
} as const;

export interface CaixaFechamentoMock {
  id: string;
  closedAt: string;
  saldoInicial: number;
  saldoFinal: number;
  valorTransferido: number;
  saldoRestante: number;
  usuario: string;
}
