import React from 'react'
import {
  Home, Users, Shield, Building, Calendar,
  FileText, CreditCard, History, Settings, X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import integrallysLogo from '@/assets/images/Integrallys-Logo.png'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  type?: 'item' | 'category'  // New: support category headers
}

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isOpen: boolean
  onClose: () => void
  items?: SidebarItem[]
}

const defaultSidebarItems: SidebarItem[] = [
  // ===== OPERACIONAL =====
  { id: 'cat-operacional', label: 'Operacional', icon: Home, type: 'category' },
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'agenda', label: 'Agenda', icon: Calendar },

  // ===== GESTÃO =====
  { id: 'cat-gestao', label: 'Gestão', icon: Users, type: 'category' },
  { id: 'usuarios', label: 'Usuários', icon: Users },
  { id: 'permissoes', label: 'Permissões', icon: Shield },
  { id: 'unidades', label: 'Unidades', icon: Building },
  { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
  { id: 'repasse', label: 'Repasse', icon: History },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'auditoria', label: 'Log de Auditoria', icon: History },

  // ===== SISTEMA =====
  { id: 'cat-sistema', label: 'Sistema', icon: Settings, type: 'category' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar({ currentPage, onPageChange, isOpen, onClose, items }: SidebarProps) {
  const displayItems = items || defaultSidebarItems

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col h-screen transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0
        bg-white dark:bg-app-bg-dark
        border-r border-app-border dark:border-app-border-dark
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="h-16 px-6 border-b border-app-border dark:border-app-border-dark flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <img
              src={integrallysLogo}
              alt="Integrallys"
              className="h-8 w-auto"
            />
          </div>

          {/* Botão fechar apenas mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="relative flex items-center justify-center lg:hidden text-app-text-secondary dark:text-white/60 hover:bg-app-bg-secondary dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {displayItems.map((item, index) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              const isCategory = item.type === 'category'

              // Render category header
              if (isCategory) {
                return (
                  <li key={item.id} className={index > 0 ? 'pt-4' : ''}>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Icon className="h-4 w-4 text-app-text-muted dark:text-gray-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text-muted dark:text-gray-500">
                        {item.label}
                      </span>
                    </div>
                    <div className="mx-3 border-b border-app-border dark:border-app-border-dark mb-2" />
                  </li>
                )
              }

              // Render regular menu item
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange(item.id)
                      if (window.innerWidth < 1024) onClose()
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
                      text-left transition-all duration-200 group
                      ${isActive
                        ? 'bg-[#0039A6] text-white shadow-md shadow-[#0039A6]/20'
                        : 'text-app-text-secondary dark:text-white/60 hover:bg-app-bg-secondary dark:hover:bg-white/5 hover:text-app-text-primary dark:hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-app-text-secondary dark:text-white/60'}`} />
                    <span className="text-sm font-normal">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
