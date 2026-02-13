import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical } from 'lucide-react'

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => { },
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, asChild, ...props }: any) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)

  if (asChild) {
    return React.cloneElement(children, { ...props, onClick: () => setOpen(!open) })
  }

  return (
    <button type="button" onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, align = 'end', className = '' }: { children: React.ReactNode; align?: 'start' | 'end'; className?: string }) {
  const { open } = React.useContext(DropdownMenuContext)

  if (!open) return null

  return (
    <div
      className={`
        absolute
        z-50
        mt-1
        min-w-[8rem]
bg-app-card
        dark:bg-app-card-dark
        border
        border-app-border
        dark:border-app-border-dark
        rounded-[10px]
        shadow-lg
        py-1
        ${align === 'end' ? 'right-0' : 'left-0'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e)
    setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={`
        px-3
        py-2
        text-sm
        cursor-pointer
hover:bg-app-bg-secondary
        dark:hover:bg-app-card/5
        flex
        items-center
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
