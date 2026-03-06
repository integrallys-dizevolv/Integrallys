import { toast } from 'sonner'
import { useState } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import {
    User,
    Bell,
    Calendar,
    Shield,
    Stethoscope,
    Camera,
    Save,
    Clock,
    Volume2,
    Mail,
    Moon,
    Cpu
} from 'lucide-react'
import { HardwareView } from '@/components/global/HardwareView'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select'
import { MOCK_REPC_PROFILE } from '@/mocks/recepcionista/perfil'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/Breadcrumb'

interface ConfiguracoesViewProps {
    onPageChange?: (page: string) => void;
}

export const ConfiguracoesView = ({ onPageChange }: ConfiguracoesViewProps) => {
    const setCurrentPage = onPageChange;
    const [activeTab, setActiveTab] = useState('Perfil')

    const tabs = [
        { name: 'Perfil', icon: User },
        { name: 'Notificações', icon: Bell },
        { name: 'Agenda', icon: Calendar },
        { name: 'Segurança', icon: Shield },
        { name: 'Atendimento', icon: Stethoscope },
        { name: 'Hardware', icon: Cpu },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => setCurrentPage?.('inicio')} className="cursor-pointer text-app-text-primary/70 dark:text-white/80 hover:text-[#0039A6] dark:hover:text-white">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-app-text-primary dark:text-white font-normal">Configurações</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-normal text-app-text-primary dark:text-white tracking-tight">Configurações</h1>
                <p className="text-app-text-secondary dark:text-white/60 font-normal mt-1">
                    Gerencie suas preferências e configurações do sistema
                </p>
            </div>

            {/* Navigation Tabs */}
            {/* Navigation Tabs - With horizontal scroll on mobile */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <SegmentedControl
                    options={tabs.map(tab => ({ value: tab.name, label: tab.name }))}
                    value={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {/* Content Area */}
            <div className="bg-app-card dark:bg-app-card-dark rounded-[24px] border border-app-border dark:border-app-border-dark shadow-sm overflow-hidden">
                <div className="p-8">
                    {activeTab === 'Perfil' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#101828] dark:text-white">
                                    <User size={20} />
                                    <h3 className="text-xl font-normal">Perfil do usuário</h3>
                                </div>
                                <p className="text-app-text-secondary dark:text-white/60 font-normal">Informações pessoais e profissionais</p>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-[#002d82] flex items-center justify-center text-white text-3xl font-normal">
                                    {MOCK_REPC_PROFILE.initials}
                                </div>
                                <div className="space-y-3 text-center md:text-left">
                                    <Button variant="outline" onClick={() => toast.info("Upload de foto disponível em breve.")} className="h-10 px-6 rounded-xl border-app-border dark:border-app-border-dark font-normal flex items-center gap-2 hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all">
                                        <Camera size={18} />
                                        Alterar foto
                                    </Button>
                                    <p className="text-xs text-app-text-muted font-normal uppercase tracking-wider">
                                        JPG, PNG ou GIF. Máx. 2MB
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-gray-50 dark:bg-gray-800/50 w-full" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200 ml-1">
                                        Nome completo *
                                    </label>
                                    <Input
                                        defaultValue={MOCK_REPC_PROFILE.name}
                                        className="h-12 md:h-14 px-6 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#0039A6] transition-all font-normal"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200 ml-1">
                                        Cargo *
                                    </label>
                                    <Input
                                        defaultValue={MOCK_REPC_PROFILE.role}
                                        className="h-12 md:h-14 px-6 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#0039A6] transition-all font-normal"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200 ml-1">
                                        Cpf *
                                    </label>
                                    <Input
                                        defaultValue={MOCK_REPC_PROFILE.cpf}
                                        className="h-12 md:h-14 px-6 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#0039A6] transition-all font-normal"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200 ml-1">
                                        Telefone
                                    </label>
                                    <Input
                                        defaultValue={MOCK_REPC_PROFILE.phone}
                                        className="h-12 md:h-14 px-6 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#0039A6] transition-all font-normal"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200 ml-1">
                                        E-mail
                                    </label>
                                    <Input
                                        defaultValue={MOCK_REPC_PROFILE.email}
                                        className="h-12 md:h-14 px-6 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-[#0039A6] transition-all font-normal"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-gray-50 dark:bg-gray-800/50 w-full" />

                            <div className="space-y-4">
                                <h3 className="text-xl font-normal text-app-text-primary dark:text-white">Preferências de tema</h3>
                                <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                            <Moon size={18} />
                                            Modo escuro
                                        </div>
                                        <p className="text-sm text-app-text-secondary dark:text-white/60 font-normal">Alterna entre tema claro e escuro</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notificações' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#101828] dark:text-white">
                                    <Bell size={20} />
                                    <h3 className="text-xl font-normal">Notificações</h3>
                                </div>
                                <p className="text-app-text-secondary dark:text-white/60 font-normal">Configure como deseja receber alertas e notificações</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 pb-6">
                                    <div className="space-y-1">
                                        <p className="font-normal text-app-text-primary dark:text-white">Notificações do sistema</p>
                                        <p className="text-sm text-app-text-secondary dark:text-white/60 font-normal">Receba alertas sobre consultas, pacientes e lembretes</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 pb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                            <Volume2 size={18} />
                                            Som das notificações
                                        </div>
                                        <p className="text-sm text-[#667085] dark:text-gray-400 font-normal">Reproduzir som ao receber novas notificações</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 pb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                            <Mail size={18} />
                                            Notificação por email
                                        </div>
                                        <p className="text-sm text-[#667085] dark:text-gray-400 font-normal">Receber resumo diário de consultas e eventos</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="space-y-4 pt-4">
                                    <label className="text-sm font-normal text-app-text-primary dark:text-white/80">Tempo de exibição do toast</label>
                                    <Select defaultValue="3">
                                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal">
                                            <SelectValue preferPlaceholder placeholder="Selecione o tempo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="3">3 segundos</SelectItem>
                                            <SelectItem value="5">5 segundos</SelectItem>
                                            <SelectItem value="8">8 segundos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <p className="font-normal text-app-text-primary dark:text-white">Notificar sobre:</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            'Novas consultas agendadas',
                                            'Check-in de pacientes',
                                            'Consultas próximas (15 min antes)',
                                            'Pacientes em atraso',
                                            'Cancelamentos',
                                            'Pagamentos',
                                            'Confirmações pendentes',
                                            'Pacientes aguardando',
                                            'Retornos'
                                        ].map((item) => (
                                            <div key={item} className="flex items-center justify-between p-1">
                                                <span className="text-sm font-normal text-app-text-secondary dark:text-white/60">{item}</span>
                                                <Switch defaultChecked />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Agenda' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#101828] dark:text-white">
                                    <Calendar size={20} />
                                    <h3 className="text-xl font-normal">Preferências de agenda</h3>
                                </div>
                                <p className="text-[#667085] dark:text-gray-400 font-normal">Configure como deseja visualizar e gerenciar a agenda</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200">Visualização padrão</label>
                                    <Select defaultValue="semana">
                                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal">
                                            <SelectValue preferPlaceholder placeholder="Selecione a visualização" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dia">Dia</SelectItem>
                                            <SelectItem value="semana">Semana</SelectItem>
                                            <SelectItem value="mes">Mês</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200">Horário de início</label>
                                    <div className="relative">
                                        <Input
                                            defaultValue="08:00"
                                            className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal pr-10"
                                        />
                                        <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200">Duração padrão (min)</label>
                                    <Input
                                        defaultValue="30"
                                        className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-normal text-[#101828] dark:text-gray-200">Intervalo entre consultas (min)</label>
                                    <Input
                                        defaultValue="0"
                                        className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Segurança' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#101828] dark:text-white">
                                    <Shield size={20} />
                                    <h3 className="text-xl font-normal">Privacidade e segurança</h3>
                                </div>
                                <p className="text-[#667085] dark:text-gray-400 font-normal">Gerencie suas configurações de segurança</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <p className="font-normal text-[#101828] dark:text-white">Alterar senha</p>
                                    <div className="max-w-3xl space-y-4">
                                        <Input
                                            type="password"
                                            placeholder="Senha atual"
                                            className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal"
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Nova senha"
                                            className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal"
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Confirmar nova senha"
                                            className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal"
                                        />
                                        <Button variant="outline" className="h-10 px-6 rounded-xl border-gray-200 dark:border-gray-800 font-normal hover:bg-gray-50 dark:hover:bg-white/5">
                                            Atualizar senha
                                        </Button>
                                    </div>
                                </div>

                                <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark/50 w-full" />

                                <div className="space-y-4">
                                    <p className="font-normal text-[#101828] dark:text-white">Autenticação de dois fatores</p>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Atendimento' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[#101828] dark:text-white">
                                    <Stethoscope size={20} />
                                    <h3 className="text-xl font-normal">Preferências de atendimento</h3>
                                </div>
                                <p className="text-[#667085] dark:text-gray-400 font-normal">Configure como deseja gerenciar o atendimento</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 pb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="6 9 6 2 18 2 18 9" />
                                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                <rect x="6" y="14" width="12" height="8" />
                                            </svg>
                                            Imprimir automaticamente
                                        </div>
                                        <p className="text-sm text-[#667085] dark:text-gray-400 font-normal">Imprimir comprovantes e recibos automaticamente</p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 pb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                            </svg>
                                            Enviar SMS de confirmação
                                        </div>
                                        <p className="text-sm text-[#667085] dark:text-gray-400 font-normal">Enviar mensagem SMS após agendar consultas</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 pb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                            <Mail size={18} />
                                            Enviar email de lembrete
                                        </div>
                                        <p className="text-sm text-[#667085] dark:text-gray-400 font-normal">Enviar email de lembrete antes das consultas</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-2 font-normal text-[#101828] dark:text-white">
                                        <Clock size={18} />
                                        Lembrete com antecedência (horas)
                                    </div>
                                    <Input
                                        defaultValue="24"
                                        className="h-12 bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-gray-700 rounded-2xl font-normal"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Hardware' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <HardwareView />
                        </div>
                    )}

                    <div className="flex justify-end pt-10">
                        <Button className="w-full md:w-auto h-12 md:h-14 px-10 bg-[#0039A6] hover:bg-[#002d82] text-white font-normal rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#0039A6]/20 transition-all active:scale-[0.98]">
                            <Save size={20} />
                            Salvar alterações
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

