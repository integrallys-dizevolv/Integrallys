import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Dialog"
import { X } from "lucide-react"

interface Paciente {
    id: number
    nome: string
    idade: number
    dataNascimento: string
    cpf: string
    plano: string
    ultimaConsulta: string
    status: 'Ativo' | 'Inativo'
    telefone: string
    email: string
    endereco: string
    condicoesMedicas?: string
    historicoRecente?: string
}

interface FichaPacienteModalProps {
    isOpen: boolean
    onClose: () => void
    paciente: Paciente | null
}

export function FichaPacienteModal({ isOpen, onClose, paciente }: FichaPacienteModalProps) {
    if (!paciente) return null;

    const condicoesMedicas = paciente.condicoesMedicas || 'Sem condições registradas';
    const historicoRecente =
        paciente.historicoRecente || 'Sem histórico clínico complementar registrado.';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton={true}
                className="sm:max-w-[600px] p-0 rounded-[14px] overflow-hidden border-none shadow-2xl"
            >
                <div className="bg-white dark:bg-app-card-dark p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-normal text-gray-900 dark:text-white leading-tight">
                                Ficha do paciente
                            </h2>
                            <p className="text-app-text-muted dark:text-app-text-muted text-base">
                                Visualize todas as informações do paciente selecionado.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                        >
                            <X className="h-4 w-4 text-app-text-muted" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        {/* Nome */}
                        <div className="md:col-span-2 space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Nome completo</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.nome}</p>
                        </div>

                        {/* Idade e Data de Nascimento na mesma linha */}
                        <div className="space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Idade</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.idade} anos</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Data de nascimento</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}</p>
                        </div>

                        {/* Telefone e Email */}
                        <div className="space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Telefone</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.telefone}</p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Email</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.email}</p>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">CPF</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.cpf}</p>
                        </div>

                        {/* Endereço */}
                        <div className="md:col-span-2 space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Endereço</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.endereco}</p>
                        </div>

                        {/* Plano de Saúde */}
                        <div className="md:col-span-2 space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Plano de saúde</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.plano}</p>
                        </div>

                        {/* Condições Médicas */}
                        <div className="md:col-span-2 space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Condições médicas</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{condicoesMedicas}</p>
                        </div>

                        {/* Última Consulta */}
                        <div className="md:col-span-2 space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Última consulta</h4>
                            <p className="text-lg text-gray-700 dark:text-white/80">{paciente.ultimaConsulta}</p>
                        </div>

                        {/* Histórico Recente */}
                        <div className="md:col-span-2 space-y-1">
                            <h4 className="text-sm font-normal text-gray-900 dark:text-white tracking-wider opacity-80">Histórico recente</h4>
                            <p className="text-base text-gray-600 dark:text-app-text-muted leading-relaxed italic">
                                "{historicoRecente}"
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
