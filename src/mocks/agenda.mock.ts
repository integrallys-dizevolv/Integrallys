import {
  mockAgendaItems as recepcaoAgendaItems,
  mockAgendaPersonal as recepcaoAgendaPersonal,
} from '@/mocks/recepcionista/agenda';
import {
  MOCK_APPOINTMENTS as especialistaAppointments,
  type Appointment,
} from '@/mocks/especialista/agenda';

export const MOCK_RECEPCAO_AGENDA_ITEMS = recepcaoAgendaItems;
export const MOCK_RECEPCAO_AGENDA_PERSONAL = recepcaoAgendaPersonal;

export const MOCK_AGENDA_TIPADA = [
  ...recepcaoAgendaItems.map((item) => ({
    id: item.id,
    referencia: item,
    tipo: 'profissional' as const,
  })),
  ...recepcaoAgendaPersonal.map((item) => ({
    id: item.id,
    referencia: item,
    tipo: 'pessoal' as const,
  })),
];

export const MOCK_ESPECIALISTA_APPOINTMENTS = especialistaAppointments;
export type { Appointment as EspecialistaAppointment };
