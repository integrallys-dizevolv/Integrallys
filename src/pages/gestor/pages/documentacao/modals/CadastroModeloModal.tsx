import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/Select';
import { Save, X, Plus, Info, Lightbulb } from 'lucide-react';

interface CadastroModeloModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDocument: {
        id: number;
        nome: string;
        categoria: string;
        desc: string;
        template?: string;
    } | null;
}

export function CadastroModeloModal({ open, onOpenChange, selectedDocument }: CadastroModeloModalProps) {
    const [formData, setFormData] = useState({
        nome: '',
        categoria: '',
        desc: '',
        template: ''
    });

    useEffect(() => {
        if (selectedDocument) {
            setFormData({
                nome: selectedDocument.nome,
                categoria: selectedDocument.categoria,
                desc: selectedDocument.desc,
                template: selectedDocument.template || ''
            });
        } else {
            setFormData({ nome: '', categoria: '', desc: '', template: '' });
        }
    }, [selectedDocument, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-full p-0 overflow-hidden rounded-[32px] border-none bg-app-card dark:bg-[#0c1e3d] shadow-2xl">
                <DialogHeader className="px-10 pt-10 pb-6 bg-app-bg-secondary/50 dark:bg-app-card/5">
                    <DialogTitle className="text-2xl font-medium text-[#101828] dark:text-white leading-none">
                        {selectedDocument ? 'Editar Modelo' : 'Novo Modelo de Documento'}
                    </DialogTitle>
                    <p className="text-sm text-app-text-muted dark:text-app-text-muted mt-2 font-normal">
                        Configure os detalhes técnicos do seu documento clínico.
                    </p>
                </DialogHeader>

                <div className="p-10 space-y-8 bg-app-card dark:bg-[#0c1e3d] max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-app-text-muted uppercase tracking-wider ml-1">Nome do Modelo</label>
                            <Input
                                placeholder="Ex: Atestado de Comparecimento"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                className="h-12 rounded-xl bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-app-text-muted uppercase tracking-wider ml-1">Categoria</label>
                            <Select
                                value={formData.categoria}
                                onValueChange={(val) => setFormData({ ...formData, categoria: val })}
                            >
                                <SelectTrigger className="h-12 rounded-xl bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark">
                                    <SelectValue preferPlaceholder placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 dark:border-app-border-dark bg-app-card dark:bg-[#0c1e3d]">
                                    <SelectItem value="Atestado">Atestado</SelectItem>
                                    <SelectItem value="Declaracao">Declaração</SelectItem>
                                    <SelectItem value="Relatorio">Relatório</SelectItem>
                                    <SelectItem value="Receituario">Receituário</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-app-text-muted uppercase tracking-wider ml-1">Descrição Curta</label>
                        <Input
                            placeholder="Descreva brevemente a finalidade deste modelo..."
                            value={formData.desc}
                            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                            className="h-12 rounded-xl bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700 dark:text-white ml-1">Template do Documento *</label>

                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100/50 dark:border-blue-500/10 flex gap-3 items-center">
                            <Lightbulb size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Use as variáveis entre chaves duplas: <code className="font-bold">{"{{ nomeCompleto }}, {{ cpf }}, {{ dataAtendimento }}"}</code>, etc.
                            </p>
                        </div>

                        <Textarea
                            placeholder="Digite o template do documento aqui..."
                            value={formData.template}
                            onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                            className="min-h-[200px] rounded-xl bg-app-bg-secondary/50 dark:bg-app-card/5 border-gray-100 dark:border-app-border-dark p-4 resize-none focus:ring-1 focus:ring-[#1F382C]"
                        />
                    </div>
                </div>
                <DialogFooter className="px-6 py-6 sm:px-10 sm:py-8 bg-app-bg-secondary/50 dark:bg-app-card/5 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-12 w-full sm:w-auto px-8 rounded-xl border-app-border dark:border-app-border-dark text-app-text-muted dark:text-app-text-muted font-medium hover:bg-app-bg-secondary dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-12 w-full sm:w-auto px-8 rounded-xl bg-[#1F382C] hover:bg-[#15251f] text-white font-medium flex gap-2 items-center justify-center"
                    >
                        <Save size={18} /> Salvar Modelo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

