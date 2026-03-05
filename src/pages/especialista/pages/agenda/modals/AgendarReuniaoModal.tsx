import { Button } from '@/components/ui/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { DateInput } from '@/components/ui/DateInput'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select"
import { Clock, MapPin, Users, Info, X } from 'lucide-react'
import { Appointment } from '@/mocks/especialista/agenda'
import { useState } from 'react'

interface AgendarReuniaoModalProps {
    isOpen: boolean
    onClose: () => void
    appointment?: Appointment | null
}

export function AgendarReuniaoModal({ isOpen, onClose, appointment }: AgendarReuniaoModalProps) {
    const isEditing = !!appointment
    const [meetingDate, setMeetingDate] = useState('2026-01-14')

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                hideCloseButton={true}
                className="w-[95vw] sm:max-w-[600px] p-8 rounded-[24px] bg-white dark:bg-app-card-dark border-none shadow-2xl gap-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-normal text-gray-900 dark:text-white">
                            {isEditing ? 'Editar compromisso' : 'Agendar nova reunião'}
                        </h2>
                        <p className="text-app-text-muted dark:text-app-text-muted">
                            {isEditing ? 'Atualize os detalhes do seu compromisso' : 'Crie um novo compromisso na sua agenda pessoal'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-app-border dark:border-app-border-dark bg-white dark:bg-transparent hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-colors shrink-0"
                    >
                        <X className="h-4 w-4 text-app-text-muted" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Título */}
                    <div className="space-y-2">
                        <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                            Título da reunião *
                        </Label>
                        <Input
                            defaultValue={appointment?.title}
                            placeholder="Ex: Reunião com equipe de TI"
                            className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark focus:ring-[#0039A6] focus:border-[#0039A6] px-5"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Tipo */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Tipo de compromisso *
                            </Label>
                            <Select defaultValue={appointment?.type}>
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark">
                                    <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="administrativo">Administrativo</SelectItem>
                                    <SelectItem value="consulta">Consulta</SelectItem>
                                    <SelectItem value="reuniao">Reunião</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Status *
                            </Label>
                            <Select defaultValue={appointment?.status || 'agendado'}>
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark">
                                    <SelectValue preferPlaceholder placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="agendado">Agendado</SelectItem>
                                    <SelectItem value="confirmado">Confirmado</SelectItem>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="concluido">Concluído</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Data */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Data *
                            </Label>
                            <DateInput
                                value={meetingDate}
                                onChange={setMeetingDate}
                                className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark pl-4"
                            />
                        </div>

                        {/* Horário */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Horário *
                            </Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    defaultValue={appointment?.time}
                                    placeholder="--:--"
                                    className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark pl-4 pr-10"
                                />
                                <Clock className="absolute right-3 top-3.5 h-5 w-5 text-app-text-muted" />
                            </div>
                        </div>

                        {/* Duração */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Duração *
                            </Label>
                            <Select defaultValue={appointment?.duration}>
                                <SelectTrigger className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark">
                                    <SelectValue preferPlaceholder placeholder="Duração" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30min">30 min</SelectItem>
                                    <SelectItem value="1h">1 hora</SelectItem>
                                    <SelectItem value="2h">2 horas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Local */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Local
                            </Label>
                            <div className="relative">
                                <Input
                                    placeholder="Ex: Sala de Reuniões 1"
                                    className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark pl-4"
                                />
                                <MapPin className="absolute right-3 top-3.5 h-5 w-5 text-app-text-muted" />
                            </div>
                        </div>

                        {/* Participantes */}
                        <div className="space-y-2">
                            <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                Participantes
                            </Label>
                            <div className="relative">
                                <Input
                                    defaultValue={appointment?.patientName}
                                    placeholder="Ex: Equipe TI (5 pessoas)"
                                    className="h-12 rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark pl-4"
                                />
                                <Users className="absolute right-3 top-3.5 h-5 w-5 text-app-text-muted" />
                            </div>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                            Descrição
                        </Label>
                        <Textarea
                            defaultValue={appointment?.description}
                            placeholder="Descreva o objetivo da reunião..."
                            className="min-h-[100px] rounded-[12px] bg-app-bg-secondary dark:bg-black/20 border-app-border dark:border-app-border-dark resize-none p-5"
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 mt-5 sm:mt-2 sm:justify-end">
                    <Button
                        className="w-full sm:w-auto sm:px-10 h-12 bg-app-card-dark hover:bg-[#152520] text-white rounded-[12px] font-normal shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
                        onClick={onClose}
                    >
                        {isEditing ? 'Salvar alterações' : 'Agendar reunião'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto sm:px-10 h-12 rounded-[12px] font-normal text-gray-900 dark:text-gray-100 border-app-border dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-white/5 order-2 sm:order-1"
                    >
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

