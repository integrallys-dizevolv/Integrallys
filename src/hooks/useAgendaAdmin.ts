import { useEffect, useState } from 'react'
import { getAdminAgendaData } from '@/services/agendaAdmin.service'
import { MOCK_AGENDA_ITEMS, MOCK_AGENDA_PERSONAL } from '@/mocks/admin/agenda'
import type { AgendaItem, AgendaPersonalItem } from '@/types/agenda'

export function useAgendaAdmin() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(MOCK_AGENDA_ITEMS)
  const [agendaPersonal, setAgendaPersonal] = useState<AgendaPersonalItem[]>(MOCK_AGENDA_PERSONAL)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadAgenda = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getAdminAgendaData()
        if (!isMounted) return
        setAgendaItems(data.agendaItems)
        setAgendaPersonal(data.agendaPersonal)
      } catch {
        if (!isMounted) return
        setError('Erro ao carregar agenda do Admin')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAgenda()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    agendaItems,
    agendaPersonal,
    loading,
    error,
  }
}
