import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-[10px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-[#0039A6] hover:bg-[#002D7A] text-white',
    secondary: 'bg-app-bg-secondary hover:bg-app-bg-tertiary text-app-text-primary dark:bg-white/5 dark:hover:bg-white/10 dark:text-white',
    ghost: 'bg-transparent hover:bg-app-bg-secondary text-app-text-primary dark:hover:bg-white/5 dark:text-white',
    outline: 'border border-app-border dark:border-app-border-dark bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 text-app-text-primary dark:text-white',
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
      ref={ref}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'
