import {
  MOCK_PRESCRICOES as RECEPCAO_PRESCRICOES,
  MOCK_PRODUTOS,
  type Prescription,
} from '@/mocks/recepcionista/prescricoes';

export interface PrescricaoMockPaciente {
  id: string;
  name: string;
  cpf: string;
}

export interface PrescricaoMockProduto {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
}

export interface PrescricaoMockUsuario {
  id: string;
  name: string;
  role: string;
}

export const MOCK_PRESCRICOES: Prescription[] = RECEPCAO_PRESCRICOES;

export const MOCK_PRESCRICOES_PACIENTES: PrescricaoMockPaciente[] = [
  { id: '1', name: 'Maria Silva', cpf: '123.456.789-00' },
  { id: '2', name: 'Pedro Costa', cpf: '234.567.890-11' },
  { id: '3', name: 'Laura Oliveira', cpf: '345.678.901-22' },
  { id: '4', name: 'Carlos Mendes', cpf: '456.789.012-33' },
];

export const MOCK_PRESCRICOES_USUARIOS: PrescricaoMockUsuario[] = [
  { id: 'prof1', name: 'Dr. João Santos', role: 'Especialista' },
  { id: 'prof2', name: 'Dra. Beatriz Silva', role: 'Especialista' },
  { id: 'prof3', name: 'Ana Recepcionista', role: 'Recepção' },
  { id: 'prof4', name: 'Carlos Atendente', role: 'Colaborador' },
];

export const MOCK_PRESCRICOES_PRODUTOS: PrescricaoMockProduto[] = MOCK_PRODUTOS.map((item) => ({
  id: item.id,
  name: item.nome,
  price: item.valor,
  costPrice: Number((item.valor * 0.58).toFixed(2)),
  stock: 50,
}));
