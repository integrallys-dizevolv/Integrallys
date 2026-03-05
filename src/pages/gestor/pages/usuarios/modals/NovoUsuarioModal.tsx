import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'

interface NovoUsuarioModalProps {
    isOpen: boolean
    onClose: () => void
}

export const NovoUsuarioModal = ({ isOpen, onClose }: NovoUsuarioModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] w-full gap-0 overflow-hidden rounded-[24px]">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-bold">Novo Usuário</DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5">
                        Preencha os dados abaixo para cadastrar um novo usuário no sistema.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-[#101828] dark:text-white">Nome Completo</Label>
                        <Input
                            placeholder="Digite o nome completo"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-[#101828] dark:text-white">E-mail</Label>
                        <Input
                            type="email"
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-[#101828] dark:text-white">Perfil</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione o perfil" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="administrador">Administrador</SelectItem>
                                <SelectItem value="medico">Médico</SelectItem>
                                <SelectItem value="especialista">Especialista</SelectItem>
                                <SelectItem value="recepcionista">Recepcionista</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-[#101828] dark:text-white">Unidade Vinculada</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione a unidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="central">Clínica Central</SelectItem>
                                <SelectItem value="norte">Unidade Norte</SelectItem>
                                <SelectItem value="sul">Unidade Sul</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-[#101828] dark:text-white">Conselho de Classe (se aplicável)</Label>
                        <Input
                            placeholder="Ex: CRM, CRO, CREFITO, CRTH, CRP"
                        />
                        <p className="text-[11px] text-app-text-muted mt-1">
                            Obrigatório para profissionais da saúde (CRM, CRO, CREFITO, CRTH, CRP, etc)
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-semibold text-[#101828] dark:text-white">UF do Conselho (se aplicável)</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sp">SP - São Paulo</SelectItem>
                                <SelectItem value="rj">RJ - Rio de Janeiro</SelectItem>
                                <SelectItem value="mg">MG - Minas Gerais</SelectItem>
                                <SelectItem value="rs">RS - Rio Grande do Sul</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="px-6 py-6 shrink-0 gap-3 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-11 px-6 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-11 px-8 rounded-lg bg-[#0039A6] hover:bg-[#1d3b2e] text-white shadow-sm font-medium"
                    >
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

