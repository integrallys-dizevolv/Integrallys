import { PermissoesView } from '@/pages/admin/pages/permissoes/PermissoesView'
import { usePermissoesAdmin } from '@/hooks/usePermissoesAdmin'

type PermissoesAdminProps = React.ComponentProps<typeof PermissoesView>

export function PermissoesAdmin({ onPageChange, view = 'lista' }: PermissoesAdminProps) {
  const { perfis, loading, error } = usePermissoesAdmin()

  return (
    <PermissoesView
      onPageChange={onPageChange}
      view={view}
      profiles={perfis}
      loading={loading}
      error={error}
    />
  )
}
