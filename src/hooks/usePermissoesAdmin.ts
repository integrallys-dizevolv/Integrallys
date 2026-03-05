import { useEffect, useState } from 'react'
import { MOCK_PERFIS } from '@/mocks/gestor/perfis'
import { getPerfisAdmin } from '@/services/permissoesAdmin.service'
import type { PerfilPermissao } from '@/types/permissoes'

export function usePermissoesAdmin() {
  const [perfis, setPerfis] = useState<PerfilPermissao[]>(MOCK_PERFIS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPerfis = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getPerfisAdmin()
        if (!isMounted) return
        setPerfis(data)
      } catch {
        if (!isMounted) return
        setError('Erro ao carregar perfis de permissões do Admin')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPerfis()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    perfis,
    loading,
    error,
  }
}
