import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`
        text-sm
        font-medium
text-[#364153]
        dark:text-white/80
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  )
}
