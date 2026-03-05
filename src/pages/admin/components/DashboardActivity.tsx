import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

import { AniversariantesCard } from './AniversariantesCard'

export function DashboardActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2.5 h-2.5 bg-[#0039A6] rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-app-text-primary dark:text-white">
                  Nova unidade cadastrada
                </p>
                <p className="text-xs text-app-text-secondary dark:text-app-text-muted">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-app-text-primary dark:text-white">
                  5 novos especialistas ativos
                </p>
                <p className="text-xs text-app-text-secondary dark:text-app-text-muted">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-app-text-primary dark:text-white">
                  Atualização do sistema realizada
                </p>
                <p className="text-xs text-app-text-secondary dark:text-app-text-muted">Há 3 dias</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Status das Unidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center group cursor-pointer p-1 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-sm text-[#364153] dark:text-white/80">Unidades Ativas</span>
              <Badge variant="default" className="bg-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-100 border-none">11</Badge>
            </div>
            <div className="flex justify-between items-center group cursor-pointer p-1 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-sm text-[#364153] dark:text-white/80">Em Manutenção</span>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-100 border-none">1</Badge>
            </div>
            <div className="flex justify-between items-center group cursor-pointer p-1 rounded-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <span className="text-sm text-[#364153] dark:text-white/80">Novos Agendamentos</span>
              <Badge variant="outline" className="border-blue-100 text-blue-700 dark:border-blue-900 dark:text-blue-300">157</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="lg:col-span-1">
        <AniversariantesCard />
      </div>
    </div>
  )
}
