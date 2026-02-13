import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react'

import { PageHeader } from '../ui/PageHeader'
import { MOCK_KPI_DATA, MOCK_RECENT_PATIENTS } from '@/mocks/especialista/dashboard'

interface DashboardViewProps {
    onPageChange: (page: string) => void
}

export function DashboardView({ onPageChange }: DashboardViewProps) {


    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <PageHeader
                title="Dashboard"
                subtitle="Visão geral do sistema e indicadores de desempenho"
                onPageChange={onPageChange}
                breadcrumbs={[]}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MOCK_KPI_DATA.map((kpi, index) => (
                    <Card key={index} className="p-6 rounded-[14px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className="font-normal text-gray-700 dark:text-white/80">
                                {kpi.title.charAt(0).toUpperCase() + kpi.title.slice(1).toLowerCase()}
                            </span>
                            <kpi.icon className="h-5 w-5 text-app-text-muted" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-normal text-gray-900 dark:text-white">{kpi.value}</h3>
                            <p className="text-sm text-app-text-muted dark:text-app-text-muted">{kpi.subtitle}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Patients Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-normal text-gray-900 dark:text-white">Últimos pacientes atendidos</h3>

                <div className="flex flex-col gap-3">
                    {MOCK_RECENT_PATIENTS.map((patient) => (
                        <div
                            key={patient.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-app-card-dark rounded-[12px] border border-gray-100 dark:border-app-border-dark transition-all duration-300 hover:scale-[1.01] hover:shadow-sm group cursor-pointer"
                        >
                            {/* Lado Esquerdo (Info) */}
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-white/10 flex items-center justify-center text-emerald-700 dark:text-white/80 font-normal text-sm">
                                    {patient.initials}
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-normal text-gray-900 dark:text-white leading-tight">
                                        {patient.name}
                                    </p>
                                    <p className="text-xs text-app-text-muted dark:text-app-text-muted">
                                        {patient.type.charAt(0).toUpperCase() + patient.type.slice(1).toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Lado Direito (Horário e Status) */}
                            <div className="flex flex-col items-end justify-between gap-1 shrink-0">
                                <span className="text-sm font-normal text-gray-900 dark:text-white">
                                    {patient.time}
                                </span>
                                <Badge
                                    className={`
                                        rounded-full text-[10px] font-normal border-none px-3 py-0.5 whitespace-nowrap shadow-sm text-white
                                        ${patient.status === 'Concluída'
                                            ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100'
                                            : 'bg-blue-600 dark:bg-blue-900/40 dark:text-blue-100'
                                        }
                                    `}
                                >
                                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1).toLowerCase()}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
