import {
  BASE_PRESCRICOES,
  BASE_PRODUTOS_LIST,
  getPacienteById,
  getProfissionalById,
  getProdutoById
} from '@/mocks/shared/base'

export interface PrescriptionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Prescription {
  id: string;
  number: string;
  patientName: string;
  specialistName: string;
  createdAt: string;
  totalValue: number;
  type: string;
  status: 'Ativa' | 'Vencida' | 'Convertida';
  generator: string;
  validity: string;
  tipo_venda?: 'normal' | 'consumo';
  items?: PrescriptionItem[];
}

const buildItems = (items: { produtoId: string; quantidade: number }[]) =>
  items.map((item) => {
    const produto = getProdutoById(item.produtoId)!;
    return {
      productId: produto.id,
      productName: produto.nome,
      quantity: item.quantidade,
      unitPrice: produto.valor,
      total: produto.valor * item.quantidade
    };
  });

export const MOCK_PRESCRICOES: Prescription[] = BASE_PRESCRICOES.map((presc, index) => {
  const paciente = getPacienteById(presc.pacienteId)!;
  const profissional = getProfissionalById(presc.profissionalId)!;
  const items = buildItems(presc.itens);
  const totalValue = items.reduce((acc, item) => acc + item.total, 0);

  return {
    id: presc.id,
    number: `PRESC-00${index + 1}`,
    patientName: paciente.nome,
    specialistName: profissional.nome,
    createdAt: '21/02/2026',
    totalValue,
    type: 'Suplementação',
    status: index === 1 ? 'Convertida' : 'Ativa',
    generator: index % 2 === 0 ? 'Automatica' : 'Manual',
    validity: '30 dias',
    items
  };
});

export const MOCK_PRODUTOS = BASE_PRODUTOS_LIST;
