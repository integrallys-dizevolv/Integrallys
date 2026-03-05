import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full
          border
          rounded-[10px]
          transition-colors
          duration-300
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          ${error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-[#d1d5dc] dark:border-[#4a5565] focus:ring-[#0039A6] focus:border-[#0039A6]'
          }
dark:bg-app-bg-dark
          dark:text-white
          dark:placeholder:text-app-text-secondary
          bg-app-card
          text-app-text-primary
          placeholder:text-app-text-muted
          resize-none
          ${className}
        `}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
