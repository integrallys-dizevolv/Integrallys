import React, { useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Upload, X } from 'lucide-react'

interface AlterarFotoModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AlterarFotoModal({ isOpen, onClose }: AlterarFotoModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            void file
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:max-w-[480px] rounded-[24px] p-0 overflow-hidden bg-white dark:bg-[#0c1e3d] border-none shadow-xl">
                <div className="p-6 sm:p-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Alterar Foto de Perfil
                        </DialogTitle>
                    </DialogHeader>

                    <div
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[16px] bg-gray-50/50 dark:bg-[#020817]/50 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-[#020817]/70 transition-colors"
                        onClick={handleButtonClick}
                    >
                        <div className="relative mb-4">
                            <div className="h-20 w-20 rounded-full bg-[#0039A6] flex items-center justify-center text-white text-2xl font-bold relative z-0">
                                JD
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white dark:bg-[#0c1e3d] rounded-full flex items-center justify-center shadow-sm z-10">
                                <Upload className="h-5 w-5 text-[#0039A6] dark:text-emerald-400" />
                            </div>
                        </div>

                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 mt-4">
                            Clique para enviar
                        </h3>
                        <p className="text-sm text-gray-500 text-center">
                            ou arraste e solte<br />
                            JPG, PNG ou GIF. Máx. 2MB
                        </p>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 result mt-8">
                        <Button
                            variant="outline"
                            className="h-11 rounded-[10px] px-6 w-full sm:w-auto"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="h-11 rounded-[10px] px-6 bg-[#0039A6] hover:bg-[#002d82] text-white w-full sm:w-auto"
                            onClick={onClose} // Logic to save would go here
                        >
                            Salvar Foto
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
