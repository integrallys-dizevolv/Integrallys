import React from 'react'

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
}

export function Switch({ checked, defaultChecked, onCheckedChange, disabled, id, className }: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : internalChecked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
  }

  return (
    <label
      htmlFor={id}
      className={`
        relative
        inline-flex
        items-center
        h-6
        w-11
        rounded-full
        transition-colors
        cursor-pointer
        ${isChecked ? 'bg-[#0039A6]' : 'bg-gray-300 dark:bg-gray-600'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={`
          inline-block
          h-4
          w-4
          rounded-full
          bg-white
          transform
          transition-transform
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </label>
  )
}
