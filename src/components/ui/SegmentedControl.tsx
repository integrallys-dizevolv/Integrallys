import { ReactNode } from 'react'

interface SegmentedControlOption {
    value: string
    label: string | ReactNode
}

interface SegmentedControlProps {
    options: SegmentedControlOption[]
    value: string
    onChange: (value: string) => void
    variant?: 'default' | 'pill'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    fullWidth?: boolean
}

/**
 * SegmentedControl - Componente padronizado de tabs/segmented control
 * 
 * @example
 * <SegmentedControl
 *   options={[
 *     { value: 'tab1', label: 'Tab 1' },
 *     { value: 'tab2', label: 'Tab 2' },
 *   ]}
 *   value={activeTab}
 *   onChange={setActiveTab}
 * />
 */
export function SegmentedControl({
    options,
    value,
    onChange,
    variant = 'default',
    size = 'md',
    className = '',
    fullWidth = true,
}: SegmentedControlProps) {
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-[15px]',
    }

    const containerClasses = {
        default: 'rounded-[14px]',
        pill: 'rounded-full',
    }

    const buttonClasses = {
        default: 'rounded-[12px]',
        pill: 'rounded-full',
    }

    return (
        <div
            className={`
        bg-gray-100 dark:bg-[#0c1e3d] p-1 
        flex flex-wrap sm:flex-nowrap gap-1 
        overflow-x-auto scrollbar-hide
        ${containerClasses[variant]}
        ${fullWidth ? 'w-full' : 'inline-flex'}
        ${className}
      `}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`
            flex-1 min-w-[80px] transition-all font-normal
            ${buttonClasses[variant]}
            ${sizeClasses[size]}
            ${value === option.value
                            ? 'bg-[#0039A6] text-white shadow-md'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                        }
          `}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
