import { mockUnits } from '@/mocks/admin/unidades'
import type { Unit } from '@/pages/admin/components/types'

export async function getUnidadesAdmin(): Promise<Unit[]> {
  // TODO: Supabase
  // const { data, error } = await supabase
  //   .from('unidades')
  //   .select('*')
  // if (error) throw error
  // return data

  return mockUnits
}
