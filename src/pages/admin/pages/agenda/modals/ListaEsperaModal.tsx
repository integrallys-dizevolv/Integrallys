import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Users, Search, Plus, Clock, MoreVertical, Phone, ArrowLeft, Calendar, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface WaitlistItem {
    id: number;
    paciente: string;
    telefone: string;
    procedimento: string;
    preferencia: string;
    dataCadastro: string;
}

const MOCK_WAITLIST: WaitlistItem[] = [
    { id: 1, paciente: "Carla Ferreira", telefone: "(11) 98877-6655", procedimento: "Limpeza", preferencia: "Manhã", dataCadastro: "2026-02-08" },
    { id: 2, paciente: "Marcos Souza", telefone: "(11) 97766-5544", procedimento: "Avaliação", preferencia: "Qualquer horário", dataCadastro: "2026-02-09" },
    { id: 3, paciente: "Juliana Lima", telefone: "(11) 96655-4433", procedimento: "Clareamento", preferencia: "Tarde/Noite", dataCadastro: "2026-02-10" },
];

export function ListaEsperaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState<'list' | 'add'>('list');

    // Form states
    const [formData, setFormData] = useState({
        paciente: '',
        telefone: '',
        procedimento: '',
        preferencia: 'qualquer'
    });

    const handleAddPatient = () => {
        if (!formData.paciente || !formData.telefone) {
            toast.error('Preencha pelo menos o nome e o telefone.');
            return;
        }
        toast.success('Paciente adicionado à lista de espera!');
        setView('list');
        setFormData({ paciente: '', telefone: '', procedimento: '', preferencia: 'qualquer' });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                setView('list');
                onClose();
            }
        }}>
            <DialogContent className="max-w-[700px] bg-app-card dark:bg-app-bg-dark p-0 overflow-hidden border-app-border dark:border-gray-800 shadow-2xl">

                {view === 'list' ? (
                    <>
                        <DialogHeader className="p-6 pb-4 border-b border-app-border dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800/50 shadow-sm">
                                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white">Lista de Espera</DialogTitle>
                                        <DialogDescription className="text-xs text-app-text-secondary dark:text-app-text-muted">Gerencie pacientes aguardando por desistências.</DialogDescription>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-6 space-y-5">
                            {/* Busca */}
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted group-focus-within:text-[#0039A6] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar paciente na lista..."
                                    className="w-full h-11 pl-11 pr-4 bg-app-bg-secondary dark:bg-app-bg-dark border border-app-border dark:border-gray-700 rounded-[12px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0039A6] focus:border-[#0039A6] transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Tabela de Espera */}
                            <div className="border border-app-border dark:border-gray-800 rounded-[14px] overflow-hidden bg-white dark:bg-app-bg-dark/20">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-app-bg-secondary/50 dark:bg-app-bg-dark/50 text-[11px] uppercase tracking-wider text-app-text-secondary dark:text-app-text-muted font-semibold">
                                            <th className="p-4 border-b border-app-border dark:border-gray-800">Paciente</th>
                                            <th className="p-4 border-b border-app-border dark:border-gray-800">Preferência</th>
                                            <th className="p-4 border-b border-app-border dark:border-gray-800">Cadastro</th>
                                            <th className="p-4 border-b border-app-border dark:border-gray-800 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {MOCK_WAITLIST.map((item) => (
                                            <tr key={item.id} className="border-b border-app-border dark:border-gray-800 last:border-0 hover:bg-app-bg-secondary/40 dark:hover:bg-gray-800/30 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-medium text-app-text-primary dark:text-white group-hover:text-[#0039A6] transition-colors">{item.paciente}</div>
                                                    <div className="text-[11px] text-app-text-muted flex items-center gap-1.5 mt-0.5">
                                                        <Phone size={10} className="text-gray-400" /> {item.telefone}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className="font-normal border-blue-100 text-[#0039A6] bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-900/30 rounded-full px-3 py-0.5">
                                                        {item.preferencia}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-xs text-app-text-secondary dark:text-app-text-muted">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        {new Date(item.dataCadastro).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button className="p-2 hover:bg-[#0039A6] hover:text-white text-[#0039A6] bg-blue-50 dark:bg-blue-900/20 dark:hover:bg-[#0039A6] rounded-lg transition-all shadow-sm" title="Agendar agora">
                                                            <Clock size={16} />
                                                        </button>
                                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-app-text-secondary rounded-lg transition-colors border border-transparent hover:border-app-border">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-app-bg-secondary/30 dark:bg-app-bg-dark/50 border-t border-app-border dark:border-gray-800 flex flex-col sm:flex-row justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setView('list');
                                    onClose();
                                }}
                                className="h-10 px-8 rounded-[12px] border-app-border dark:border-gray-700 font-medium text-app-text-primary dark:text-white bg-white dark:bg-transparent shadow-sm hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                                Fechar
                            </Button>
                            <Button
                                onClick={() => setView('add')}
                                className="bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[12px] h-10 px-6 gap-2 shadow-sm transition-all whitespace-nowrap"
                            >
                                <Plus size={18} />
                                <span>Adicionar à lista</span>
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader className="p-6 pb-4 border-b border-app-border dark:border-gray-800">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setView('list')}
                                    className="rounded-full h-10 w-10 hover:bg-app-bg-secondary dark:hover:bg-white/5"
                                >
                                    <ArrowLeft size={20} className="text-app-text-primary dark:text-white" />
                                </Button>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                                        <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white">Adicionar à lista</DialogTitle>
                                        <DialogDescription className="text-xs text-app-text-secondary dark:text-app-text-muted">Preencha os dados do paciente para a lista de espera.</DialogDescription>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-sm font-medium text-app-text-primary dark:text-white">Nome do Paciente</Label>
                                    <Input
                                        placeholder="Ex: João Silva"
                                        className="h-11 rounded-[10px]"
                                        value={formData.paciente}
                                        onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-app-text-primary dark:text-white">Telefone/WhatsApp</Label>
                                    <Input
                                        placeholder="(00) 00000-0000"
                                        className="h-11 rounded-[10px]"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-app-text-primary dark:text-white">Procedimento</Label>
                                    <Input
                                        placeholder="Ex: Limpeza, Avaliação..."
                                        className="h-11 rounded-[10px]"
                                        value={formData.procedimento}
                                        onChange={(e) => setFormData({ ...formData, procedimento: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <Label className="text-sm font-medium text-app-text-primary dark:text-white">Preferência de Horário</Label>
                                    <Select
                                        value={formData.preferencia}
                                        onValueChange={(val) => setFormData({ ...formData, preferencia: val })}
                                    >
                                        <SelectTrigger className="h-11 rounded-[10px] border-app-border">
                                            <SelectValue preferPlaceholder placeholder="Selecione a preferência" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="qualquer">Qualquer horário</SelectItem>
                                            <SelectItem value="manha">Período da Manhã</SelectItem>
                                            <SelectItem value="tarde">Período da Tarde</SelectItem>
                                            <SelectItem value="noite">Período da Noite</SelectItem>
                                            <SelectItem value="especifico">Horário Específico</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-[12px] flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                    <Users size={16} className="text-[#0039A6]" />
                                </div>
                                <p className="text-xs text-[#0039A6] leading-relaxed">
                                    O paciente será notificado automaticamente pela nossa equipe assim que houver uma desistência no período selecionado ou se um novo horário for aberto.
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="p-6 bg-app-bg-secondary/30 dark:bg-app-bg-dark/50 border-t border-app-border dark:border-gray-800 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setView('list')}
                                className="h-11 px-6 rounded-[10px]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleAddPatient}
                                className="bg-[#0039A6] hover:bg-[#002d82] text-white rounded-[10px] h-11 px-8 gap-2 shadow-sm font-medium"
                            >
                                Confirmar Cadastro
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}



