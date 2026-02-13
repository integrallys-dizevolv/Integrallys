import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full
          border
          rounded-[12px]
          transition-all
          duration-300
          focus:outline-none
          focus:ring-2
          focus:ring-offset-0
          ${error
            ? 'border-red-500 focus:ring-red-500/20'
            : 'border-app-border dark:border-app-border-dark focus:ring-[#0039A6]/20 focus:border-[#0039A6]'
          }
          dark:bg-app-bg-dark
          dark:text-white
          dark:placeholder:text-app-text-muted
          bg-white
          text-app-text-primary
          placeholder:text-app-text-muted
          ${className}
        `}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
