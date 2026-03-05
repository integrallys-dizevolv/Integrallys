import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { History, FileText, Download } from 'lucide-react'
import type { PatientHistoryItem } from '@/types'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'

interface HistoricoViewProps {
    mockHistorico: PatientHistoryItem[]
    onPageChange: (page: string) => void
}

function UsersIcon(props: { className?: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

export function HistoricoView({ mockHistorico, onPageChange }: HistoricoViewProps) {
    const [filtroHistorico, setFiltroHistorico] = useState('todos')



    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Histórico Médico</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Histórico Médico</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total de Atendimentos</p>
                            <p className="text-2xl font-bold">24</p>
                        </div>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <History className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Especialistas Visitados</p>
                            <p className="text-2xl font-bold">8</p>
                        </div>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Documentos Arquivados</p>
                            <p className="text-2xl font-bold">15</p>
                        </div>
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <FileText className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center bg-white dark:bg-[#0c1e3d] p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                <span className="text-sm font-medium">Filtrar por:</span>
                <Select value={filtroHistorico} onValueChange={setFiltroHistorico}>
                    <SelectTrigger className="h-10 w-full sm:w-60 lg:w-72  bg-white dark:bg-[#020817] border-slate-200 dark:border-white/5 rounded-lg">
                        <SelectValue preferPlaceholder placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="consulta">Consultas</SelectItem>
                        <SelectItem value="exame">Exames</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="rounded-[14px] border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <Table className="w-full">
                        <TableHeader className="bg-gray-50 dark:bg-white/5">
                            <TableRow>
                                <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-300 text-sm whitespace-nowrap">Data</TableHead>
                                <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-300 text-sm">Procedimento</TableHead>
                                <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-300 text-sm">Especialista</TableHead>
                                <TableHead className="text-left font-semibold text-gray-700 dark:text-gray-300 text-sm">Local</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm">Status</TableHead>
                                <TableHead className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockHistorico.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{item.data}</TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-400 font-medium">{item.tipo}</TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-400 font-medium">{item.medico}</TableCell>
                                    <TableCell className="py-4 text-gray-600 dark:text-gray-400 font-medium">{item.local || 'Consultório Centro'}</TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex justify-center">
                                            <Badge variant="secondary" className="bg-emerald-100/50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 px-3 font-medium">
                                                Concluída
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-row w-fit pl-0  items-center justify-center gap-2 ">
                                            <Button variant="ghost" size="sm" className="h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap gap-2 flex items-center">
                                                <Download className="h-4 w-4" />
                                                Documentos
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
