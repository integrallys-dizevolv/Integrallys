import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectContextType {
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => { },
})

export function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || value || '')
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
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

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, open, setOpen }}>
      <div ref={selectRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = '', ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={`
        flex
        items-center
        justify-between
        w-full
        h-11
        px-3
        rounded-[10px]
        border
        border-[#d1d5dc]
        dark:border-[#4a5565]
bg-app-card
        dark:bg-app-bg-dark
        text-app-text-primary
        dark:text-white
        text-sm
        focus:outline-none
        focus:ring-2
        focus:ring-[#0039A6]
        ${className}
      `}
      {...props}
    >
      {children}
      <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

export function SelectValue({ placeholder, children, preferPlaceholder }: { placeholder?: string; children?: React.ReactNode; preferPlaceholder?: boolean }) {
  const { value } = React.useContext(SelectContext)
  const displayContent = preferPlaceholder ? children : (children || value)
  return <span className="truncate">{displayContent || <span className="text-app-text-muted dark:text-app-text-secondary">{placeholder}</span>}</span>
}

export function SelectContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen } = React.useContext(SelectContext)

  if (!open) return null

  return (
    <div
      className={`
        absolute
        z-50
        w-full
        mt-1
bg-app-card
        dark:bg-app-card-dark
        border
        border-app-border
        dark:border-app-border-dark
        rounded-[10px]
        shadow-lg
        max-h-60
        overflow-auto
        ${className}
      `}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

export function SelectItem({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue, onValueChange } = React.useContext(SelectContext)

  return (
    <div
      onClick={() => onValueChange?.(value)}
      className={`
        px-3
        py-2
        text-sm
        cursor-pointer
hover:bg-app-bg-secondary
        dark:hover:bg-app-card/5
        ${selectedValue === value ? 'bg-[#0039A6]/10 dark:bg-[#0039A6]/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
