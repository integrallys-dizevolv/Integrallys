import { useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { HardwareView } from '@/components/global/HardwareView'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Switch } from '@/components/ui/Switch'
import { Textarea } from '@/components/ui/Textarea'
import { User, Camera, Bell, Calendar, Stethoscope, ShieldCheck, Save, Moon, Volume2, Clock, Globe, Cpu } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '../../ui'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/Select'

interface ConfiguracoesViewProps {
    onPageChange: (page: string) => void
}

export const ConfiguracoesView = ({ onPageChange }: ConfiguracoesViewProps) => {
    const [activeTab, setActiveTab] = useState('perfil')

    const tabs = [
        { id: 'perfil', label: 'Perfil', icon: User },
        { id: 'notificacoes', label: 'Notificações', icon: Bell },
        { id: 'agenda', label: 'Agenda', icon: Calendar },
        { id: 'atendimento', label: 'Atendimento', icon: Stethoscope },
        { id: 'hardware', label: 'Hardware', icon: Cpu },
        { id: 'seguranca', label: 'Segurança', icon: ShieldCheck },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange?.('inicio')} className="cursor-pointer text-[#1A1A1AB2] dark:text-[#c3cec9] hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Configurações</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <PageHeader
                title="Configurações"
                subtitle="Gerencie suas preferências e configurações do sistema"
                onPageChange={onPageChange}
            />

            {/* Refined Modern Navigation Tabs */}
            <SegmentedControl
                options={tabs.map(tab => ({ value: tab.id, label: tab.label }))}
                value={activeTab}
                onChange={setActiveTab}
            />

            {/* Content Container - Width standardized to match other pages */}
            <div className="w-full">
                {activeTab === 'perfil' && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="p-8 md:p-10 space-y-10">
                            {/* Header Section */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <User className="h-5 w-5" />
                                    <h3 className="text-xl font-normal tracking-tight">Perfil do usuário</h3>
                                </div>
                                <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal ml-7">
                                    Informações pessoais e profissionais
                                </p>
                            </div>

                            {/* Avatar Section */}
                            <div className="flex flex-col md:flex-row items-center gap-8 pt-2">
                                <div className="h-24 w-24 rounded-full bg-[#0039A6] flex items-center justify-center text-2xl font-normal text-white shadow-inner">
                                    CS
                                </div>
                                <div className="space-y-3 text-center md:text-left">
                                    <Button variant="outline" className="h-10 px-5 rounded-[12px] border-app-border dark:border-app-border-dark flex items-center gap-2 font-normal text-gray-700 dark:text-gray-200">
                                        <Camera className="h-4 w-4" />
                                        Alterar foto
                                    </Button>
                                    <p className="text-xs text-app-text-muted font-normal">
                                        JPG, PNG ou GIF. Máx. 2MB
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark " />

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Nome completo *</Label>
                                    <Input
                                        defaultValue="Camila Santos"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Especialidade *</Label>
                                    <Input
                                        defaultValue="Especialista Clínico"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Crm *</Label>
                                    <Input
                                        defaultValue="12345-SP"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Cpf *</Label>
                                    <Input
                                        defaultValue="123.456.789-00"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Email *</Label>
                                    <Input
                                        defaultValue="camila.santos@integrallys.com"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Telefone *</Label>
                                    <Input
                                        defaultValue="(11) 98765-4321"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6]"
                                    />
                                </div>
                                {/* Digital Signature Field */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Assinatura digital</Label>
                                    <Textarea
                                        defaultValue={`Dra. Camila Santos - CRM 12345-SP\nEspecialista em Medicina Integrativa`}
                                        className="min-h-[100px] rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6] resize-none font-normal"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark " />

                            {/* Theme Preferences */}
                            <div className="space-y-6">
                                <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Preferências de tema</h4>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[14px] font-normal text-gray-900 dark:text-white">
                                            <Moon className="h-4 w-4" />
                                            Modo escuro
                                        </div>
                                        <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                                            Alterna entre tema claro e escuro
                                        </p>
                                    </div>
                                    <Switch className="data-[state=checked]:bg-[#0039A6]" />
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end pt-6 border-t border-gray-50 dark:border-gray-800">
                                <Button className="bg-[#0039A6] hover:bg-[#002d82] text-white px-10 h-12 rounded-[14px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] flex items-center gap-2">
                                    <Save className="h-4.5 w-4.5" />
                                    Salvar alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notificacoes' && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-8 md:p-10 space-y-10">
                            {/* Header Section */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Bell className="h-5 w-5" />
                                    <h3 className="text-xl font-normal tracking-tight">Notificações</h3>
                                </div>
                                <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal ml-7">
                                    Configure como deseja receber alertas e notificações
                                </p>
                            </div>

                            {/* Notification Options */}
                            <div className="space-y-0">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 py-8 first:pt-0">
                                    <div className="space-y-1.5">
                                        <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Notificações do sistema</h4>
                                        <p className="text-[14px] text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                                            Receba alertas sobre consultas, pacientes e lembretes
                                        </p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 py-8">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-[15px] font-normal text-gray-900 dark:text-white">
                                            <Volume2 className="h-4.5 w-4.5" />
                                            Som das notificações
                                        </div>
                                        <p className="text-[14px] text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                                            Reproduzir som ao receber novas notificações
                                        </p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                </div>

                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 py-8">
                                    <div className="space-y-1.5">
                                        <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Notificações por email</h4>
                                        <p className="text-[14px] text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                                            Receber resumo diário de consultas e eventos
                                        </p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                </div>


                                {/* Toast Duration Dropdown */}
                                <div className="space-y-3 pt-2">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Tempo de exibição do toast</Label>
                                    <Select defaultValue="3s">
                                        <SelectTrigger className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus:ring-[#0039A6]">
                                            <SelectValue preferPlaceholder placeholder="Selecione o tempo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2s">2 segundos</SelectItem>
                                            <SelectItem value="3s">3 segundos</SelectItem>
                                            <SelectItem value="5s">5 segundos</SelectItem>
                                            <SelectItem value="10s">10 segundos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Detailed Notification Toggles */}
                                <div className="space-y-6 pt-4">
                                    <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Notificar sobre:</h4>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-normal text-gray-700 dark:text-white/80">Novas consultas agendadas</span>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-normal text-gray-700 dark:text-white/80">Check-in de pacientes</span>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-normal text-gray-700 dark:text-white/80">Consultas próximas (15 min antes)</span>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-normal text-gray-700 dark:text-white/80">Pacientes em atraso</span>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-normal text-gray-700 dark:text-white/80">Cancelamentos</span>
                                            <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end pt-8 border-t border-gray-50 dark:border-gray-800">
                                <Button className="bg-[#0039A6] hover:bg-[#002d82] text-white px-10 h-12 rounded-[14px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] flex items-center gap-2">
                                    <Save className="h-4.5 w-4.5" />
                                    Salvar alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'agenda' && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-8 md:p-10 space-y-10">
                            {/* Header Section */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Calendar className="h-5 w-5" />
                                    <h3 className="text-xl font-normal tracking-tight">Configurações da agenda</h3>
                                </div>
                                <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal ml-7">
                                    Defina preferências para gestão da sua agenda
                                </p>
                            </div>

                            {/* Forms Section */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                    {/* Duração Padrão */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-app-text-muted" />
                                            Duração padrão das consultas
                                        </Label>
                                        <Select defaultValue="30min">
                                            <SelectTrigger className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus:ring-[#0039A6]">
                                                <SelectValue preferPlaceholder placeholder="Selecione a duração" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15min">15 minutos</SelectItem>
                                                <SelectItem value="30min">30 minutos</SelectItem>
                                                <SelectItem value="45min">45 minutos</SelectItem>
                                                <SelectItem value="60min">60 minutos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Intervalo */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Intervalo entre consultas</Label>
                                        <Select defaultValue="none">
                                            <SelectTrigger className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus:ring-[#0039A6]">
                                                <SelectValue preferPlaceholder placeholder="Selecione o intervalo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Sem intervalo</SelectItem>
                                                <SelectItem value="5min">5 minutos</SelectItem>
                                                <SelectItem value="10min">10 minutos</SelectItem>
                                                <SelectItem value="15min">15 minutos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Horário de Início */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Horário de início</Label>
                                        <div className="relative">
                                            <Input
                                                defaultValue="08:00"
                                                className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6] pr-12"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none">
                                                <Clock className="h-4.5 w-4.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Horário de Término */}
                                    <div className="space-y-2.5">
                                        <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Horário de término</Label>
                                        <div className="relative">
                                            <Input
                                                defaultValue="18:00"
                                                className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6] pr-12"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none">
                                                <Clock className="h-4.5 w-4.5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark/50" />

                                {/* Visualização Padrão */}
                                <div className="space-y-2.5 max-w-full">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Visualização padrão</Label>
                                    <Select defaultValue="dia">
                                        <SelectTrigger className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus:ring-[#0039A6]">
                                            <SelectValue preferPlaceholder placeholder="Selecione a visualização" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dia">Dia</SelectItem>
                                            <SelectItem value="semana">Semana</SelectItem>
                                            <SelectItem value="mes">Mês</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark/50" />

                                {/* Automation Settings */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Check-in automático</h4>
                                            <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                                                Marcar paciente como "aguardando" ao chegar no horário
                                            </p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-[#0039A6]" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-normal text-gray-900 dark:text-white">Confirmação automática de agendamentos</h4>
                                            <p className="text-sm text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                                                Confirmar automaticamente novos agendamentos
                                            </p>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-[#0039A6]" />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end pt-8 border-t border-gray-50 dark:border-gray-800">
                                <Button className="bg-[#0039A6] hover:bg-[#002d82] text-white px-10 h-12 rounded-[14px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] flex items-center gap-2">
                                    <Save className="h-4.5 w-4.5" />
                                    Salvar alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'atendimento' && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-8 md:p-10 space-y-10">
                            {/* Header Section */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Globe className="h-5 w-5" />
                                    <h3 className="text-xl font-normal tracking-tight">Configurações de atendimento</h3>
                                </div>
                                <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal ml-7">
                                    Defina preferências para atendimento aos pacientes
                                </p>
                            </div>

                            {/* Forms Section */}
                            <div className="space-y-8">
                                <div className="space-y-2.5">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Método de atendimento</Label>
                                    <Select defaultValue="presencial">
                                        <SelectTrigger className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus:ring-[#0039A6]">
                                            <SelectValue preferPlaceholder placeholder="Selecione o método" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="presencial">Presencial</SelectItem>
                                            <SelectItem value="remoto">Remoto</SelectItem>
                                            <SelectItem value="hibrido">Híbrido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2.5">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Plataforma de videoconferência</Label>
                                    <Select defaultValue="zoom">
                                        <SelectTrigger className="h-12 rounded-[14px] bg-app-bg-secondary/50 dark:bg-app-bg-dark border-gray-100 dark:border-gray-800 focus:ring-[#0039A6]">
                                            <SelectValue preferPlaceholder placeholder="Selecione a plataforma" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="zoom">Zoom</SelectItem>
                                            <SelectItem value="google_meet">Google Meet</SelectItem>
                                            <SelectItem value="teams">Microsoft Teams</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Configurações de consulta remota</Label>
                                    <Textarea
                                        defaultValue="Para consultas remotas, utilize a plataforma Zoom. Certifique-se de ter uma conexão estável de internet e um ambiente silencioso."
                                        className="min-h-[100px] rounded-[16px] bg-[#f8fafc] dark:bg-app-bg-dark border border-gray-100 dark:border-gray-800 focus-visible:ring-[#0039A6] text-[14px] text-gray-600 dark:text-app-text-muted font-normal leading-relaxed resize-none p-5"
                                    />
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end pt-8 border-t border-gray-50 dark:border-gray-800">
                                <Button className="bg-[#0039A6] hover:bg-[#002d82] text-white px-10 h-12 rounded-[14px] font-normal shadow-lg shadow-[#0039A6]/20 transition-all hover:scale-[1.02] flex items-center gap-2">
                                    <Save className="h-4.5 w-4.5" />
                                    Salvar alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'hardware' && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-8 md:p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <HardwareView />
                    </div>
                )}

                {activeTab === 'seguranca' && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-8 md:p-10 space-y-8">
                            {/* Header Section */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <ShieldCheck className="h-5 w-5" />
                                    <h3 className="text-xl font-normal tracking-tight">Privacidade e segurança</h3>
                                </div>
                                <p className="text-[15px] text-app-text-muted dark:text-app-text-muted font-normal ml-7">
                                    Gerencie suas configurações de segurança
                                </p>
                            </div>

                            {/* Password Change Section */}
                            <div className="space-y-6 max-w-full">
                                <h4 className="text-[16px] font-normal text-gray-900 dark:text-white">Alterar senha</h4>

                                <div className="space-y-3">
                                    <Input
                                        type="password"
                                        placeholder="Senha atual"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/30 dark:bg-app-bg-dark border-app-border dark:border-gray-800 focus-visible:ring-[#0039A6] focus-visible:border-[#0039A6] placeholder:text-app-text-muted"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Nova senha"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/30 dark:bg-app-bg-dark border-app-border dark:border-gray-800 focus-visible:ring-[#0039A6] focus-visible:border-[#0039A6] placeholder:text-app-text-muted"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Confirmar nova senha"
                                        className="h-12 rounded-[14px] bg-app-bg-secondary/30 dark:bg-app-bg-dark border-app-border dark:border-gray-800 focus-visible:ring-[#0039A6] focus-visible:border-[#0039A6] placeholder:text-app-text-muted"
                                    />
                                </div>

                                <Button variant="outline" className="bg-white dark:bg-app-bg-dark hover:bg-app-bg-secondary dark:hover:bg-white/5 text-gray-900 dark:text-white border-app-border dark:border-gray-800 h-11 px-8 rounded-[12px] font-normal transition-all shadow-sm">
                                    Atualizar senha
                                </Button>
                            </div>

                            <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark" />

                            {/* Digital Signature PIN Section */}
                            <DigitalSignaturePINSection />
                        </div>
                    </div>
                )}

                {/* Other Navigable Tabs Catch-all */}
                {!['perfil', 'notificacoes', 'agenda', 'atendimento', 'seguranca'].includes(activeTab) && (
                    <div className="bg-white dark:bg-app-card-dark rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm p-24 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
                        <div className="h-20 w-20 rounded-full bg-app-bg-secondary dark:bg-app-table-header-dark flex items-center justify-center">
                            {tabs.find(t => t.id === activeTab)?.icon && (
                                <span className="h-10 w-10 text-app-text-muted">
                                    {(() => {
                                        const Icon = tabs.find(t => t.id === activeTab)?.icon;
                                        if (!Icon) return null;
                                        return <Icon className="h-full w-full" />
                                    })()}
                                </span>
                            )}
                        </div>
                        <div className="text-center space-y-1">
                            <h4 className="text-lg font-normal text-gray-900 dark:text-white">
                                Configurações de {tabs.find(t => t.id === activeTab)?.label}
                            </h4>
                            <p className="text-app-text-muted font-normal">Este módulo está sendo preparado para você.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Digital Signature PIN Section Component
function DigitalSignaturePINSection() {
    const [newPin, setNewPin] = useState('')
    const [confirmPin, setConfirmPin] = useState('')
    const [isPinConfigured, setIsPinConfigured] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSavePin = () => {
        setError('')
        setSuccess(false)

        // Validation
        if (!newPin || !confirmPin) {
            setError('Por favor, preencha ambos os campos')
            return
        }

        if (newPin.length !== 4 && newPin.length !== 6) {
            setError('O PIN deve ter 4 ou 6 dígitos')
            return
        }

        if (!/^\d+$/.test(newPin)) {
            setError('O PIN deve conter apenas números')
            return
        }

        if (newPin !== confirmPin) {
            setError('Os PINs não coincidem')
            return
        }

        // Success
        setIsPinConfigured(true)
        setSuccess(true)
        setNewPin('')
        setConfirmPin('')

        // Auto-hide success message
        setTimeout(() => setSuccess(false), 3000)
    }

    return (
        <div className="space-y-6 max-w-full">
            <div className="flex items-center justify-between">
                <h4 className="text-[16px] font-normal text-gray-900 dark:text-white">Assinatura digital</h4>
                {isPinConfigured && (
                    <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none font-normal px-3 py-1 rounded-full text-[10px] shadow-sm">
                        Configurado
                    </Badge>
                )}
            </div>

            <p className="text-[13px] text-app-text-muted dark:text-app-text-muted font-normal leading-relaxed">
                Este PIN será solicitado para validar suas prescrições e documentos oficiais.
            </p>

            <div className="space-y-3">
                <div className="space-y-2">
                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Novo PIN de assinatura</Label>
                    <Input
                        type="password"
                        placeholder="••••"
                        value={newPin}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                            setNewPin(value)
                            setError('')
                        }}
                        maxLength={6}
                        className="h-12 rounded-[14px] bg-app-bg-secondary/30 dark:bg-app-bg-dark border-app-border dark:border-gray-800 focus-visible:ring-[#0039A6] focus-visible:border-[#0039A6] placeholder:text-app-text-muted font-normal text-center tracking-[0.5em]"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[14px] font-normal text-gray-900 dark:text-white">Confirmar novo PIN</Label>
                    <Input
                        type="password"
                        placeholder="••••"
                        value={confirmPin}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                            setConfirmPin(value)
                            setError('')
                        }}
                        maxLength={6}
                        className="h-12 rounded-[14px] bg-app-bg-secondary/30 dark:bg-app-bg-dark border-app-border dark:border-gray-800 focus-visible:ring-[#0039A6] focus-visible:border-[#0039A6] placeholder:text-app-text-muted font-normal text-center tracking-[0.5em]"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-[12px] p-3 animate-in fade-in slide-in-from-top-1">
                    <p className="text-[13px] text-red-600 dark:text-red-400 font-normal">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-[12px] p-3 animate-in fade-in slide-in-from-top-1">
                    <p className="text-[13px] text-green-600 dark:text-green-400 font-normal">PIN configurado com sucesso!</p>
                </div>
            )}

            <Button
                onClick={handleSavePin}
                className="bg-[#0039A6] hover:bg-[#002d82] text-white h-11 px-8 rounded-[12px] font-normal transition-all shadow-sm"
            >
                Salvar PIN
            </Button>
        </div>
    )
}
