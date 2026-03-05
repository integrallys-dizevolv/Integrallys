import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode

}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70" />
      <div
        className="relative z-50 flex flex-col w-full max-w-sm bg-app-card dark:bg-app-card-dark shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function SheetContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col h-full ${className}`}>{children}</div>
}

export function SheetHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 border-b border-app-border dark:border-app-border-dark ${className}`}>{children}</div>
}

export function SheetTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-lg font-semibold text-app-text-primary dark:text-white ${className}`}>{children}</h2>
}

export function SheetDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-app-text-secondary dark:text-white/60 mt-1 ${className}`}>{children}</p>
}
