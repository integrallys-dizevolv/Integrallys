import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#0039A6] text-white border-transparent',
    secondary: 'bg-app-bg-secondary dark:bg-gray-700 text-app-text-primary dark:text-white/80 border-transparent',
    outline: 'border border-app-border dark:border-app-border-dark bg-transparent text-app-text-primary dark:text-white/80',
    destructive: 'bg-red-600 text-white border-transparent',
  }

  return (
    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-0.5
        rounded-full
        text-xs
        font-medium
        border
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}
