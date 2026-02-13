import React from 'react'
import { Building, Users, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface DashboardCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
}

function DashboardCard({ title, value, change, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#364153] dark:text-white/80">
          {title}
        </CardTitle>
        <div className="text-app-text-secondary dark:text-app-text-muted">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-app-text-primary dark:text-white">{value}</div>
        <p className="text-xs text-app-text-secondary dark:text-white/60 mt-1">{change}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard
        title="Total de Unidades"
        value="12"
        change="+2 este mês"
        icon={<Building className="h-4 w-4" />}
      />
      <DashboardCard
        title="Especialistas Ativos"
        value="48"
        change="+5 este mês"
        icon={<Users className="h-4 w-4" />}
      />
      <DashboardCard
        title="Pacientes Cadastrados"
        value="2.847"
        change="+234 este mês"
        icon={<Users className="h-4 w-4" />}
      />
      <DashboardCard
        title="Receita Mensal"
        value="R$ 45.320"
        change="+12% este mês"
        icon={<CreditCard className="h-4 w-4" />}
      />
    </div>
  )
}
