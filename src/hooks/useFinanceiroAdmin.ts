import { useEffect, useState } from 'react'
import {
  MOCK_ACCOUNTS,
  MOCK_DAILY_MOVEMENTS,
  MOCK_DRE_ITEMS,
  MOCK_TRANSACTIONS,
} from '@/mocks/admin/financeiro'
import { getFinanceiroAdminData } from '@/services/financeiroAdmin.service'
import type {
  DreItem,
  FinanceiroAccount,
  FinanceiroDailyMovement,
  FinanceiroTransaction,
} from '@/types/financeiro'

export function useFinanceiroAdmin() {
  const [transactions, setTransactions] = useState<FinanceiroTransaction[]>(MOCK_TRANSACTIONS)
  const [accounts, setAccounts] = useState<FinanceiroAccount[]>(MOCK_ACCOUNTS)
  const [dailyMovements, setDailyMovements] = useState<FinanceiroDailyMovement[]>(MOCK_DAILY_MOVEMENTS)
  const [dreItems, setDreItems] = useState<DreItem[]>(MOCK_DRE_ITEMS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadFinanceiro = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getFinanceiroAdminData()
        if (!isMounted) return
        setTransactions(data.transactions)
        setAccounts(data.accounts)
        setDailyMovements(data.dailyMovements)
        setDreItems(data.dreItems)
      } catch {
        if (!isMounted) return
        setError('Erro ao carregar dados financeiros do Admin')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadFinanceiro()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    transactions,
    accounts,
    dailyMovements,
    dreItems,
    loading,
    error,
  }
}
