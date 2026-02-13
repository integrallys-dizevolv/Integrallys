import React from 'react'
import { ChevronRight } from 'lucide-react'

export function Breadcrumb({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <nav className={`flex ${className}`} aria-label="Breadcrumb">{children}</nav>
}

export function BreadcrumbList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <ol className={`flex items-center space-x-2 ${className}`}>{children}</ol>
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <li className="flex items-center">{children}</li>
}

export function BreadcrumbLink({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm text-[#6a7282] dark:text-gray-400 hover:text-[#0039A6] dark:hover:text-white ${className}`}
    >
      {children}
    </button>
  )
}

export function BreadcrumbPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`text-sm font-medium text-[#101828] dark:text-white ${className}`}>
      {children}
    </span>
  )
}

export function BreadcrumbSeparator() {
  return <ChevronRight className="h-4 w-4 text-[#6a7282] dark:text-gray-400 mx-2" />
}
