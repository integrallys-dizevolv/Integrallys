import {
  MOCK_RELATORIOS_ESPECIALISTA_AGENDAMENTOS,
  MOCK_RELATORIOS_ESPECIALISTA_AVALIACOES,
  MOCK_RELATORIOS_ESPECIALISTA_REPASSES,
  type EspecialistaAgendamentoRelatorio,
} from '@/mocks/relatorios.mock';

type TipoAgendamento = EspecialistaAgendamentoRelatorio['tipo'];

const TIPO_LABEL: Record<TipoAgendamento, string> = {
  rotina: 'Consulta de Rotina',
  retorno: 'Consulta de Retorno',
  primeira_consulta: 'Primeira Consulta',
  urgencia: 'Consulta de Urgencia',
};

const TIPO_COLOR: Record<TipoAgendamento, string> = {
  rotina: '#008cff',
  retorno: '#00d0a5',
  primeira_consulta: '#ffb928',
  urgencia: '#ff7a45',
};

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export type RelatorioPeriodo = '7d' | '30d' | '90d' | '12m' | 'all';

const getCutoffDate = (periodo: RelatorioPeriodo) => {
  if (periodo === 'all') return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cutoff = new Date(today);
  if (periodo === '7d') cutoff.setDate(cutoff.getDate() - 7);
  if (periodo === '30d') cutoff.setDate(cutoff.getDate() - 30);
  if (periodo === '90d') cutoff.setDate(cutoff.getDate() - 90);
  if (periodo === '12m') cutoff.setMonth(cutoff.getMonth() - 12);

  return cutoff;
};

const isInPeriodo = (dateIso: string, periodo: RelatorioPeriodo) => {
  const cutoff = getCutoffDate(periodo);
  if (!cutoff) return true;
  const current = new Date(`${dateIso}T00:00:00`);
  return current >= cutoff;
};

export interface EspecialistaDesempenhoData {
  resumo: {
    consultasRealizadas: number;
    pacientesAtivos: number;
    consultasUrgencia: number;
    mediaMensal: number;
    taxaOcupacao: number;
    taxaRetorno: number;
    satisfacao: number;
    satisfacaoPercentual: number;
  };
  consultasPorMes: Array<{ name: string; consultas: number; pacientes: number }>;
  distribuicaoProcedimentos: Array<{ name: string; value: number; color: string }>;
}

export async function getRelatoriosEspecialistaDesempenho(periodo: RelatorioPeriodo = 'all'): Promise<EspecialistaDesempenhoData> {
  const agendamentos = MOCK_RELATORIOS_ESPECIALISTA_AGENDAMENTOS.filter((item) => isInPeriodo(item.data, periodo));
  const avaliacoes = MOCK_RELATORIOS_ESPECIALISTA_AVALIACOES.filter((item) => isInPeriodo(item.data, periodo));

  const monthly = new Map<string, { consultas: number; pacientes: Set<string> }>();

  agendamentos.forEach((item) => {
    const [year, month] = item.data.split('-');
    if (!year || !month) return;
    const key = `${year}-${month}`;
    const current = monthly.get(key) ?? { consultas: 0, pacientes: new Set<string>() };
    current.consultas += 1;
    current.pacientes.add(item.pacienteId);
    monthly.set(key, current);
  });

  const consultasPorMes = Array.from(monthly.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([yearMonth, values]) => {
      const monthIndex = Number(yearMonth.split('-')[1]) - 1;
      return {
        name: MONTH_NAMES[monthIndex] ?? yearMonth,
        consultas: values.consultas,
        pacientes: values.pacientes.size,
      };
    });

  const totalConsultas = agendamentos.length;
  const uniquePatients = new Set(agendamentos.map((item) => item.pacienteId)).size;
  const mediaMensal = consultasPorMes.length > 0 ? Math.round(totalConsultas / consultasPorMes.length) : 0;
  const satisfacao =
    avaliacoes.length > 0
      ? Number((avaliacoes.reduce((acc, item) => acc + item.nota, 0) / avaliacoes.length).toFixed(1))
      : 0;

  const retornos = agendamentos.filter((item) => item.tipo === 'retorno').length;
  const consultasUrgencia = agendamentos.filter((item) => item.tipo === 'urgencia').length;
  const taxaRetorno = totalConsultas > 0 ? Math.round((retornos / totalConsultas) * 100) : 0;
  const satisfacaoPercentual = Number(((satisfacao / 5) * 100).toFixed(1));

  const distribuicaoMap = agendamentos.reduce<Record<TipoAgendamento, number>>(
    (acc, item) => {
      acc[item.tipo] += 1;
      return acc;
    },
    {
      rotina: 0,
      retorno: 0,
      primeira_consulta: 0,
      urgencia: 0,
    },
  );

  const distribuicaoProcedimentos = (Object.keys(distribuicaoMap) as TipoAgendamento[])
    .map((tipo) => ({
      name: TIPO_LABEL[tipo],
      value: totalConsultas > 0 ? Math.round((distribuicaoMap[tipo] / totalConsultas) * 100) : 0,
      color: TIPO_COLOR[tipo],
    }))
    .filter((item) => item.value > 0);

  return Promise.resolve({
    resumo: {
      consultasRealizadas: totalConsultas,
      pacientesAtivos: uniquePatients,
      consultasUrgencia,
      mediaMensal,
      taxaOcupacao: totalConsultas > 0 ? Math.min(100, Math.round((totalConsultas / 40) * 100)) : 0,
      taxaRetorno,
      satisfacao,
      satisfacaoPercentual,
    },
    consultasPorMes,
    distribuicaoProcedimentos,
  });
}

export async function getRelatoriosEspecialistaRepasses() {
  return Promise.resolve(MOCK_RELATORIOS_ESPECIALISTA_REPASSES);
}
