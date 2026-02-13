import { useState } from 'react'

export interface CIDItem {
    id: string
    code: string
    description: string
}

export const useCID = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [results, setResults] = useState<CIDItem[]>([])

    const searchCID = async (term: string) => {
        if (term.length < 3) {
            setResults([])
            return
        }

        setIsLoading(true)
        // Simulated API CID-11 Search
        await new Promise(resolve => setTimeout(resolve, 500))

        const mockResults: CIDItem[] = [
            { id: '1', code: 'MG30', description: 'Dor lombar' },
            { id: '2', code: 'MG30.0', description: 'Lombalgia' },
            { id: '3', code: 'FA80', description: 'Diabetes mellitus' },
        ].filter(item =>
            item.description.toLowerCase().includes(term.toLowerCase()) ||
            item.code.toLowerCase().includes(term.toLowerCase())
        )

        setResults(mockResults)
        setIsLoading(false)
    }

    return { searchCID, results, isLoading }
}
