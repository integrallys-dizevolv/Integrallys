import type { Patient } from '@/pages/recepcao/context/types';
import { MOCK_PACIENTES as LEGACY_MOCK_PACIENTES } from '@/mocks/recepcionista/pacientes';

export const PACIENTES_STORAGE_KEY = 'recepcao_pacientes_mock_db';

export const MANUAL_SERVICOS_TEXTO_PADRAO = `1. DO AGENDAMENTO: As consultas devem ser agendadas previamente.
2. DO CANCELAMENTO: Cancelamentos devem ser informados com antecedencia minima de 24 horas.
3. DOS PAGAMENTOS: Os pagamentos devem respeitar as datas e condicoes acordadas.
4. DA EMISSAO DE NOTA FISCAL: As notas fiscais sao emitidas com os dados cadastrados.
Declaro estar ciente das normas deste manual de servicos.`;

export const MOCK_PACIENTES: Patient[] = LEGACY_MOCK_PACIENTES.map((paciente, index) => ({
  ...paciente,
  activeStatus:
    paciente.activeStatus || (index % 7 === 0 ? 'Óbito' : index % 4 === 0 ? 'Inativo' : 'Ativo'),
}));
