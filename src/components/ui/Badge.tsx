import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#0039A6] text-white border-transparent',
    secondary: 'bg-app-bg-secondary dark:bg-white/10 text-app-text-primary dark:text-white border-transparent',
    outline: 'border border-app-border dark:border-app-border-dark bg-transparent text-app-text-primary dark:text-white',
    destructive: 'bg-red-600 dark:bg-red-900 text-white dark:text-red-100 border-transparent',
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
        font-normal
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
