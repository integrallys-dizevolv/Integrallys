import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import { UserPlus } from 'lucide-react'

interface AdicionarUsuarioModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AdicionarUsuarioModal = ({ isOpen, onClose }: AdicionarUsuarioModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[92%] sm:max-w-[600px] bg-app-card dark:bg-[#0c1e3d] p-0 overflow-hidden rounded-[24px] border-none shadow-2xl">
                <DialogHeader className="p-6 sm:p-8 pb-0">
                    <DialogTitle className="text-xl sm:text-2xl font-black text-[#0039A6] dark:text-white flex items-center gap-2">
                        <UserPlus size={24} className="text-[#0039A6] dark:text-white" />
                        Adicionar Novo Usuário
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                        <Label className="text-sm font-black text-gray-700 dark:text-white/80">Nome Completo *</Label>
                        <Input
                            placeholder="Ex: João da Silva"
                            className="h-12 bg-app-bg-secondary/50 dark:bg-[#020817] border-none rounded-xl focus:ring-2 focus:ring-[#0039A6]/10 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-black text-gray-700 dark:text-white/80">E-mail Corporativo *</Label>
                        <Input
                            type="email"
                            placeholder="joao@integrallys.com"
                            className="h-12 bg-app-bg-secondary/50 dark:bg-[#020817] border-none rounded-xl focus:ring-2 focus:ring-[#0039A6]/10 transition-all font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-black text-gray-700 dark:text-white/80">Perfil de Acesso *</Label>
                            <Select>
                                <SelectTrigger className="h-12 bg-app-bg-secondary/50 dark:bg-[#020817] border-none rounded-xl focus:ring-2 focus:ring-[#0039A6]/10 transition-all">
                                    <SelectValue preferPlaceholder placeholder="Selecione o perfil" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100">
                                    <SelectItem value="medico" className="font-bold">Médico</SelectItem>
                                    <SelectItem value="especialista" className="font-bold">Especialista</SelectItem>
                                    <SelectItem value="admin" className="font-bold">Administrador</SelectItem>
                                    <SelectItem value="recepcionista" className="font-bold">Recepcionista</SelectItem>
                                    <SelectItem value="gestor" className="font-bold">Gestor de Unidade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-black text-gray-700 dark:text-white/80">Unidade Principal *</Label>
                            <Select>
                                <SelectTrigger className="h-12 bg-app-bg-secondary/50 dark:bg-[#020817] border-none rounded-xl focus:ring-2 focus:ring-[#0039A6]/10 transition-all">
                                    <SelectValue preferPlaceholder placeholder="Selecione a unidade" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100">
                                    <SelectItem value="central" className="font-bold">Clínica Central</SelectItem>
                                    <SelectItem value="norte" className="font-bold">Unidade Norte</SelectItem>
                                    <SelectItem value="sul" className="font-bold">Consultório Sul</SelectItem>
                                    <SelectItem value="principal" className="font-bold">Sede Principal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:flex-1 h-12 rounded-xl border-none bg-app-bg-secondary dark:bg-app-card/5 font-black hover:bg-gray-200 dark:hover:bg-app-card/10 text-gray-600 dark:text-app-text-muted transition-all shrink-0"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-full sm:flex-1 h-12 rounded-xl bg-[#0039A6] hover:bg-[#2d523f] text-white font-black shadow-lg shadow-[#0039A6]/20 transition-all shrink-0"
                    >
                        Criar Usuário
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

