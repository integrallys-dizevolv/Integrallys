import { UnidadesView } from '@/pages/admin/pages/unidades/UnidadesView'
import { useUnidadesAdmin } from '@/hooks/useUnidadesAdmin'

type UnidadesAdminProps = Pick<
  React.ComponentProps<typeof UnidadesView>,
  'onPageChange'
>

export function UnidadesAdmin({ onPageChange }: UnidadesAdminProps) {
  const { unidades, loading, error } = useUnidadesAdmin()

  return (
    <UnidadesView
      onPageChange={onPageChange}
      units={unidades}
      loading={loading}
      error={error}
    />
  )
}
