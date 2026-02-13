import React from 'react'
import { Box } from 'lucide-react'

export const Anatomy3D = () => {
    return (
        <div className="bg-app-bg-secondary dark:bg-app-bg-dark rounded-[14px] border border-app-border dark:border-gray-800 p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
            <div className="p-4 bg-white dark:bg-app-card-dark rounded-full shadow-sm text-[#0039A6]">
                <Box className="h-10 w-10 animate-pulse" />
            </div>
            <div className="text-center">
                <h4 className="font-bold text-gray-900 dark:text-white">BioDigital 3D Anatomy</h4>
                <p className="text-sm text-app-text-muted">Suporte visual integrado para educação do paciente</p>
            </div>
            <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#0039A6] w-2/3"></div>
            </div>
            <span className="text-xs text-app-text-muted">Carregando modelo anatômico...</span>
        </div>
    )
}
