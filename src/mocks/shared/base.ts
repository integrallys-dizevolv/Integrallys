export const BASE_UNIDADES = {
  central: {
    id: 'central',
    nome: 'Clínica Central'
  },
  norte: {
    id: 'norte',
    nome: 'Unidade Norte'
  },
  sul: {
    id: 'sul',
    nome: 'Unidade Sul'
  },
  sede: {
    id: 'sede',
    nome: 'Sede Principal'
  }
}

export const BASE_PROFISSIONAIS = {
  joao: {
    id: 'joao',
    nome: 'Dr. Joao Santos',
    especialidade: 'Clínico',
    comissaoProdutos: 10,
    comissaoAtendimentos: 15,
    repasseAtendimentos: 55
  },
  ana: {
    id: 'ana',
    nome: 'Dra. Ana Lima',
    especialidade: 'Dermatologia',
    comissaoProdutos: 10,
    comissaoAtendimentos: 12,
    repasseAtendimentos: 50
  },
  flavia: {
    id: 'flavia',
    nome: 'Dra. Flavia Alves',
    especialidade: 'Clínica Geral',
    comissaoProdutos: 8,
    comissaoAtendimentos: 12,
    repasseAtendimentos: 50
  },
  adelmo: {
    id: 'adelmo',
    nome: 'Dr. Adelmo',
    especialidade: 'Cirurgia',
    comissaoProdutos: 8,
    comissaoAtendimentos: 15,
    repasseAtendimentos: 60
  },
  diego: {
    id: 'diego',
    nome: 'Dr. Diego',
    especialidade: 'Ortopedia',
    comissaoProdutos: 8,
    comissaoAtendimentos: 15,
    repasseAtendimentos: 55
  },
  sofia: {
    id: 'sofia',
    nome: 'Dra. Sofia Castro',
    especialidade: 'Cardiologia',
    comissaoProdutos: 8,
    comissaoAtendimentos: 12,
    repasseAtendimentos: 50
  }
}

export const BASE_PACIENTES = {
  maria: {
    id: 'p1',
    nome: 'Maria Silva',
    cpf: '123.456.789-00',
    birthDate: '1985-03-15',
    phone: '(11) 99999-9999',
    email: 'maria.silva@email.com',
    endereco: 'Av. Paulista, 1578 - Bela Vista, São Paulo/SP'
  },
  pedro: {
    id: 'p2',
    nome: 'Pedro Costa',
    cpf: '234.567.890-11',
    birthDate: '1992-03-20',
    phone: '(11) 98888-8888',
    email: 'pedro.costa@email.com',
    endereco: 'Rua Augusta, 101 - Consolação, São Paulo/SP'
  },
  ana: {
    id: 'p3',
    nome: 'Ana Paula Santos',
    cpf: '345.678.901-22',
    birthDate: '1990-08-10',
    phone: '(11) 97777-7777',
    email: 'ana.santos@email.com',
    endereco: 'Rua dos Pinheiros, 45 - Pinheiros, São Paulo/SP'
  },
  julia: {
    id: 'p4',
    nome: 'Julia Martins',
    cpf: '456.789.012-33',
    birthDate: '1988-11-05',
    phone: '(11) 96666-6666',
    email: 'julia.martins@email.com',
    endereco: 'Av. Brigadeiro, 800 - Jardins, São Paulo/SP'
  },
  roberto: {
    id: 'p5',
    nome: 'Roberto Almeida',
    cpf: '567.890.123-44',
    birthDate: '1982-12-15',
    phone: '(11) 95555-5555',
    email: 'roberto.almeida@email.com',
    endereco: 'Rua Oscar Freire, 220 - Jardins, São Paulo/SP'
  },
  carlos: {
    id: 'p6',
    nome: 'Carlos Mendes',
    cpf: '678.901.234-55',
    birthDate: '1979-06-20',
    phone: '(11) 94444-4444',
    email: 'carlos.mendes@email.com',
    endereco: 'Av. Rebouças, 320 - Pinheiros, São Paulo/SP'
  },
  carolina: {
    id: 'p7',
    nome: 'Carolina Braga',
    cpf: '789.012.345-66',
    birthDate: '1994-04-12',
    phone: '(11) 93333-3333',
    email: 'carolina.braga@email.com',
    endereco: 'Rua Pamplona, 510 - Jardins, São Paulo/SP'
  },
  fernanda: {
    id: 'p8',
    nome: 'Fernanda Oliveira',
    cpf: '890.123.456-77',
    birthDate: '1991-02-10',
    phone: '(11) 92222-2222',
    email: 'fernanda.oliveira@email.com',
    endereco: 'Rua Fidalga, 90 - Vila Madalena, São Paulo/SP'
  },
  paulo: {
    id: 'p9',
    nome: 'Paulo Henrique',
    cpf: '901.234.567-88',
    birthDate: '1975-09-22',
    phone: '(11) 91111-1111',
    email: 'paulo.henrique@email.com',
    endereco: 'Av. Paulista, 2500 - Bela Vista, São Paulo/SP'
  }
}

