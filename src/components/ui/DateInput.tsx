import React, { useRef, useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    error?: boolean;
    hideIcon?: boolean;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
    ({ value, onChange, className, hideIcon = false, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState('');
        const dateInputRef = useRef<HTMLInputElement>(null);
        const baseInputClassName = `
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
            border-app-border dark:border-app-border-dark focus:ring-[#0039A6]/20 focus:border-[#0039A6]
            dark:bg-app-bg-dark
            dark:text-white
            dark:placeholder:text-app-text-muted
            bg-white
            text-app-text-primary
            placeholder:text-app-text-muted
        `;

        // Convert YYYY-MM-DD to DD/MM/YYYY
        useEffect(() => {
            if (value && value.includes('-')) {
                const [y, m, d] = value.split('-');
                setDisplayValue(`${d}/${m}/${y}`);
            } else if (!value) {
                setDisplayValue('');
            }
        }, [value]);

        const maskDate = (val: string) => {
            return val
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d+?$)/, '$1')
                .substring(0, 10);
        };

        const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (!val) {
                setDisplayValue('');
                onChange('');
                return;
            }

            const masked = maskDate(val);
            setDisplayValue(masked);

            if (masked.length === 10) {
                const [d, m, y] = masked.split('/');
                const year = parseInt(y);
                const month = parseInt(m);
                const day = parseInt(d);
                if (year > 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    const formattedDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
                    onChange(formattedDate);
                }
            }
        };

        const handleBlur = () => {
            // If incomplete, we could clear it or try to fix it
            if (displayValue.length > 0 && displayValue.length < 10) {
                // Option: clear or keep as is? Browsers usually clear invalid dates.
            }
        };

        const openPicker = () => {
            const pickerInput = dateInputRef.current;
            if (pickerInput) {
                const inputWithPicker = pickerInput as HTMLInputElement & { showPicker?: () => void };
                if (typeof inputWithPicker.showPicker === 'function') {
                    inputWithPicker.showPicker();
                } else {
                    pickerInput.focus();
                    pickerInput.click();
                }
            }
        };

        return (
            <div className="relative group">
                <input
                    {...props}
                    ref={ref}
                    type="text"
                    value={displayValue}
                    onChange={handleTextChange}
                    onBlur={handleBlur}
                    placeholder="DD/MM/AAAA"
                    className={`${baseInputClassName} pr-10 ${className || ''}`}
                />
                {!hideIcon && (
                    <button
                        type="button"
                        onClick={openPicker}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0039A6] transition-colors"
                    >
                        <Calendar size={18} />
                    </button>
                )}
                {/* Hidden native date input for the picker */}
                <input
                    ref={dateInputRef}
                    type="date"
                    className="absolute opacity-0 pointer-events-none w-0 h-0"
                    value={value || ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val);
                    }}
                />
            </div>
        );
    }
);

DateInput.displayName = 'DateInput';
