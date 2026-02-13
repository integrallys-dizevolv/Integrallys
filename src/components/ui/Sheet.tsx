import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
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

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity duration-300" />
      <div
        className="relative z-[100] h-full flex flex-col w-full max-w-sm bg-white dark:bg-[#0c1e3d] shadow-xl transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function SheetContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col h-full ${className}`}>{children}</div>
}

export function SheetHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
}

export function SheetTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-lg font-semibold text-[#101828] dark:text-white ${className}`}>{children}</h2>
}

export function SheetDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-[#6a7282] dark:text-gray-400 mt-1 ${className}`}>{children}</p>
}
