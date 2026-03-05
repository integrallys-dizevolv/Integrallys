import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogFooter
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { FileText, Save, X, ShieldCheck, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useState } from 'react'

interface NovaPrescricaoModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NovaPrescricaoModal({ isOpen, onClose }: NovaPrescricaoModalProps) {
    const [isSigned, setIsSigned] = useState(false)
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState(false)

    const handleSign = () => {
        if (pin === '1234') {
            setIsSigned(true)
            setPinError(false)
        } else {
            setPinError(true)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[600px] p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl gap-8 overflow-y-auto max-h-[90vh] custom-scrollbar animate-in bg-white dark:bg-app-card-dark"
            >
                {/* Header with Title, Icon and Close Button */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-900 dark:text-white" />
                            <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight">
                                Nova prescrição médica
                            </h2>
                        </div>
                        <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal">
                            Prescrições para uso externo (farmácias, exames, orientações)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Row 1: Paciente & Tipo */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                Paciente *
                            </Label>
                            <Select>
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-600 dark:text-white/80">
                                    <SelectValue preferPlaceholder placeholder="Selecione o paciente" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[12px]">
                                    <SelectItem value="maria">Maria Silva</SelectItem>
                                    <SelectItem value="joao">João Santos</SelectItem>
                                    <SelectItem value="ana">Ana Costa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                Tipo de prescrição *
                            </Label>
                            <Select defaultValue="suplementacao">
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white font-normal">
                                    <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[12px]">
                                    <SelectItem value="medicamento">Medicamento</SelectItem>
                                    <SelectItem value="exame">Exame</SelectItem>
                                    <SelectItem value="suplementacao">Suplementação</SelectItem>
                                    <SelectItem value="orientacao">Orientação</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 2: Validade */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                            Validade (dias) *
                        </Label>
                        <Select defaultValue="30">
                            <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] text-gray-900 dark:text-white font-normal">
                                <SelectValue preferPlaceholder placeholder="Selecione a validade" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[12px]">
                                <SelectItem value="7">7 dias</SelectItem>
                                <SelectItem value="15">15 dias</SelectItem>
                                <SelectItem value="30">30 dias</SelectItem>
                                <SelectItem value="60">60 dias</SelectItem>
                                <SelectItem value="90">90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Row 3: Instruções */}
                    <div className="space-y-2">
                        <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                            Instruções e detalhes *
                        </Label>
                        <Textarea
                            placeholder="Descreva os medicamentos, dosagens, exames solicitados ou orientações..."
                            className="min-h-[140px] rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark resize-none p-4 text-[15px] focus:ring-[#0039A6] focus:border-[#0039A6] font-normal"
                        />
                    </div>

                    {/* Digital Signature Section */}
                    <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-[#0039A6]" />
                                <Label className="text-[14px] font-normal text-gray-800 dark:text-gray-200">
                                    Confirmar com seu PIN de assinatura
                                </Label>
                            </div>
                            {isSigned && (
                                <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none font-normal px-3 py-1 rounded-full text-xs">
                                    Documento autenticado
                                </Badge>
                            )}
                        </div>

                        {!isSigned ? (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    type="password"
                                    placeholder="Confirmar com seu PIN (1234)"
                                    maxLength={6}
                                    value={pin}
                                    onChange={(e) => {
                                        setPin(e.target.value)
                                        setPinError(false)
                                    }}
                                    className={`h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] font-normal flex-1 ${pinError ? 'border-red-500/50' : ''}`}
                                />
                                <Button
                                    type="button"
                                    onClick={handleSign}
                                    className="h-12 rounded-[12px] bg-[#0039A6] hover:bg-[#1d3b2e] border border-[#2d5a46] text-white transition-all px-6 font-normal shrink-0"
                                >
                                    Validar assinatura
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-[#0039A6]/5 dark:bg-[#0039A6]/10 border border-[#0039A6]/10 dark:border-[#0039A6]/30 rounded-[14px] p-4 flex items-center justify-between animate-in fade-in zoom-in duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-[#0039A6]/10 dark:bg-[#0039A6]/20 flex items-center justify-center">
                                        <Check className="h-5 w-5 text-[#0039A6]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-normal text-gray-900 dark:text-white">Certificado e-CPF v3 ativo</p>
                                        <p className="text-[11px] text-app-text-muted dark:text-app-text-muted font-normal">Assinado eletronicamente por Dr. Adelmo Silva</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="h-12 w-12 bg-white dark:bg-white/10 p-1 rounded-lg border border-gray-100 dark:border-gray-800">
                                        <div className="w-full h-full bg-app-bg-secondary dark:bg-app-bg-dark rounded flex items-center justify-center opacity-40">
                                            <div className="grid grid-cols-2 gap-0.5">
                                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                                                <div className="w-1.5 h-1.5 bg-gray-400"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {pinError && !isSigned && (
                            <p className="text-red-500 text-xs font-normal animate-in fade-in pl-1">PIN incorreto. Tente '1234'.</p>
                        )}
                    </div>
                </div>

                {/* Footer with Actions */}
                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between w-full border-t border-gray-100 dark:border-gray-800 pt-5">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full sm:w-auto h-12 rounded-[12px] font-normal text-gray-700 dark:text-white/80 hover:bg-app-bg-secondary dark:hover:bg-white/5 border border-app-border dark:border-app-border-dark"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full sm:w-auto px-8 h-12 bg-[#0039A6] hover:bg-[#1d3b2e] border border-[#2d5a46] text-white rounded-[12px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                        onClick={onClose}
                    >
                        <FileText className="h-4 w-4" />
                        Finalizar prescrição
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

