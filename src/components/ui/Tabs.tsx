import { useState, createContext, useContext } from 'react'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value: propValue, onValueChange, defaultValue, children, className = '' }: TabsProps & { defaultValue?: string }) {
  const [localValue, setLocalValue] = useState(defaultValue || '')
  const isControlled = propValue !== undefined
  const value = isControlled ? propValue : localValue

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setLocalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-lg bg-[#0039A6] p-1 ${className}`}>
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be inside Tabs')

  const { value: selectedValue, onValueChange } = context
  const isActive = selectedValue === value

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium
        transition-all focus-outline-none disabled:pointer-events-none disabled:opacity-50
        ${isActive
          ? 'bg-[#0039A6] text-[#1A1A1A] shadow-sm'
          : 'text-[#1A1A1AB2] hover:bg-[#0039A6]/50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be inside Tabs')

  const { value: selectedValue } = context
  if (selectedValue !== value) return null

  return <div className={className}>{children}</div>
}
