import { MOCK_PERFIS } from '@/mocks/gestor/perfis'
import type { PerfilPermissao } from '@/types/permissoes'

export async function getPerfisAdmin(): Promise<PerfilPermissao[]> {
  // TODO: Supabase
  // const { data, error } = await supabase
  //   .from('perfis')
  //   .select('*')
  // if (error) throw error
  // return data

  return MOCK_PERFIS
}
