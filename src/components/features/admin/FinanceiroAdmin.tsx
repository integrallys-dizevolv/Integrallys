import { FinanceiroView } from '@/pages/admin/pages/financeiro/FinanceiroView'
import { useFinanceiroAdmin } from '@/hooks/useFinanceiroAdmin'

type FinanceiroAdminProps = Pick<
  React.ComponentProps<typeof FinanceiroView>,
  'setCurrentPage'
>

export function FinanceiroAdmin({ setCurrentPage }: FinanceiroAdminProps) {
  const { transactions, accounts, dailyMovements, dreItems, loading, error } = useFinanceiroAdmin()

  return (
    <FinanceiroView
      setCurrentPage={setCurrentPage}
      transactions={transactions}
      accounts={accounts}
      dailyMovements={dailyMovements}
      dreItems={dreItems}
      loading={loading}
      error={error}
    />
  )
}
