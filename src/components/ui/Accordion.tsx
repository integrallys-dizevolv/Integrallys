import { useState, createContext, useContext } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionContextType {
  openItems: Set<string>
  toggleItem: (value: string) => void
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)
const AccordionItemContext = createContext<string>('')

interface AccordionProps {
  children: React.ReactNode
  className?: string
}

export function Accordion({ children, className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }
      return newSet
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps {
  value: string
  children: React.ReactNode
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      {children}
    </AccordionItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className = '' }: AccordionTriggerProps) {
  const context = useContext(AccordionContext)
  const itemValue = useContext(AccordionItemContext)
  if (!context) throw new Error('AccordionTrigger must be inside Accordion')

  const { openItems, toggleItem } = context
  const isOpen = openItems.has(itemValue)

  return (
    <button
      onClick={() => toggleItem(itemValue)}
      className={`w-full flex items-center justify-between p-4 bg-white dark:bg-[#020817] border border-gray-200 dark:border-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${className}`}
    >
      <div className="flex-1 text-left">{children}</div>
      <ChevronDown className={`h-4 w-4 text-[#1A1A1AB2] dark:text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  const context = useContext(AccordionContext)
  const itemValue = useContext(AccordionItemContext)
  if (!context) throw new Error('AccordionContent must be inside Accordion')

  const { openItems } = context
  const isOpen = openItems.has(itemValue)

  if (!isOpen) return null

  return (
    <div className={`p-4 bg-white dark:bg-[#020817] border border-gray-200 dark:border-white/5 rounded-lg mt-2 ${className}`}>
      {children}
    </div>
  )
}
