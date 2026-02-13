import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogFooter
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { DateInput } from '@/components/ui/DateInput'
import { Label } from '@/components/ui/Label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { X, FileText } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { useState } from 'react'

interface AdicionarDocumentoEnviadoModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AdicionarDocumentoEnviadoModal({ isOpen, onClose }: AdicionarDocumentoEnviadoModalProps) {
    const [sentDate, setSentDate] = useState('')
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[550px] p-6 md:p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl block overflow-y-auto max-h-[90vh] custom-scrollbar animate-in"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                            Adicionar documento enviado
                        </h2>
                        <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                            Registre um novo documento enviado ao paciente
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-6 mb-6">
                    {/* Tipo de Documento */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Tipo de documento *
                        </Label>
                        <Select>
                            <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-600 dark:text-white/80">
                                <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[12px]">
                                <SelectItem value="prescricao">Prescrição</SelectItem>
                                <SelectItem value="atestado">Atestado</SelectItem>
                                <SelectItem value="exame">Exame</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Data de Envio */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Data de envio *
                        </Label>
                        <DateInput
                            value={sentDate}
                            onChange={setSentDate}
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white pl-4"
                        />
                    </div>

                    {/* Meio de Envio */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Meio de envio
                        </Label>
                        <Select defaultValue="whatsapp">
                            <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-600 dark:text-white/80">
                                <SelectValue preferPlaceholder placeholder="Selecione o meio" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[12px]">
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                <SelectItem value="email">E-mail</SelectItem>
                                <SelectItem value="fisico">Físico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Anexo */}
                    <div className="space-y-3">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">
                            Anexo (opcional)
                        </Label>
                        <Button
                            variant="outline"
                            className="w-full h-12 rounded-[12px] bg-white dark:bg-transparent border-app-border dark:border-app-border-dark text-gray-700 dark:text-white/80 font-normal hover:bg-app-bg-secondary dark:hover:bg-white/5 flex items-center justify-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Anexar arquivo
                        </Button>
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-app-bg-secondary dark:bg-app-bg-dark"></div>
                            <span className="text-xs font-normal text-app-text-muted">ou</span>
                            <div className="h-px flex-1 bg-app-bg-secondary dark:bg-app-bg-dark"></div>
                        </div>
                        <Input
                            placeholder="Cole o link do documento (URL)"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Confirmar Recebimento */}
                    <div className="flex items-center justify-between pt-2">
                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white cursor-pointer" htmlFor="confirmar-recebimento">
                            Confirmar recebimento
                        </Label>
                        <Switch id="confirmar-recebimento" />
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end w-full border-t border-gray-100 dark:border-gray-800 pt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto h-11 px-6 rounded-[10px] font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 border-app-border dark:border-app-border-dark"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full sm:w-auto px-6 h-11 bg-[#0039A6] hover:bg-[#1d3b2e] text-white rounded-[10px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        onClick={onClose}
                    >
                        Adicionar documento
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

