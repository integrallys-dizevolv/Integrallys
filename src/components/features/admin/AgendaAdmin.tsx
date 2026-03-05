import { AgendaView } from '@/pages/admin/pages/agenda/AgendaView'
import { useAgendaAdmin } from '@/hooks/useAgendaAdmin'

type AgendaAdminProps = Omit<
  React.ComponentProps<typeof AgendaView>,
  'mockAgendaItems' | 'mockAgendaPersonal'
>

export function AgendaAdmin(props: AgendaAdminProps) {
  const { agendaItems, agendaPersonal } = useAgendaAdmin()

  return (
    <AgendaView
      {...props}
      mockAgendaItems={agendaItems}
      mockAgendaPersonal={agendaPersonal}
    />
  )
}
