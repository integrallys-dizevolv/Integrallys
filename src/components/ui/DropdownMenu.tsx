import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLDivElement>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => { },
  triggerRef: { current: null },
  contentRef: { current: null },
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Se o clique for fora do trigger E fora do conteúdo, fecha o menu
      const clickedOutsideTrigger = triggerRef.current && !triggerRef.current.contains(target)
      const clickedOutsideContent = contentRef.current && !contentRef.current.contains(target)

      if (clickedOutsideTrigger && clickedOutsideContent) {
        setOpen(false)
      }
    }

    if (open) {
      // Usar capture: true para garantir que pegamos o clique antes de qualquer stopPropagation
      document.addEventListener('mousedown', handleClickOutside, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, asChild, ...props }: any) {
  const { open, setOpen, triggerRef } = React.useContext(DropdownMenuContext)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpen(!open)
  }

  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref: triggerRef,
      onClick: handleClick
    })
  }

  return (
    <button type="button" ref={triggerRef as any} onClick={handleClick} {...props} className={props.className || "focus:outline-none"}>
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, align = 'end', className = '' }: { children: React.ReactNode; align?: 'start' | 'end'; className?: string }) {
  const { open, triggerRef, contentRef, setOpen } = React.useContext(DropdownMenuContext)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      // Calculate position relative to viewport
      const top = triggerRect.bottom + 4
      let left = triggerRect.left

      if (align === 'end') {
        left = triggerRect.right - contentRect.width
      }

      // Check for viewport overflow
      if (left + contentRect.width > window.innerWidth) {
        left = window.innerWidth - contentRect.width - 10
      }
      if (left < 10) {
        left = 10
      }

      // Check for bottom overflow
      let finalTop = top
      if (top + contentRect.height > window.innerHeight) {
        finalTop = triggerRect.top - contentRect.height - 4
      }

      setPosition({ top: finalTop, left })
    }
  }, [open, triggerRef, align])

  useEffect(() => {
    const handleScroll = () => {
      if (open) setOpen(false)
    }
    if (open) {
      window.addEventListener('scroll', handleScroll, true)
    }
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [open, setOpen])

  if (!open) return null

  return createPortal(
    <div
      ref={contentRef}
      className={`
        fixed
        z-[99999]
        min-w-[12rem]
        bg-white
        dark:bg-[#020817]
        border
        border-gray-200
        dark:border-white/10
        rounded-[16px]
        shadow-2xl
        py-2
        
        ${className}
      `}
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>,
    document.body
  )
}

export function DropdownMenuItem({ children, onClick, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onClick?.(e)
    setOpen(false)
  }

  return (
    <div
      onClick={handleClick}
      className={`
        px-4
        py-2.5
        text-sm
        cursor-pointer
        hover:bg-gray-50
        dark:hover:bg-white/5
        flex
        items-center
        transition-colors
        rounded-md
        font-normal
        text-gray-700
        dark:text-gray-300
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-4 py-2 text-[10px] font-normal text-gray-400 dark:text-gray-500 uppercase tracking-widest ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`h-px bg-gray-100 dark:bg-white/5 my-1 mx-2 ${className}`}
      {...props}
    ></div>
  )
}
