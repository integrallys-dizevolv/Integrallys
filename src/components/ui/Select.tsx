import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectContextType {
  value?: string
  selectedLabel?: string
  firstItemLabel?: string
  valueLabelMap?: Record<string, string>
  registerItem?: (value: string, label: string) => void
  onValueChange?: (value: string, label?: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => { },
  triggerRef: { current: null }
})

export function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || value || '')
  const [selectedLabel, setSelectedLabel] = useState<string>('')
  const [firstItemLabel, setFirstItemLabel] = useState<string>('')
  const [valueLabelMap, setValueLabelMap] = useState<Record<string, string>>({})
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        // We also need to check if the content is being clicked, but since it's portaled
        // and items handle their own clicks, this simple check might need refinement 
        // if we want to prevent closing when clicking inside the portal but outside items.
        // However, standard Select closes on click outside the trigger OR selecting an item.
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleValueChange = (newValue: string, newLabel?: string) => {
    setInternalValue(newValue)
    if (newLabel) setSelectedLabel(newLabel)
    onValueChange?.(newValue)
    setOpen(false)
  }

  const registerItem = React.useCallback((itemValue: string, itemLabel: string) => {
    setValueLabelMap(prev => (prev[itemValue] === itemLabel ? prev : { ...prev, [itemValue]: itemLabel }))
    setFirstItemLabel(prev => prev || itemLabel)
  }, [])

  return (
    <SelectContext.Provider value={{
      value: internalValue,
      selectedLabel,
      firstItemLabel,
      valueLabelMap,
      registerItem,
      onValueChange: handleValueChange,
      open,
      setOpen,
      triggerRef
    }}>
      <div className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = '', ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, triggerRef } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={`
        flex
        items-center
        justify-between
        w-full
        h-11
        px-4
        rounded-[12px]
        border
        border-app-border
        dark:border-app-border-dark
        bg-white
        dark:bg-app-bg-dark
        text-app-text-primary
        dark:text-white
        text-sm
        transition-all
        focus:outline-none
        focus:ring-2
        focus:ring-[#0039A6]/20
        font-normal
        ${className}
      `}
      {...props}
    >
      {children}
      <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}

export function SelectValue({ placeholder, children, preferPlaceholder = false }: { placeholder?: string; children?: React.ReactNode; preferPlaceholder?: boolean }) {
  const { value, selectedLabel, firstItemLabel, valueLabelMap } = React.useContext(SelectContext)

  const formatText = (text: string) => {
    if (!text) return text
    // Apenas garante que se for o value técnico, transforme em Sentence case
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  const mappedLabel = selectedLabel || (value ? valueLabelMap?.[value] : undefined)
  const displayContent = children || (preferPlaceholder
    ? (mappedLabel ? formatText(mappedLabel) : (firstItemLabel ? formatText(firstItemLabel) : null))
    : (mappedLabel ? formatText(mappedLabel) : (value ? formatText(value) : null)))

  return <span className="truncate">{displayContent || <span className="text-app-text-muted dark:text-white/50">{placeholder}</span>}</span>
}

export function SelectContent({ children, className = '', width }: { children: React.ReactNode; className?: string; width?: number | string }) {
  const { open, setOpen, triggerRef } = React.useContext(SelectContext)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }, [open, triggerRef])

  useEffect(() => {
    const handleScroll = () => {
      if (open && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setPosition(prev => ({
          ...prev,
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        }))
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      window.addEventListener('scroll', handleScroll, true)
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, triggerRef, setOpen])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      className={`
        absolute
        z-[99999]
        bg-white
        dark:bg-app-bg-dark
        border
        border-app-border
        dark:border-app-border-dark
        rounded-[12px]
        shadow-lg
        max-h-60
        overflow-auto
        ${className}
      `}
      style={{
        top: position.top,
        left: position.left,
        width: width || position.width,
        position: 'absolute'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  )
}

export function SelectItem({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  const { value: selectedValue, onValueChange, registerItem } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  // Captura o texto do label se for string
  const label = typeof children === 'string' ? children : undefined

  React.useEffect(() => {
    if (label && registerItem) {
      registerItem(value, label)
    }
  }, [label, registerItem, value])

  return (
    <div
      onClick={() => onValueChange?.(value, label)}
      className={`
        px-3
        py-2
        text-sm
        cursor-pointer
        hover:bg-app-bg-secondary
        dark:hover:bg-white/5
        flex
        items-center
        justify-between
        font-normal
        ${isSelected ? 'bg-[#0039A6]/10 dark:bg-[#0039A6]/20 text-[#0039A6] dark:text-white' : 'text-app-text-primary dark:text-white'}
        ${className}
      `}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="h-4 w-4 text-[#0039A6]" />}
    </div>
  )
}
