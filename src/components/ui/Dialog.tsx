import React, { createContext, useContext, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function Dialog({ open: controlledOpen, onOpenChange: controlledOnOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const onOpenChange = isControlled ? controlledOnOpenChange : setUncontrolledOpen

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

  // Safety check function to ensure onOpenChange is defined
  const handleOpenChange = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    }
  }

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild, ...props }: any) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within Dialog")

  const handleClick = (e: React.MouseEvent) => {
    context.onOpenChange(true)
    if (children.props?.onClick) {
      children.props.onClick(e)
    }
  }

  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick
    })
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  hideCloseButton?: boolean
}

import { createPortal } from 'react-dom'

export function DialogContent({ children, className = '', hideCloseButton = false, ...props }: DialogContentProps) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used within Dialog")

  if (!context.open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          context.onOpenChange(false)
        }
      }}
    >
      <div
        className={`
          relative
          bg-white
          dark:bg-[#0c1e3d]
          rounded-[14px]
          shadow-lg
          w-auto
          min-w-[320px]
          max-w-[92vw]
          max-h-[90vh]
          overflow-y-auto
          custom-scrollbar
          animate-in fade-in zoom-in-95 duration-200
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {!hideCloseButton && (
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => context.onOpenChange(false)}
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
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
    <h2 className={`text-xl font-semibold text-[#101828] dark:text-white ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-[#6a7282] dark:text-gray-400 mt-2 ${className}`} {...props}>
      {children}
    </p>
  )
}

export function DialogFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 ${className}`}
      {...props}
    />
  )
}
