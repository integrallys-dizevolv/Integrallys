import React from 'react'
import { Bell, Moon, Sun, ChevronDown, LogOut, UserCog, Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu'
import { useDarkMode } from '../../hooks/useDarkMode'

// --- Tipagem ---
export interface UserData {
  name: string
  role: string
  initials: string
  initialsBg?: string
  imageUrl?: string // Added support for user image
}

interface HeaderProps {
  currentPageTitle: string
  onPageChange: (page: string) => void
  onLogout: () => void
  notificationsOpen: boolean
  onNotificationsToggle: (open: boolean) => void
  toggleSidebar: () => void
  userData?: UserData
  searchBar?: React.ReactNode // Added support for search bar
}

// --- Sub-componente: Menu de Usuário ---
const UserMenu = ({
  onPageChange,
  onLogout,
  userData
}: Pick<HeaderProps, 'onPageChange' | 'onLogout' | 'userData'>) => {
  const user = userData || {
    name: 'Admin Integrallys',
    role: 'Administrador',
    initials: 'AD',
    initialsBg: 'bg-[#0039A6] text-white'
  }

  const initialsClass = userData?.initialsBg || 'bg-[#0039A6] text-white';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all cursor-pointer group outline-none">
          {user.imageUrl ? (
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm border border-app-border dark:border-app-border-dark">
              <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${initialsClass}`}>
              <span className="text-xs font-bold">{user.initials}</span>
            </div>
          )}

          <div className="hidden md:block text-sm text-left mr-1">
            <p className="font-semibold text-app-text-primary dark:text-white leading-tight">{user.name}</p>
            <p className="text-[11px] text-app-text-secondary dark:text-white/60 font-medium">{user.role}</p>
          </div>

          <ChevronDown className="h-4 w-4 text-app-text-secondary dark:text-white/60 group-hover:text-app-text-primary dark:group-hover:text-white transition-colors" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 p-2 mt-2 shadow-xl border-app-border dark:border-app-border-dark bg-white dark:bg-app-card-dark">
        <DropdownMenuItem onClick={() => onPageChange('configuracoes')} className="gap-2 rounded-lg cursor-pointer py-2.5 text-app-text-primary dark:text-white">
          <UserCog className="h-4 w-4 text-app-text-secondary dark:text-white/60" />
          <span className="font-medium">Configurações</span>
        </DropdownMenuItem>
        <div className="my-1 border-t border-app-border dark:border-app-border-dark" />
        <DropdownMenuItem onClick={onLogout} className="gap-2 rounded-lg cursor-pointer py-2.5 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10">
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Sair do sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// --- Componente Principal ---
export function Header({
  toggleSidebar,
  currentPageTitle,
  onPageChange,
  onLogout,
  notificationsOpen,
  onNotificationsToggle,
  userData,
  searchBar,
}: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <header className="h-16 bg-white/80 dark:bg-app-bg-dark/80 backdrop-blur-md border-b border-app-border dark:border-app-border-dark px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">

      {/* Lado Esquerdo: Mobile Toggle + Título */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 -ml-1 mr-3 text-app-text-secondary dark:text-white/60 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-xl lg:hidden transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h1 className="font-bold text-app-text-primary dark:text-white text-lg lg:text-xl tracking-tight truncate max-w-[200px] md:max-w-none">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* Lado Direito: Ações Globais */}
      <div className="flex items-center gap-1 sm:gap-3">

        {/* Search Bar (Optional) */}
        {searchBar && (
          <div className="hidden md:block mr-2">
            {searchBar}
          </div>
        )}

        {/* Notificações */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNotificationsToggle(!notificationsOpen)}
          className="relative flex items-center justify-center h-10 w-10 text-app-text-secondary dark:text-white/60 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-xl transition-colors"
          title="Notificações"
        >
          <Bell className="h-[22px] w-[22px]" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-app-bg-dark"></span>
        </Button>

        {/* Alternador de Tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="flex items-center justify-center h-10 w-10 text-app-text-secondary dark:text-white/60 hover:bg-app-bg-secondary dark:hover:bg-white/5 rounded-xl transition-colors"
          title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
        >
          {isDarkMode ? <Sun className="h-[22px] w-[22px]" /> : <Moon className="h-[22px] w-[22px]" />}
        </Button>

        {/* Separador Vertical */}
        <div className="w-px h-6 bg-app-border dark:bg-app-border-darkStrong hidden sm:block mx-1"></div>

        {/* Menu do Usuário Refatorado */}
        <UserMenu onPageChange={onPageChange} onLogout={onLogout} userData={userData} />
      </div>
    </header>
  )
}