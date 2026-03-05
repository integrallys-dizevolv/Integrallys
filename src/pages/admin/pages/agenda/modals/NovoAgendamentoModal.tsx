import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Clock, User, FileText, Activity } from 'lucide-react';

interface NovoAgendamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedTime?: string | null;
    currentDate?: Date;
    professionals?: string[];
    onSubmit?: (data: {
        paciente: string;
        profissional: string;
        data: string;
        horario: string;
        tipo: string;
        observacoes: string;
    }) => void;
}

export function NovoAgendamentoModal({
    isOpen,
    onClose,
    preSelectedTime,
    currentDate,
    professionals = [],
    onSubmit
}: NovoAgendamentoModalProps) {
    const [paciente, setPaciente] = useState('');
    const [profissional, setProfissional] = useState('');
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [tipo, setTipo] = useState('consulta');
    const [observacoes, setObservacoes] = useState('');
    const professionalOptions = professionals.length > 0 ? professionals : [
        'Dr. João Santos',
        'Dra. Ana Lima',
        'Dra. Flávia Alves'
    ];

    // Pre-fill data when modal opens or props change
    useEffect(() => {
        if (isOpen) {
            if (currentDate) {
                // Format YYYY-MM-DD for input type="date"
                const formattedDate = currentDate.toISOString().split('T')[0];
                setData(formattedDate);
            }
            if (preSelectedTime) {
                setHorario(preSelectedTime);
            }
        }
    }, [isOpen, currentDate, preSelectedTime]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paciente.trim() || !profissional || !data || !horario) {
            return;
        }

        onSubmit?.({
            paciente: paciente.trim(),
            profissional,
            data,
            horario,
            tipo,
            observacoes: observacoes.trim(),
        });

        onClose();
        // Reset form
        setPaciente('');
        setProfissional('');
        setTipo('consulta');
        setObservacoes('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark rounded-[14px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-normal">Novo Agendamento</DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5">
                        Preencha os dados abaixo para realizar o agendamento.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5 pb-8">

                    {/* Paciente */}
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">Paciente</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-app-text-muted z-10" />
                            <Input
                                placeholder="Nome do paciente"
                                value={paciente}
                                onChange={(e) => setPaciente(e.target.value)}
                                className="pl-11 h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark relative"
                            />
                        </div>
                    </div>

                    {/* Profissional */}
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">Profissional</Label>
                        <Select value={profissional} onValueChange={setProfissional}>
                            <SelectTrigger className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                <SelectValue preferPlaceholder placeholder="Selecione o profissional" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[10px]">
                                {professionalOptions.map((prof) => (
                                    <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Data e Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                        <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">
                            Data
                        </Label>
                            <Input type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark relative"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-2 text-[13px] font-normal text-gray-700 dark:text-white/80">
                                <Clock className="h-4 w-4 text-[#0039A6]" /> Horário
                            </Label>
                            <Input
                                type="time"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark relative"
                            />
                        </div>
                    </div>

                    {/* Tipo de Agendamento */}
                    <div className="space-y-1.5">
                        <Label className="flex items-center gap-2 text-[13px] font-normal text-gray-700 dark:text-white/80">
                            <Activity className="h-4 w-4 text-[#0039A6]" /> Tipo
                        </Label>
                        <Select value={tipo} onValueChange={setTipo}>
                            <SelectTrigger className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                <SelectValue preferPlaceholder placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[10px]">
                                <SelectItem value="consulta">Consulta</SelectItem>
                                <SelectItem value="exame">Exame</SelectItem>
                                <SelectItem value="retorno">Retorno</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Observações */}
                    <div className="space-y-1.5">
                        <Label className="text-[13px] font-normal text-gray-700 dark:text-white/80">Observações</Label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-5 w-5 text-app-text-muted z-10" />
                            <Textarea
                                placeholder="Detalhes adicionais..."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                className="pl-11 py-3 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-bg-dark min-h-[100px] resize-none border-app-border dark:border-app-border-dark"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2 gap-3 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto h-11 px-6 rounded-[10px] border-app-border text-gray-700 dark:text-gray-300 hover:bg-app-bg-secondary dark:hover:bg-app-card/5"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#002d82] text-white shadow-sm font-normal"
                        >
                            Agendar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}



