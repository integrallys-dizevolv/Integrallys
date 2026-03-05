import { UsuariosView } from '@/pages/admin/pages/usuarios/UsuariosView'
import { useUsuariosAdmin } from '@/hooks/useUsuariosAdmin'

type UsuariosAdminProps = Pick<
  React.ComponentProps<typeof UsuariosView>,
  'onPageChange'
>

export function UsuariosAdmin({ onPageChange }: UsuariosAdminProps) {
  const { usuarios, loading, error, upsertUsuario, removeUsuario } = useUsuariosAdmin()

  return (
    <UsuariosView
      onPageChange={onPageChange}
      users={usuarios}
      loading={loading}
      error={error}
      onSaveUser={upsertUsuario}
      onDeleteUser={removeUsuario}
    />
  )
}
