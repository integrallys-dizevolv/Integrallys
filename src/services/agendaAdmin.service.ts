import { MOCK_AGENDA_ITEMS, MOCK_AGENDA_PERSONAL } from '@/mocks/admin/agenda'
import type { AgendaAdminData } from '@/types/agenda'

export async function getAdminAgendaData(): Promise<AgendaAdminData> {
  // TODO: Supabase
  // const { data, error } = await supabase
  //   .from('agendamentos')
  //   .select('*')
  // if (error) throw error
  // return parseAgendaData(data)

  return {
    agendaItems: MOCK_AGENDA_ITEMS,
    agendaPersonal: MOCK_AGENDA_PERSONAL,
  }
}