export const BASE_PRODUTOS = {
  omega: {
    id: 'prod1',
    nome: 'Omega 3 Premium',
    valor: 85.0
  },
  colageno: {
    id: 'prod2',
    nome: 'Colageno Hidrolisado',
    valor: 95.0
  },
  probiotico: {
    id: 'prod3',
    nome: 'Probiotico Advanced',
    valor: 120.0
  }
}

export const BASE_PROCEDIMENTOS = {
  consulta: {
    id: 'proc1',
    nome: 'Consulta',
    valor: 250.0,
    duracao: '30min'
  },
  retorno: {
    id: 'proc2',
    nome: 'Retorno',
    valor: 180.0,
    duracao: '45min'
  },
  exame: {
    id: 'proc3',
    nome: 'Exame',
    valor: 120.0,
    duracao: '30min'
  },
  consultaEspecial: {
    id: 'proc4',
    nome: 'Consulta Especial',
    valor: 300.0,
    duracao: '75min'
  }
}

export const BASE_AGENDAMENTOS = [
  {
    id: 1,
    data: '2026-03-02',
    hora: '09:00',
    pacienteId: BASE_PACIENTES.ana.id,
    profissionalId: BASE_PROFISSIONAIS.joao.id,
    procedimentoId: BASE_PROCEDIMENTOS.exame.id,
    tipo: 'Exame',
    status: 'Check-in',
    pagamento: 'Pago',
    unidadeId: BASE_UNIDADES.central.id
  },
  {
    id: 2,
    data: '2026-03-02',
    hora: '10:00',
    pacienteId: BASE_PACIENTES.julia.id,
    profissionalId: BASE_PROFISSIONAIS.flavia.id,
    procedimentoId: BASE_PROCEDIMENTOS.consulta.id,
    tipo: 'Consulta',
    status: 'Confirmado',
    pagamento: 'Pago Parcial',
    unidadeId: BASE_UNIDADES.norte.id
  },
  {
    id: 3,
    data: '2026-03-03',
    hora: '11:00',
    pacienteId: BASE_PACIENTES.paulo.id,
    profissionalId: BASE_PROFISSIONAIS.adelmo.id,
    procedimentoId: BASE_PROCEDIMENTOS.consulta.id,
    tipo: 'Consulta Inicial',
    status: 'Confirmado',
    pagamento: 'Pago',
    unidadeId: BASE_UNIDADES.central.id
  },
  {
    id: 4,
    data: '2026-03-04',
    hora: '16:00',
    pacienteId: BASE_PACIENTES.carolina.id,
    profissionalId: BASE_PROFISSIONAIS.diego.id,
    procedimentoId: BASE_PROCEDIMENTOS.consultaEspecial.id,
    tipo: 'Consulta Especial',
    status: 'Confirmado',
    pagamento: 'Pago',
    unidadeId: BASE_UNIDADES.norte.id
  },
  {
    id: 5,
    data: '2026-03-05',
    hora: '08:00',
    pacienteId: BASE_PACIENTES.maria.id,
    profissionalId: BASE_PROFISSIONAIS.joao.id,
    procedimentoId: BASE_PROCEDIMENTOS.consulta.id,
    tipo: 'Consulta',
    status: 'Confirmado',
    pagamento: 'Pago',
    unidadeId: BASE_UNIDADES.central.id
  },
  {
    id: 6,
    data: '2026-03-05',
    hora: '08:30',
    pacienteId: BASE_PACIENTES.pedro.id,
    profissionalId: BASE_PROFISSIONAIS.ana.id,
    procedimentoId: BASE_PROCEDIMENTOS.retorno.id,
    tipo: 'Retorno',
    status: 'Check-in',
    pagamento: 'Pendente',
    unidadeId: BASE_UNIDADES.central.id
  },
  {
    id: 7,
    data: '2026-03-05',
    hora: '14:00',
    pacienteId: BASE_PACIENTES.roberto.id,
    profissionalId: BASE_PROFISSIONAIS.joao.id,
    procedimentoId: BASE_PROCEDIMENTOS.consulta.id,
    tipo: 'Consulta',
    status: 'Confirmado',
    pagamento: 'Pago',
    unidadeId: BASE_UNIDADES.central.id
  },
  {
    id: 8,
    data: '2026-03-06',
    hora: '15:00',
    pacienteId: BASE_PACIENTES.carlos.id,
    profissionalId: BASE_PROFISSIONAIS.sofia.id,
    procedimentoId: BASE_PROCEDIMENTOS.retorno.id,
    tipo: 'Retorno',
    status: 'Confirmado',
    pagamento: 'Pago',
    unidadeId: BASE_UNIDADES.central.id
  }
]

