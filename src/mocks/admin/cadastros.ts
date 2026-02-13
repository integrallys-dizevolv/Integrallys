// Mock data para módulo de cadastros configuráveis

// ===============================
// BANCOS
// ===============================
export interface Banco {
  id: number;
  nome: string;
  codigo: string;
  agencia?: string;
  conta?: string;
  tipo: "Corrente" | "Poupança";
  status: "Ativo" | "Inativo";
}

export const MOCK_BANCOS: Banco[] = [
  {
    id: 1,
    nome: "Banco do Brasil",
    codigo: "001",
    agencia: "1234-5",
    conta: "12345-6",
    tipo: "Corrente",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Itaú Unibanco",
    codigo: "341",
    agencia: "0987",
    conta: "98765-4",
    tipo: "Corrente",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Bradesco",
    codigo: "237",
    agencia: "5678",
    conta: "54321-0",
    tipo: "Poupança",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Caixa Econômica",
    codigo: "104",
    agencia: "1111",
    conta: "11111-1",
    tipo: "Corrente",
    status: "Inativo",
  },
];

// ===============================
// FORMAS DE PAGAMENTO
// ===============================
export interface FormaPagamento {
  id: number;
  nome: string;
  tipo:
    | "Dinheiro"
    | "Cartão Crédito"
    | "Cartão Débito"
    | "PIX"
    | "Boleto"
    | "Transferência"
    | "Cheque";
  taxaPercentual?: number;
  diasRecebimento?: number;
  status: "Ativo" | "Inativo";
}

export const MOCK_FORMAS_PAGAMENTO: FormaPagamento[] = [
  {
    id: 1,
    nome: "Dinheiro",
    tipo: "Dinheiro",
    taxaPercentual: 0,
    diasRecebimento: 0,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "PIX",
    tipo: "PIX",
    taxaPercentual: 0,
    diasRecebimento: 0,
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Cartão de Crédito",
    tipo: "Cartão Crédito",
    taxaPercentual: 2.5,
    diasRecebimento: 30,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Cartão de Débito",
    tipo: "Cartão Débito",
    taxaPercentual: 1.5,
    diasRecebimento: 1,
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Boleto Bancário",
    tipo: "Boleto",
    taxaPercentual: 0,
    diasRecebimento: 3,
    status: "Ativo",
  },
  {
    id: 6,
    nome: "Transferência Bancária",
    tipo: "Transferência",
    taxaPercentual: 0,
    diasRecebimento: 1,
    status: "Inativo",
  },
];

// ===============================
// FORMAS DE RECEBIMENTO
// ===============================
export interface FormaRecebimento {
  id: number;
  nome: string;
  descricao?: string;
  contaDestino?: string;
  status: "Ativo" | "Inativo";
}

export const MOCK_FORMAS_RECEBIMENTO: FormaRecebimento[] = [
  {
    id: 1,
    nome: "Caixa Físico",
    descricao: "Recebimento direto no caixa",
    contaDestino: "Caixa Central",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Conta Bancária Principal",
    descricao: "Depósito em conta",
    contaDestino: "Itaú - 0987/98765-4",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "PIX Clínica",
    descricao: "Chave PIX da clínica",
    contaDestino: "clinica@pix.com",
    status: "Ativo",
  },
];

// ===============================
// CATEGORIAS DRE
// ===============================
export interface CategoriaDRE {
  id: number;
  nome: string;
  tipo: "Receita" | "Despesa";
  grupo: string;
  ordem: number;
  status: "Ativo" | "Inativo";
}

export const MOCK_CATEGORIAS_DRE: CategoriaDRE[] = [
  {
    id: 1,
    nome: "Consultas",
    tipo: "Receita",
    grupo: "Receita Bruta",
    ordem: 1,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Procedimentos",
    tipo: "Receita",
    grupo: "Receita Bruta",
    ordem: 2,
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Produtos",
    tipo: "Receita",
    grupo: "Receita Bruta",
    ordem: 3,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Devoluções",
    tipo: "Despesa",
    grupo: "Deduções",
    ordem: 4,
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Salários",
    tipo: "Despesa",
    grupo: "Despesas Operacionais",
    ordem: 5,
    status: "Ativo",
  },
  {
    id: 6,
    nome: "Aluguel",
    tipo: "Despesa",
    grupo: "Despesas Operacionais",
    ordem: 6,
    status: "Ativo",
  },
  {
    id: 7,
    nome: "Materiais",
    tipo: "Despesa",
    grupo: "Custo dos Serviços",
    ordem: 7,
    status: "Ativo",
  },
  {
    id: 8,
    nome: "Marketing",
    tipo: "Despesa",
    grupo: "Despesas Administrativas",
    ordem: 8,
    status: "Inativo",
  },
];

