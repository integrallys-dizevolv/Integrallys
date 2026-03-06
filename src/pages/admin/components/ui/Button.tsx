import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-[#0039A6] hover:bg-[#002d82] text-white',
    secondary: 'bg-app-bg-secondary hover:bg-gray-300 text-app-text-primary dark:bg-gray-700 dark:hover:bg-app-card/5 dark:text-white',
    ghost: 'bg-transparent hover:bg-app-bg-secondary text-app-text-primary dark:hover:bg-app-card/5 dark:text-white/80',
    outline: 'border border-app-border dark:border-app-border-dark bg-transparent hover:bg-app-bg-secondary dark:hover:bg-app-card/5 text-app-text-primary dark:text-white/80',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
  }

  const sizeStyles = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
    icon: 'h-10 w-10 p-0',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
