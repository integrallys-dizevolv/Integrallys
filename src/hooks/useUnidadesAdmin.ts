import { useEffect, useState } from 'react'
import type { Unit } from '@/pages/admin/components/types'
import { getUnidadesAdmin } from '@/services/unidadesAdmin.service'
import { mockUnits } from '@/mocks/admin/unidades'

export function useUnidadesAdmin() {
  const [unidades, setUnidades] = useState<Unit[]>(mockUnits)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadUnidades = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getUnidadesAdmin()
        if (!isMounted) return
        setUnidades(data)
      } catch {
        if (!isMounted) return
        setError('Erro ao carregar unidades do Admin')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUnidades()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    unidades,
    loading,
    error,
  }
}
