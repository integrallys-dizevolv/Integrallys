import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
      onClick={() => onOpenChange(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children, className = '', ...props }: DialogContentProps) {
  return (
    <div
      className={`
        relative
bg-app-card
        dark:bg-app-card-dark
        rounded-[14px]
        shadow-lg
        max-w-lg
        w-full
        max-h-[90vh]
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pb-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`text-xl font-semibold text-app-text-primary dark:text-white ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-app-text-secondary dark:text-white/60 mt-2 ${className}`} {...props}>
      {children}
    </p>
  )
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  asChild?: boolean
}

export function DialogTrigger({ children, asChild, ...props }: DialogTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props)
  }
  return <Button {...props}>{children}</Button>
}
