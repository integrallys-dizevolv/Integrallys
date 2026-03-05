import { BASE_RETORNOS, getPacienteById, getProfissionalById } from '@/mocks/shared/base'

export interface RelatorioRetornoItem {
  id: number;
  data: string;
  cliente: string;
  procedimentosRecentes: [string, string, string];
  profissional: string;
  especialidade: string;
  proximoRetorno: string;
}

export const MOCK_RELATORIO_RETORNOS: RelatorioRetornoItem[] = BASE_RETORNOS.map((item, index) => {
  const paciente = getPacienteById(item.pacienteId)!
  const profissional = getProfissionalById(item.profissionalId)!
  return {
    id: index + 1,
    data: '2026-02-10',
    cliente: paciente.nome,
    procedimentosRecentes: ['Consulta', 'Acompanhamento', 'Retorno'],
    profissional: profissional.nome,
    especialidade: profissional.especialidade,
    proximoRetorno: item.dataPrevista
  }
})
