import React, { useState } from 'react'
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
import { Textarea } from '@/components/ui/Textarea'
import { Shield, Users, Calendar, FileText, Package, CreditCard, BarChart3, CheckCircle2 } from 'lucide-react'

interface NovoPerfilModalProps {
    isOpen: boolean
    onClose: () => void
}

const permissionsGroups = [
    {
        category: 'Pacientes',
        icon: Users,
        permissions: [
            { id: 'view_patients', label: 'Visualizar Pacientes', description: 'Acessar lista e dados básicos' },
            { id: 'edit_patients', label: 'Editar Pacientes', description: 'Modificar cadastros de pacientes' },
        ]
    },
    {
        category: 'Prontuários',
        icon: FileText,
        permissions: [
            { id: 'view_records', label: 'Visualizar Prontuários', description: 'Ler histórico médico' },
            { id: 'edit_records', label: 'Editar Prontuários', description: 'Adicionar/modificar registros' },
        ]
    },
    {
        category: 'Agenda',
        icon: Calendar,
        permissions: [
            { id: 'view_schedule', label: 'Visualizar Agenda', description: 'Ver compromissos agendados' },
            { id: 'manage_schedule', label: 'Gerenciar Agenda', description: 'Criar e modificar agendamentos' },
        ]
    },
    {
        category: 'Financeiro',
        icon: CreditCard,
        permissions: [
            { id: 'view_billing', label: 'Visualizar Cobranças', description: 'Acessar informações financeiras' },
            { id: 'manage_billing', label: 'Realizar Cobranças', description: 'Efetuar pagamentos e recebimentos' },
        ]
    },
    {
        category: 'Estoque',
        icon: Package,
        permissions: [
            { id: 'view_inventory', label: 'Visualizar Estoque', description: 'Ver produtos e quantidades' },
            { id: 'manage_inventory', label: 'Gerenciar Estoque', description: 'Controlar entradas e saídas' },
        ]
    },
    {
        category: 'Relatórios',
        icon: BarChart3,
        permissions: [
            { id: 'view_reports', label: 'Gerar Relatórios', description: 'Criar e visualizar relatórios' },
        ]
    },
]

export const NovoPerfilModal = ({ isOpen, onClose }: NovoPerfilModalProps) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

    const togglePermission = (permId: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permId)
                ? prev.filter(p => p !== permId)
                : [...prev, permId]
        )
    }

    const toggleAllInGroup = (permissions: { id: string }[]) => {
        const groupIds = permissions.map(p => p.id)
        const allSelected = groupIds.every(id => selectedPermissions.includes(id))

        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(p => !groupIds.includes(p)))
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...groupIds])])
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[600px] w-full gap-0 max-h-[90vh] flex flex-col p-0 rounded-2xl overflow-hidden border-none">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Shield className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-normal text-[#101828] dark:text-white">
                                Novo Perfil de Acesso
                            </DialogTitle>
                            <DialogDescription className="text-sm font-normal text-app-text-muted dark:text-app-text-muted">
                                Defina as permissões e responsabilidades deste perfil
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-6 py-4 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Nome e Descrição */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-normal text-app-text-muted dark:text-app-text-muted">Nome do Perfil *</Label>
                            <Input
                                placeholder="Ex: Enfermeiro, Recepcionista"
                                className="h-11 rounded-xl border-app-border bg-app-card dark:bg-[#020817] dark:border-app-border-dark text-sm placeholder:text-app-text-muted font-normal focus-visible:ring-1 focus-visible:ring-emerald-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-normal text-app-text-muted dark:text-app-text-muted">Descrição</Label>
                            <Textarea
                                placeholder="Descreva brevemente as responsabilidades deste perfil..."
                                className="min-h-[70px] rounded-xl border-app-border bg-app-card dark:bg-[#020817] dark:border-app-border-dark text-sm placeholder:text-app-text-muted focus-visible:ring-1 focus-visible:ring-emerald-500 resize-none font-normal"
                            />
                        </div>
                    </div>

                    {/* Permissões Agrupadas */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-normal text-app-text-muted dark:text-app-text-muted uppercase tracking-wider">
                                Permissões
                            </Label>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-normal">
                                {selectedPermissions.length} selecionadas
                            </span>
                        </div>

                        <div className="space-y-3">
                            {permissionsGroups.map((group) => {
                                const groupIds = group.permissions.map(p => p.id)
                                const selectedCount = groupIds.filter(id => selectedPermissions.includes(id)).length
                                const allSelected = selectedCount === group.permissions.length

                                return (
                                    <div
                                        key={group.category}
                                        className="rounded-xl border border-gray-100 dark:border-app-border-dark overflow-hidden"
                                    >
                                        {/* Category Header */}
                                        <button
                                            onClick={() => toggleAllInGroup(group.permissions)}
                                            className="w-full flex items-center justify-between p-3 bg-app-bg-secondary/50 dark:bg-app-card/5 hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${allSelected
                                                    ? 'bg-emerald-100 dark:bg-emerald-500/20'
                                                    : 'bg-app-bg-secondary dark:bg-app-card/10'
                                                    }`}>
                                                    <group.icon className={`h-4 w-4 ${allSelected
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-app-text-muted dark:text-app-text-muted'
                                                        }`} />
                                                </div>
                                                <span className="text-sm font-normal text-gray-900 dark:text-white">
                                                    {group.category}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-app-text-muted font-normal">
                                                    {selectedCount}/{group.permissions.length}
                                                </span>
                                                {allSelected && (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Permissions List */}
                                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                                            {group.permissions.map((perm) => (
                                                <label
                                                    key={perm.id}
                                                    className={`flex items-center justify-between p-4 cursor-pointer transition-all ${selectedPermissions.includes(perm.id)
                                                        ? 'bg-emerald-50/70 dark:bg-emerald-500/10'
                                                        : 'hover:bg-app-bg-secondary dark:hover:bg-app-card/5'
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <p className={`text-sm font-normal transition-colors ${selectedPermissions.includes(perm.id) ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>
                                                            {perm.label}
                                                        </p>
                                                        <p className="text-xs text-app-text-muted dark:text-app-text-muted font-normal mt-0.5">
                                                            {perm.description}
                                                        </p>
                                                    </div>
                                                    {/* Toggle Switch Style */}
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.includes(perm.id)}
                                                            onChange={() => togglePermission(perm.id)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className={`w-11 h-6 rounded-full transition-all duration-200 ${selectedPermissions.includes(perm.id)
                                                            ? 'bg-emerald-600 dark:bg-emerald-500'
                                                            : 'bg-gray-200 dark:bg-app-card/10'
                                                            }`}>
                                                            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-app-card shadow-md transition-all duration-200 ${selectedPermissions.includes(perm.id)
                                                                ? 'left-[22px]'
                                                                : 'left-0.5'
                                                                }`} />
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-5 shrink-0 gap-3 border-t border-gray-100 dark:border-app-border-dark">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 sm:flex-none h-11 px-6 rounded-xl border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5 font-normal"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1 sm:flex-none h-11 px-8 rounded-xl bg-[#0039A6] hover:bg-[#1d3b2e] text-white shadow-sm font-normal"
                    >
                        Criar Perfil
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
