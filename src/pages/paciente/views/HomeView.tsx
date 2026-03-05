import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, Calendar, History, FileText, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import type { PatientAppointment, PatientHistoryItem } from '@/types'

interface HomeViewProps {
    onPageChange: (page: string) => void
    mockHistorico: PatientHistoryItem[]
    mockAgendamentos: PatientAppointment[]
}

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/Breadcrumb'
import { MOCK_PATIENT_PROFILE } from '@/mocks/paciente/perfil'
import {
    CLINIC_PATIENT_ALERT_STORAGE_KEY,
    DEFAULT_PATIENT_HOME_ALERT
} from '@/mocks/shared/clinicConfig'

export function HomeView({ onPageChange, mockHistorico, mockAgendamentos }: HomeViewProps) {
    const firstName = MOCK_PATIENT_PROFILE.name.split(' ')[0]
    const nextAppointment = mockAgendamentos[0]
    const lastAppointment = mockHistorico[0]
    const [alertConfig, setAlertConfig] = useState(DEFAULT_PATIENT_HOME_ALERT)

    useEffect(() => {
        const stored = localStorage.getItem(CLINIC_PATIENT_ALERT_STORAGE_KEY)
        if (!stored) return
        try {
            const parsed = JSON.parse(stored)
            if (parsed?.title && parsed?.message) {
                setAlertConfig({
                    title: String(parsed.title),
                    message: String(parsed.message)
                })
            }
        } catch {
            // ignore invalid storage
        }
    }, [])

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Início</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Welcome Card */}
            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 rounded-[14px]">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Olá, {firstName}! 👋</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Bem-vinda de volta ao seu portal de saúde. Aqui você pode gerenciar suas consultas, acessar prescrições e muito mais.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alert */}
            {alertConfig?.message && (
                <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 border-l-4 border-l-orange-500 rounded-[14px]">
                    <CardContent className="p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                            <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                                {alertConfig.title}
                            </h3>
                            <p className="text-sm text-orange-800 dark:text-orange-200">
                                {alertConfig.message}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-[14px]"
                    onClick={() => onPageChange('agenda')}
                >
                    <CardContent className="p-6 flex items-start space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-[10px] text-blue-600 dark:text-blue-400">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Próxima Consulta</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Agendada</p>
                            <p className="font-medium text-gray-900 dark:text-gray-200">{nextAppointment?.medico || 'Nenhuma'}</p>
                            <p className="text-sm text-gray-500">{nextAppointment?.especialidade}</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{nextAppointment?.data}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-[14px]"
                    onClick={() => onPageChange('historico')}
                >
                    <CardContent className="p-6 flex items-start space-x-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-[10px] text-emerald-600 dark:text-emerald-400">
                            <History className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Última Consulta</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Concluída</p>
                            <p className="font-medium text-gray-900 dark:text-gray-200">{lastAppointment?.medico || 'Nenhuma'}</p>
                            <p className="text-sm text-gray-500">{lastAppointment?.especialidade}</p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">{lastAppointment?.data}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-[14px]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-[10px] text-orange-600 dark:text-orange-400">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Notificações</h3>
                                <p className="text-sm text-gray-500">3 novas</p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Resultado de exame disponível
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Lembrete: Consulta amanhã
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Nova prescrição disponível
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Recent History Table */}
            <Card className="rounded-[14px]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Histórico de Consultas Realizadas</CardTitle>
                    <Button

                        className="whitespace-nowrap shrink-0 h-10 px-4 bg-[#0039A6] text-white "
                        onClick={() => onPageChange('historico')}
                    >
                        Ver Todo o Histórico

                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Procedimento</TableHead>
                                <TableHead>Especialista</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockHistorico.slice(0, 3).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.data}</TableCell>
                                    <TableCell>{item.especialidade}</TableCell>
                                    <TableCell>{item.medico}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card
                        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-gray-800 rounded-[14px]"
                        onClick={() => onPageChange('agenda')}
                    >
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-[#0039A6] rounded-[10px] text-white">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Ver Agenda</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Marque novas consultas</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-gray-800 rounded-[14px]"
                        onClick={() => onPageChange('prescricoes')}
                    >
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-[#0039A6] rounded-[10px] text-white">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Consultar Prescrições</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receitas e exames</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-gray-800 rounded-[14px]"
                        onClick={() => onPageChange('configuracoes')}
                    >
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-[#0039A6] rounded-[10px] text-white">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Atualizar Dados</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mantenha seu cadastro em dia</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
