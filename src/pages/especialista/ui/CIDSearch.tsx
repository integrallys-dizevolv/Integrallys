import React, { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useCID } from '../hooks/useCID'

interface CIDSearchProps {
    onSelect: (code: string) => void
    disabled?: boolean
}

export const CIDSearch = ({ onSelect, disabled }: CIDSearchProps) => {
    const [term, setTerm] = useState('')
    const { searchCID, results, isLoading } = useCID()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setTerm(val)
        searchCID(val)
    }

    return (
        <div className="relative space-y-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted" />
                <Input
                    placeholder="Buscar diagnóstico (CID-11)..."
                    value={term}
                    onChange={handleSearch}
                    disabled={disabled}
                    className="pl-10 h-11 rounded-[10px]"
                />
                {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0039A6] animate-spin" />}
            </div>

            {results.length > 0 && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-app-card-dark border border-gray-100 dark:border-gray-800 rounded-[10px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {results.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                onSelect(`${item.code} - ${item.description}`)
                                setTerm(`${item.code} - ${item.description}`)
                                // Clear results
                            }}
                            className="p-3 hover:bg-app-bg-secondary dark:hover:bg-app-bg-dark cursor-pointer transition-colors border-b last:border-0 border-gray-100 dark:border-gray-800"
                        >
                            <span className="font-bold text-[#0039A6] dark:text-[#4da885]">{item.code}</span>
                            <span className="ml-2 text-gray-700 dark:text-white/80">{item.description}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