// ===============================
// PROCEDIMENTOS
// ===============================
export interface Procedimento {
  id: number;
  nome: string;
  codigo?: string;
  categoria: string;
  duracao: number; // em minutos
  valor: number;
  baixaAutomaticaSuprimentos: boolean;
  suprimentosVinculados?: string[];
  status: "Ativo" | "Inativo";
}

export const MOCK_PROCEDIMENTOS: Procedimento[] = [
  {
    id: 1,
    nome: "Consulta Inicial",
    codigo: "CONS01",
    categoria: "Consultas",
    duracao: 60,
    valor: 250.0,
    baixaAutomaticaSuprimentos: true,
    suprimentosVinculados: ["Luva descartável", "Álcool 70%"],
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Retorno",
    codigo: "CONS02",
    categoria: "Consultas",
    duracao: 30,
    valor: 150.0,
    baixaAutomaticaSuprimentos: false,
    suprimentosVinculados: [],
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Avaliação Nutricional",
    codigo: "NUT01",
    categoria: "Avaliações",
    duracao: 45,
    valor: 180.0,
    baixaAutomaticaSuprimentos: false,
    suprimentosVinculados: [],
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Sessão de Fisioterapia",
    codigo: "FIS01",
    categoria: "Fisioterapia",
    duracao: 50,
    valor: 120.0,
    baixaAutomaticaSuprimentos: true,
    suprimentosVinculados: ["Gel condutor", "Lençol descartável"],
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Acupuntura",
    codigo: "ACU01",
    categoria: "Terapias",
    duracao: 40,
    valor: 100.0,
    baixaAutomaticaSuprimentos: true,
    suprimentosVinculados: ["Agulha descartável", "Algodão"],
    status: "Ativo",
  },
  {
    id: 6,
    nome: "Massagem Terapêutica",
    codigo: "MAS01",
    categoria: "Terapias",
    duracao: 60,
    valor: 150.0,
    baixaAutomaticaSuprimentos: false,
    suprimentosVinculados: [],
    status: "Inativo",
  },
];

// ===============================
// PROFISSIONAIS
// ===============================
export interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
  registro: string; // CRM, CRO, etc.
  email?: string;
  telefone?: string;
  comissao?: number; // percentual
  status: "Ativo" | "Inativo";
}

export const MOCK_PROFISSIONAIS: Profissional[] = [
  {
    id: 1,
    nome: "Dr. Carlos Silva",
    especialidade: "Clínico Geral",
    registro: "CRM 12345",
    email: "carlos@clinica.com",
    telefone: "(11) 99999-1111",
    comissao: 50,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Dra. Ana Costa",
    especialidade: "Nutricionista",
    registro: "CRN 54321",
    email: "ana@clinica.com",
    telefone: "(11) 99999-2222",
    comissao: 45,
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Dr. Pedro Santos",
    especialidade: "Fisioterapeuta",
    registro: "CREFITO 98765",
    email: "pedro@clinica.com",
    telefone: "(11) 99999-3333",
    comissao: 40,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Dra. Maria Lima",
    especialidade: "Psicóloga",
    registro: "CRP 11111",
    email: "maria@clinica.com",
    telefone: "(11) 99999-4444",
    comissao: 50,
    status: "Inativo",
  },
];

// ===============================
// DOCUMENTOS
// ===============================
export interface TipoDocumento {
  id: number;
  nome: string;
  categoria: "Prontuário" | "Financeiro" | "Administrativo" | "Clínico";
  formato: "PDF" | "DOCX" | "HTML";
  obrigatorio: boolean;
  status: "Ativo" | "Inativo";
}

export const MOCK_TIPOS_DOCUMENTOS: TipoDocumento[] = [
  {
    id: 1,
    nome: "Termo de Consentimento",
    categoria: "Clínico",
    formato: "PDF",
    obrigatorio: true,
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Ficha de Anamnese",
    categoria: "Prontuário",
    formato: "PDF",
    obrigatorio: true,
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Atestado Médico",
    categoria: "Clínico",
    formato: "PDF",
    obrigatorio: false,
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Receituário",
    categoria: "Clínico",
    formato: "PDF",
    obrigatorio: false,
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Nota Fiscal",
    categoria: "Financeiro",
    formato: "PDF",
    obrigatorio: true,
    status: "Ativo",
  },
  {
    id: 6,
    nome: "Contrato de Serviço",
    categoria: "Administrativo",
    formato: "DOCX",
    obrigatorio: false,
    status: "Inativo",
  },
];
