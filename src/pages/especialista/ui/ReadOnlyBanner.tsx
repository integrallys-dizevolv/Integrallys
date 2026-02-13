import React from 'react'
import { Lock, AlertTriangle } from 'lucide-react'

export const ReadOnlyBanner = () => {
    return (
        <div className="bg-[#fffbeb] dark:bg-[#2a240d] border border-yellow-100 dark:border-yellow-900/30 rounded-[14px] p-6 mb-8 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 mb-3 text-amber-700 dark:text-amber-400">
                <Lock className="h-6 w-6" />
                <h3 className="text-lg font-bold">Atendimento Finalizado (Modo Leitura)</h3>
            </div>
            <p className="text-amber-800 dark:text-amber-200/80 pl-9 leading-relaxed text-sm">
                Este prontuário está finalizado conforme a <strong>RN-009</strong>. Alterações no corpo principal não são permitidas para garantir a segurança jurídica. Utilize o campo de "Notas/Errata" para adições posteriores.
            </p>
        </div>
    )
}
