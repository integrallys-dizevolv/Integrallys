import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-[#0039A6] hover:bg-[#002D7A] text-white disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
  }

  const sizeStyles = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
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
