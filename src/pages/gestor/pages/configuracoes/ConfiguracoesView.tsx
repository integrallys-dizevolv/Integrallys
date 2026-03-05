import React, { useState } from 'react';
import {
    Users, Settings, Shield, Upload, Moon, Sun, Edit, ChevronRight, Bell, Globe, Smartphone
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/Select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/Table';
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { useDarkMode } from '@/hooks/useDarkMode';
import { mockIntegrations } from '@/mocks/gestor/configuracoes';
import {
    CLINIC_PATIENT_ALERT_STORAGE_KEY,
    DEFAULT_PATIENT_HOME_ALERT
} from '@/mocks/shared/clinicConfig';

interface ConfiguracoesViewProps {
    onPageChange: (page: string) => void;
}

export function ConfiguracoesView({ onPageChange }: ConfiguracoesViewProps) {
    const [settingsTab, setSettingsTab] = useState('perfil');
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const [patientPortalAlert, setPatientPortalAlert] = useState(() => {
        const stored = localStorage.getItem(CLINIC_PATIENT_ALERT_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed?.title && parsed?.message) {
                    return {
                        title: String(parsed.title),
                        message: String(parsed.message)
                    };
                }
            } catch {
                // ignore invalid storage
            }
        }
        return DEFAULT_PATIENT_HOME_ALERT;
    });

    const handleSaveSystem = () => {
        localStorage.setItem(
            CLINIC_PATIENT_ALERT_STORAGE_KEY,
            JSON.stringify(patientPortalAlert)
        );
    };


    return (
        <div className="space-y-6">
            {/* Breadcrumb Padrão */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer font-normal text-sm">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="font-normal text-sm">Configurações</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <SegmentedControl
                options={[
                    { value: 'perfil', label: 'Perfil' },
                    { value: 'sistema', label: 'Sistema' },
                    { value: 'integrações', label: 'Integrações' },
                    { value: 'segurança', label: 'Segurança' },
                ]}
                value={settingsTab}
                onChange={setSettingsTab}
            />

            <Card className="border-app-border dark:border-app-border-dark bg-app-card dark:bg-app-bg-dark rounded-[14px] overflow-hidden shadow-sm">
                <CardContent className="p-6 md:p-8">

                    {/* TAB: PERFIL */}
                    {settingsTab === 'perfil' && (
                        <div className="space-y-8">
                            {/* Header Section */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-app-text-primary dark:text-white" />
                                    <h3 className="text-lg font-normal text-app-text-primary dark:text-white">Perfil do gestor</h3>
                                </div>
                                <p className="text-sm text-app-text-muted dark:text-app-text-muted pl-7 font-normal">Informações pessoais e profissionais de gestão</p>
                            </div>

                            {/* Avatar Section */}
                            <div className="flex flex-row items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-app-primary flex items-center justify-center text-white text-2xl font-normal">
                                    GU
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" className="h-10 px-4 rounded-lg gap-2 text-app-text-primary border-app-border hover:bg-app-bg-secondary dark:text-white dark:border-app-border-dark dark:hover:bg-app-card/5 w-fit font-normal">
                                        <Upload className="h-4 w-4" />
                                        Alterar foto
                                    </Button>
                                    <p className="text-xs text-app-text-muted font-normal">JPG, PNG ou GIF. Máx. 2MB</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-b border-app-border dark:border-app-border-dark" />

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-app-text-primary dark:text-white font-normal underline-offset-4">Nome completo *</Label>
                                    <Input defaultValue="Gestor Integrallys" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-app-text-primary dark:text-white font-normal">Cargo *</Label>
                                    <Input defaultValue="Gestor de Unidade" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-app-text-primary dark:text-white font-normal">E-mail</Label>
                                    <Input defaultValue="gestor@integrallys.com" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-app-text-primary dark:text-white font-normal">Telefone</Label>
                                    <Input defaultValue="(11) 97777-6666" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-app-border-dark">
                                <div className="flex items-center justify-between p-4 bg-app-bg-secondary dark:bg-black/10 rounded-[12px]">
                                    <div className="flex items-center gap-3">
                                        {isDarkMode ? <Moon className="h-5 w-5 text-emerald-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
                                        <div>
                                            <p className="text-sm font-normal dark:text-white">Tema do sistema</p>
                                            <p className="text-xs text-app-text-muted font-normal">Alternar entre modo claro e escuro</p>
                                        </div>
                                    </div>
                                    <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SISTEMA */}
                    {settingsTab === 'sistema' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                                    <h3 className="text-lg font-normal dark:text-white">Configurações da unidade</h3>
                                </div>
                                <p className="text-sm text-app-text-muted font-normal">Defina os parâmetros técnicos para sua unidade.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-normal">Fuso horário</Label>
                                    <Select defaultValue="sp">
                                        <SelectTrigger className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal">
                                            <SelectValue preferPlaceholder placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sp" className="font-normal">América/São Paulo (GMT-3)</SelectItem>
                                            <SelectItem value="ny" className="font-normal">América/New York (GMT-5)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-normal">Unidade principal</Label>
                                    <Select defaultValue="matriz">
                                        <SelectTrigger className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal">
                                            <SelectValue preferPlaceholder placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="matriz" className="font-normal">Unidade Matriz</SelectItem>
                                            <SelectItem value="centro" className="font-normal">Unidade Centro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6">
                                <h4 className="text-sm font-normal uppercase tracking-wider text-app-text-muted">Notificações e alertas</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Alertas de estoque', desc: 'Notificar quando itens atingirem nível crítico', icon: Bell },
                                        { label: 'Relatórios semanais', desc: 'Receber resumo financeiro por e-mail', icon: Globe },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-app-border-dark rounded-[12px] hover:bg-app-bg-secondary dark:hover:bg-app-card/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                                                <div>
                                                    <p className="text-sm font-normal dark:text-white">{item.label}</p>
                                                    <p className="text-xs text-app-text-muted font-normal">{item.desc}</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            
                            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-app-border-dark">
                                <h4 className="text-sm font-normal uppercase tracking-wider text-app-text-muted">Mensagem do portal do paciente</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-normal">Titulo</Label>
                                        <Input
                                            value={patientPortalAlert.title}
                                            onChange={(e) =>
                                                setPatientPortalAlert((prev) => ({
                                                    ...prev,
                                                    title: e.target.value
                                                }))
                                            }
                                            className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-normal">Mensagem</Label>
                                        <Textarea
                                            value={patientPortalAlert.message}
                                            onChange={(e) =>
                                                setPatientPortalAlert((prev) => ({
                                                    ...prev,
                                                    message: e.target.value
                                                }))
                                            }
                                            className="min-h-[120px] rounded-[10px] dark:bg-app-bg-dark font-normal"
                                        />
                                        <p className="text-xs text-app-text-muted font-normal">
                                            Essa mensagem aparece na tela inicial do paciente.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-app-border-dark">
                                <Button variant="outline" className="h-11 px-6 rounded-[10px] font-normal">Cancelar</Button>
                                <Button onClick={handleSaveSystem} className="h-11 px-8 rounded-[10px] bg-app-primary hover:bg-app-primary/90 text-white font-normal">Salvar configuracoes</Button>
                            </div>
                        </div>
                    )}

                    {/* TAB: INTEGRAÇÕES */}
                    {settingsTab === 'integrações' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-normal dark:text-white">Conexões da unidade</h3>
                                    <p className="text-sm text-app-text-muted font-normal">Serviços conectados à unidade sob sua gestão.</p>
                                </div>
                                <Button className="bg-app-primary text-white rounded-[10px] gap-2 font-normal">
                                    <ChevronRight className="h-4 w-4" /> Nova integração
                                </Button>
                            </div>

                            <div className="rounded-[12px] border border-gray-100 dark:border-app-border-dark overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-app-bg-secondary dark:bg-black/20">
                                        <TableRow>
                                            <TableHead className="font-normal">Nome</TableHead>
                                            <TableHead className="font-normal">Tipo</TableHead>
                                            <TableHead className="font-normal">Status</TableHead>
                                            <TableHead className="font-normal text-right px-6">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockIntegrations.map((item) => (
                                            <TableRow key={item.id} className="dark:hover:bg-app-card/5 border-b border-gray-100 dark:border-app-border-dark">
                                                <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                                                <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.tipo}</Badge></TableCell>
                                                <TableCell>
                                                    <Badge className={`rounded-full px-3 py-0.5 text-xs font-normal border-none shadow-sm text-white ${item.status === 'Ativa'
                                                        ? 'bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100'
                                                        : 'bg-gray-600 dark:bg-app-bg-dark dark:text-app-text-muted'
                                                        }`}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <Button variant="ghost" size="icon" className="rounded-full font-normal"><Edit className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}




                    {/* TAB: SEGURANÇA */}
                    {settingsTab === 'segurança' && (
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                                    <h3 className="text-lg font-normal dark:text-white">Segurança</h3>
                                </div>
                                <p className="text-sm text-app-text-muted font-normal">Gerencie sua senha e sessões de acesso ao sistema.</p>
                            </div>

                            <div className="max-w-2xl space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-normal text-app-text-muted uppercase">Alterar senha</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="font-normal">Senha atual</Label>
                                            <Input type="password" placeholder="••••••••" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-normal">Nova senha</Label>
                                                <Input type="password" placeholder="Mín. 8 caracteres" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-normal">Confirmar nova senha</Label>
                                                <Input type="password" placeholder="Repita a nova senha" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="bg-app-primary text-white rounded-[10px] h-11 px-6 font-normal">Atualizar senha</Button>
                                </div>

                                <div className="pt-8 border-t border-gray-100 dark:border-app-border-dark space-y-4">
                                    <h4 className="text-sm font-normal text-app-text-muted uppercase tracking-widest">Sessões ativas</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-[12px]">
                                            <div className="flex items-center gap-3">
                                                <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                <div>
                                                    <p className="text-sm font-normal dark:text-white">MacBook Pro - Rio de Janeiro, BR</p>
                                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-normal">Sessão atual</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-600 dark:bg-emerald-900/40 dark:text-emerald-100 text-white border-none shadow-sm font-normal">Online</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}


