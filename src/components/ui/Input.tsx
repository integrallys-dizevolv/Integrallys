import React, { useEffect, useState } from 'react'
import { DateInput } from './DateInput'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  hideDateIcon?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, hideDateIcon = false, ...props }, ref) => {
    if (props.type === 'date') {
      const { onChange, value, defaultValue, type, ...rest } = props
      const isControlled = value !== undefined
      const [internalValue, setInternalValue] = useState(
        (defaultValue as string) || ''
      )

      useEffect(() => {
        if (isControlled) {
          setInternalValue((value as string) || '')
        }
      }, [isControlled, value])

      const handleDateChange = (val: string) => {
        if (!isControlled) {
          setInternalValue(val)
        }
        if (onChange) {
          onChange({ target: { value: val } } as React.ChangeEvent<HTMLInputElement>)
        }
      }

      return (
        <DateInput
          {...rest}
          value={(isControlled ? (value as string) : internalValue) || ''}
          onChange={handleDateChange}
          hideIcon={hideDateIcon}
          className={`${className} ${error ? 'border-red-500 focus:ring-red-500/20' : ''}`}
        />
      )
    }

    return (
      <input
        ref={ref}
        className={`
          w-full
          h-11
          border
          rounded-[12px]
          transition-all
          duration-300
          focus:outline-none
          focus:ring-2
          focus:ring-offset-0
          px-4
          text-sm
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
