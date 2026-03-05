import { Bell } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import type { Notification } from '../../pages/admin/components/types'

interface NotificationsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications: Notification[]
}

export function NotificationsSheet({ open, onOpenChange, notifications }: NotificationsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 flex flex-col">
        <SheetHeader className="shrink-0">
          <SheetTitle>Notificações</SheetTitle>
          <SheetDescription>
            Acompanhe as atualizações e eventos importantes do sistema.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto mt-6 px-4 space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`
                  p-4
                  rounded-lg
                  border
                  ${notif.read
                    ? 'bg-white dark:bg-[#0c1e3d] border-gray-200 dark:border-[#364153]'
                    : 'bg-[#0039A6]/5 dark:bg-[#0039A6]/20 border-[#0039A6]/20 dark:border-[#0039A6]/30'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#101828] dark:text-white">{notif.title}</p>
                    <p className="text-xs text-[#6a7282] dark:text-gray-400 mt-1">{notif.description}</p>
                    <p className="text-xs text-[#6a7282] dark:text-gray-400 mt-2">{notif.date}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-[#0039A6] rounded-full mt-1"></div>
                  )}
                </div>
                {!notif.read && (
                  <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                    Marcar como lida
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-[#6a7282] dark:text-gray-500 mb-3" />
              <p className="text-sm text-[#6a7282] dark:text-gray-400">Nenhuma notificação no momento</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
