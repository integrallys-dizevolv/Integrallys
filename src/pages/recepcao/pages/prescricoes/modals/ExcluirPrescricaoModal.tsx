import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Prescription } from '@/mocks/recepcionista/prescricoes'
import { toast } from 'sonner'

interface ExcluirPrescricaoModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    prescricao: Prescription | null
    onConfirm?: (prescricao: Prescription) => void
}

export function ExcluirPrescricaoModal({ isOpen, onClose, prescricao, onConfirm }: ExcluirPrescricaoModalProps) {
    const handleConfirm = () => {
        if (!prescricao) return

        onConfirm?.(prescricao)
        toast.success('Prescrição/Vendas excluída com sucesso!')
        onClose(false)
    }

    if (!isOpen || !prescricao) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onClose(false)} />

            <div className="relative bg-white dark:bg-[#0c1e3d] rounded-2xl shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Excluir Prescrição/Vendas</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Esta ação não pode ser desfeita</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-4 mb-6">
                        <p className="text-sm text-red-800 dark:text-red-300">
                            Você está prestes a excluir a Prescrição/Vendas <strong>{prescricao.number}</strong>.
                            Todos os dados relacionados serão removidos permanentemente.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Número:</span>
                            <span className="text-gray-900 dark:text-white font-medium">{prescricao.number}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Paciente:</span>
                            <span className="text-gray-900 dark:text-white">{prescricao.patientName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Especialista:</span>
                            <span className="text-gray-900 dark:text-white">{prescricao.specialistName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Valor:</span>
                            <span className="text-gray-900 dark:text-white">R$ {prescricao.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Status:</span>
                            <span className={`font-medium ${prescricao.status === 'Ativa' ? 'text-emerald-600' :
                                prescricao.status === 'Vencida' ? 'text-amber-600' : 'text-blue-600'
                                }`}>{prescricao.status}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            Excluir Prescrição/Vendas
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