export const BASE_PRESCRICOES = [
  {
    id: 'presc1',
    data: '2026-03-05',
    pacienteId: BASE_PACIENTES.maria.id,
    profissionalId: BASE_PROFISSIONAIS.joao.id,
    itens: [
      { produtoId: BASE_PRODUTOS.omega.id, quantidade: 2 },
      { produtoId: BASE_PRODUTOS.colageno.id, quantidade: 1 }
    ]
  },
  {
    id: 'presc2',
    data: '2026-03-04',
    pacienteId: BASE_PACIENTES.pedro.id,
    profissionalId: BASE_PROFISSIONAIS.ana.id,
    itens: [
      { produtoId: BASE_PRODUTOS.probiotico.id, quantidade: 1 }
    ]
  }
]

export const BASE_REPASSES = [
  {
    id: 'rep1',
    data: '2026-03-05',
    atendimentoId: 5,
    percentual: BASE_PROFISSIONAIS.joao.repasseAtendimentos
  },
  {
    id: 'rep2',
    data: '2026-03-04',
    atendimentoId: 3,
    percentual: BASE_PROFISSIONAIS.adelmo.repasseAtendimentos
  }
]

export const BASE_RECEBIMENTOS = [
  {
    id: 'rec1',
    data: '2026-03-05',
    atendimentoId: 5,
    valorBruto: BASE_PROCEDIMENTOS.consulta.valor,
    status: 'Pago',
    metodo: 'Cartão'
  },
  {
    id: 'rec2',
    data: '2026-03-02',
    atendimentoId: 2,
    valorBruto: BASE_PROCEDIMENTOS.consulta.valor,
    status: 'Pago Parcial',
    metodo: 'PIX'
  }
]

export const BASE_RETORNOS = [
  {
    id: 'ret1',
    pacienteId: BASE_PACIENTES.maria.id,
    profissionalId: BASE_PROFISSIONAIS.joao.id,
    dataPrevista: '2026-03-21',
    status: 'No prazo'
  },
  {
    id: 'ret2',
    pacienteId: BASE_PACIENTES.pedro.id,
    profissionalId: BASE_PROFISSIONAIS.ana.id,
    dataPrevista: '2026-03-10',
    status: 'Limite prazo'
  }
]

export const BASE_PACIENTES_LIST = Object.values(BASE_PACIENTES)
export const BASE_PROFISSIONAIS_LIST = Object.values(BASE_PROFISSIONAIS)
export const BASE_UNIDADES_LIST = Object.values(BASE_UNIDADES)
export const BASE_PROCEDIMENTOS_LIST = Object.values(BASE_PROCEDIMENTOS)
export const BASE_PRODUTOS_LIST = Object.values(BASE_PRODUTOS)

export const getPacienteById = (id: string) =>
  BASE_PACIENTES_LIST.find((item) => item.id === id)

export const getProfissionalById = (id: string) =>
  BASE_PROFISSIONAIS_LIST.find((item) => item.id === id)

export const getUnidadeById = (id: string) =>
  BASE_UNIDADES_LIST.find((item) => item.id === id)

export const getProcedimentoById = (id: string) =>
  BASE_PROCEDIMENTOS_LIST.find((item) => item.id === id)

export const getProdutoById = (id: string) =>
  BASE_PRODUTOS_LIST.find((item) => item.id === id)

export const formatDateBR = (isoDate: string) => {
  const [year, month, day] = isoDate.split('T')[0].split('-')
  return `${day}/${month}/${year}`
}

export const formatDateTimeBR = (isoDate: string, time?: string) => {
  const formatted = formatDateBR(isoDate)
  return time ? `${formatted} ${time}` : formatted
}

export const addDays = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

