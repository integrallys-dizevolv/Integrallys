import {
  MOCK_ACCOUNTS,
  MOCK_DAILY_MOVEMENTS,
  MOCK_DRE_ITEMS,
  MOCK_TRANSACTIONS,
} from '@/mocks/admin/financeiro'
import type { FinanceiroAdminData } from '@/types/financeiro'

export async function getFinanceiroAdminData(): Promise<FinanceiroAdminData> {
  // TODO: Supabase
  // const { data, error } = await supabase
  //   .from('financeiro')
  //   .select('*')
  // if (error) throw error
  // return parseFinanceiroData(data)

  return {
    transactions: MOCK_TRANSACTIONS,
    accounts: MOCK_ACCOUNTS,
    dailyMovements: MOCK_DAILY_MOVEMENTS,
    dreItems: MOCK_DRE_ITEMS,
  }
}
