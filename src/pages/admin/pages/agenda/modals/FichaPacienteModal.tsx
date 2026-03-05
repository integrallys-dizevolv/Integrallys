import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
    User,
    Phone,
    Mail,
    MapPin,
    Navigation,
    CreditCard,
    Calendar
} from "lucide-react"

import { Patient } from '@/pages/recepcao/context/types'

interface FichaPacienteModalProps {
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
    paciente: Patient | null
}

export function FichaPacienteModal({ isOpen, onClose, onEdit, paciente }: FichaPacienteModalProps) {
    if (!paciente) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[24px]">
                <div className="p-5 md:p-8 space-y-6 md:space-y-8">
                    {/* Header */}
                    <DialogHeader className="px-0 pt-0 pb-0 shrink-0">
                        <DialogTitle className="text-xl md:text-2xl font-normal flex items-center gap-2 text-app-text-primary dark:text-white">
                            <User className="h-5 w-5 md:h-6 md:w-6 text-[#0039A6]" />
                            Ficha do paciente
                        </DialogTitle>
                        <p className="text-[#64748B] dark:text-app-text-muted text-xs md:text-sm font-normal">
                            Visualize as informações completas do paciente
                        </p>
                    </DialogHeader>

                    {/* Profile Card */}
                    <div className="p-4 md:p-6 bg-app-bg-secondary dark:bg-app-card/5 rounded-[20px] border border-gray-100 dark:border-gray-800 flex items-center gap-4 md:gap-5">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-app-card dark:bg-app-bg-dark shadow-sm flex items-center justify-center border border-gray-100 dark:border-app-border-dark shrink-0">
                            <User className="h-6 w-6 md:h-8 md:w-8 text-app-text-muted" />
                        </div>
                        <div className="space-y-0.5 md:space-y-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-normal text-app-text-primary dark:text-white truncate">{paciente.name}</h3>
                            <p className="text-xs md:text-sm font-normal text-app-text-muted">{paciente.age || '---'} • CPF: {paciente.cpf || '---'}</p>
                        </div>
                        <Badge className="ml-auto bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-none px-2.5 py-1 text-[10px] font-normal rounded-lg uppercase tracking-wider shrink-0">
                            Ativo
                        </Badge>
                    </div>

                    {/* Main Content Grid */}
                    <div className="space-y-6 md:space-y-8 max-h-[60vh] md:max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Section: Informações de Contato */}
                        <div className="space-y-4 md:space-y-5">
                            <h4 className="text-sm md:text-[15px] font-normal text-app-text-primary dark:text-white">Informações de contato</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                                        <Mail size={18} />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted uppercase tracking-wider">E-mail</p>
                                        <p className="text-sm font-normal text-[#344054] dark:text-gray-200 truncate">{paciente.email}</p>
                                    </div>
                                </div>
                                {/* Telefone */}
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 shrink-0 shadow-sm">
                                        <Phone size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Telefone</p>
                                        <p className="text-sm font-normal text-[#344054] dark:text-gray-200">{paciente.phone}</p>
                                    </div>
                                </div>
                                {/* Endereço */}
                                <div className="sm:col-span-2 flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shrink-0 shadow-sm">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Endereço</p>
                                        <p className="text-sm font-normal text-[#344054] dark:text-gray-200 leading-snug">
                                            {paciente.address || 'Av. Paulista, 1578 - Apto 501'}
                                        </p>
                                        <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted">Bela Vista, São Paulo/SP - CEP: 01310-100</p>
                                    </div>
                                </div>
                                {/* Origem */}
                                <div className="sm:col-span-2 flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                                        <Navigation size={18} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Origem da indicação</p>
                                        <p className="text-sm font-normal text-[#344054] dark:text-gray-200">{paciente.source || 'Indicação de Paciente'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Plano de Saúde */}
                        <div className="space-y-4 md:space-y-5">
                            <h4 className="text-sm md:text-[15px] font-normal text-app-text-primary dark:text-white">Plano de saúde</h4>
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shrink-0 shadow-sm">
                                    <CreditCard size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Convênio</p>
                                    <p className="text-sm font-normal text-[#344054] dark:text-gray-200">{paciente.plan || '---'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Informações Adicionais */}
                        <div className="space-y-4 md:space-y-5">
                            <h4 className="text-sm md:text-[15px] font-normal text-app-text-primary dark:text-white">Informações adicionais</h4>
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500 shrink-0 shadow-sm">
                                    <Calendar size={18} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] md:text-[11px] font-normal text-app-text-muted uppercase tracking-wider">Última consulta</p>
                                    <p className="text-sm font-normal text-[#344054] dark:text-gray-200">
                                        {paciente.lastVisit ? new Date(paciente.lastVisit).toLocaleDateString('pt-BR') : 'Sem registro'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-5 md:p-8 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:flex-1 h-11 md:h-12 rounded-[12px] font-normal text-[#667085] dark:text-white/80 border-app-border dark:border-gray-800 hover:bg-app-bg-secondary dark:hover:bg-app-card/5 transition-all shadow-sm"
                    >
                        Fechar
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            onEdit();
                        }}
                        className="w-full sm:flex-1 h-11 md:h-12 bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal rounded-[12px] shadow-md shadow-[#0039A6]/10 transition-all active:scale-[0.98]"
                    >
                        Editar paciente
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
