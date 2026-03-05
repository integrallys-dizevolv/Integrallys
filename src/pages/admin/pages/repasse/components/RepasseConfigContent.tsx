import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
    MoreVertical,
    Plus,
    Edit2,
    Trash2
} from 'lucide-react';
import { mockRepasseConfigs } from '@/mocks/admin/repasse';

export const RepasseConfigContent = () => {
    const [configs] = useState(mockRepasseConfigs);

    const getTipoVinculoBadge = (tipo: string) => {
        if (tipo === 'Parceiro') {
            return (
                <Badge className="bg-orange-600 dark:bg-orange-500 text-white border-transparent font-normal rounded-full px-4 py-1 whitespace-nowrap text-[11px] shadow-sm">
                    Parceiro
                </Badge>
            );
        }
        return (
            <Badge className="bg-emerald-600 dark:bg-emerald-500 text-white border-transparent font-normal rounded-full px-4 py-1 whitespace-nowrap text-[11px] shadow-sm">
                Colaborador
            </Badge>
        );
    };

    const getTipoBadge = (tipo: string) => {
        if (tipo === 'Percentual') {
            return (
                <Badge className="bg-blue-600 dark:bg-blue-500 text-white border-transparent font-normal rounded-full px-4 py-1 whitespace-nowrap text-[11px] shadow-sm">
                    Percentual
                </Badge>
            );
        }
        return (
            <Badge className="bg-purple-600 dark:bg-purple-500 text-white border-transparent font-normal rounded-full px-4 py-1 whitespace-nowrap text-[11px] shadow-sm">
                Valor fixo
            </Badge>
        );
    };

    return (
        <Card className="border-app-border/60 dark:border-app-border-dark overflow-hidden rounded-2xl shadow-sm bg-app-card dark:bg-app-bg-dark animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-gray-100 dark:border-app-border-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-normal text-app-text-primary dark:text-white">
                    Configuração de repasse por especialista
                </h3>
                <Button className="h-10 px-6 bg-[#0039A6] hover:bg-[#1a3329] text-white font-normal rounded-xl flex items-center gap-2 shadow-sm shrink-0">
                    <Plus size={18} /> Adicionar especialista
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-app-bg-secondary/50 dark:bg-app-card/5">
                        <TableRow className="hover:bg-transparent border-gray-100 dark:border-app-border-dark">
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Especialista</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Especialidade</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Unidade</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Vínculo</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Tipo de repasse</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider whitespace-nowrap">Valor / taxa</TableHead>
                            <TableHead className="px-6 py-4 text-xs font-normal text-app-text-secondary dark:text-app-text-muted uppercase tracking-wider text-right whitespace-nowrap">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {configs.map((row) => (
                            <TableRow key={row.id} className="group hover:bg-app-bg-secondary/50 dark:hover:bg-app-card/5 transition-colors border-gray-100 dark:border-app-border-dark">
                                <TableCell className="px-6 py-4 font-normal text-app-text-primary dark:text-white whitespace-nowrap">
                                    {row.especialista}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-[#7C8DB5]/90 dark:text-blue-400/70 text-sm whitespace-nowrap font-normal">
                                    {row.especialidade}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-app-text-secondary dark:text-app-text-muted text-sm whitespace-nowrap font-normal">
                                    {row.unidade}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {getTipoVinculoBadge(row.tipoVinculo)}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    {getTipoBadge(row.tipo)}
                                </TableCell>
                                <TableCell className="px-6 py-4 font-normal text-app-text-primary dark:text-white whitespace-nowrap">
                                    {row.valor}
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-lg hover:bg-app-card hover:shadow-sm dark:hover:bg-app-card/10"
                                            >
                                                <MoreVertical className="h-5 w-5 text-app-text-secondary dark:text-app-text-muted" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-app-border dark:border-app-border-dark shadow-lg dark:bg-app-card-dark">
                                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-app-bg-secondary dark:hover:bg-app-card/10 transition-colors font-normal text-sm">
                                                <Edit2 size={16} className="text-app-text-muted" />
                                                <span>Editar regra</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-normal text-sm text-red-600 dark:text-red-400">
                                                <Trash2 size={16} />
                                                <span>Remover</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    );
};
