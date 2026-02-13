import { useState, useEffect } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import {
  Users, Settings, Shield, Upload, Moon, Sun,
  ChevronRight, Bell, Globe, Smartphone, Edit, Building
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
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
import { mockIntegrations } from '@/mocks/admin/integrations';
import { setSystemTimezone, getConfiguredTimezone } from '@/utils/dateUtils';

import { HardwareView } from '@/components/global/HardwareView';
import { CadastrosTab } from './components/CadastrosTab';

interface ConfiguracoesViewProps {
  onPageChange: (page: string) => void;
}

export function ConfiguracoesView({ onPageChange }: ConfiguracoesViewProps) {
  const [settingsTab, setSettingsTab] = useState('Perfil');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Carregar configurações salvas do localStorage
  const [selectedTimezone, setSelectedTimezone] = useState(() => getConfiguredTimezone());
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('system_currency') || 'brl';
    }
    return 'brl';
  });

  // Persistir timezone quando mudar
  useEffect(() => {
    setSystemTimezone(selectedTimezone);
  }, [selectedTimezone]);

  // Persistir moeda quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_currency', selectedCurrency);
    }
  }, [selectedCurrency]);

  // Mapeamento de fusos horários para exibição formatada
  const timezoneLabels: Record<string, string> = {
    'america/sao_paulo': 'América/São Paulo (GMT-3)',
    'america/new_york': 'América/New York (GMT-5)',
    'europe/london': 'Europa/Londres (GMT+0)',
    'asia/tokyo': 'Ásia/Tóquio (GMT+9)'
  };

  // Mapeamento de moedas para exibição formatada
  const currencyLabels: Record<string, string> = {
    'brl': 'Real (R$)',
    'usd': 'Dólar (US$)',
    'eur': 'Euro (€)',
    'gbp': 'Libra (£)'
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Padrão */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer font-normal">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-normal">Configurações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tabs (Segmented Control) Responsivo */}
      <SegmentedControl
        options={[
          { value: 'Perfil', label: 'Perfil' },
          { value: 'Clínica', label: 'Clínica' },
          { value: 'Sistema', label: 'Sistema' },
          { value: 'Cadastros', label: 'Cadastros' },
          { value: 'Integrações', label: 'Integrações' },
          { value: 'Hardware', label: 'Hardware' },
          { value: 'Segurança', label: 'Segurança' },
        ]}
        value={settingsTab}
        onChange={setSettingsTab}
      />

      <Card className="border-app-border dark:border-app-border-dark bg-app-card dark:bg-app-card-dark rounded-[14px] overflow-hidden shadow-sm">
        <CardContent className="p-6 md:p-8">

          {/* TAB: PERFIL */}
          {settingsTab === 'Perfil' && (
            <div className="space-y-8">
              {/* Header Section */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-app-text-primary dark:text-white" />
                  <h3 className="text-lg font-normal text-app-text-primary dark:text-white">Perfil do administrador</h3>
                </div>
                <p className="text-sm text-app-text-muted dark:text-app-text-muted pl-7 font-normal">Informações pessoais e profissionais</p>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-integrallys-blue/30 flex items-center justify-center text-integrallys-blue text-2xl font-normal">
                  AI
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="h-10 px-4 rounded-lg gap-2 text-app-text-primary border-app-border hover:bg-app-bg-secondary dark:text-white dark:border-app-border-dark dark:hover:bg-app-card/5 w-fit font-normal">
                    <Upload className="h-4 w-4" />
                    Alterar foto
                  </Button>
                  <p className="text-xs text-app-text-muted font-normal">Jpg, png ou gif. Máx. 2mb</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-b border-app-border dark:border-app-border-dark" />

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-app-text-primary dark:text-white font-normal">Nome completo *</Label>
                  <Input defaultValue="Admin Integrallys" className="font-normal" />
                </div>
                <div className="space-y-2">
                  <Label className="text-app-text-primary dark:text-white font-normal">Cargo *</Label>
                  <Input defaultValue="Administrador Master" className="font-normal" />
                </div>
                <div className="space-y-2">
                  <Label className="text-app-text-primary dark:text-white font-normal">E-mail</Label>
                  <Input defaultValue="admin@integrallys.com" className="font-normal" />
                </div>
                <div className="space-y-2">
                  <Label className="text-app-text-primary dark:text-white font-normal">Telefone</Label>
                  <Input defaultValue="(11) 98765-4321" className="font-normal" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-app-border-dark font-normal">
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

          {/* TAB: CLÍNICA (MASTER) */}
          {settingsTab === 'Clínica' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#0039A6]" />
                  <h3 className="text-lg font-normal dark:text-white">Perfil da Clínica</h3>
                </div>
                <p className="text-sm text-app-text-muted font-normal">Dados institucionais que aparecerão em documentos e relatórios.</p>
              </div>

              {/* Logo Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-app-bg-secondary dark:bg-black/10 rounded-[16px] border border-app-border dark:border-app-border-dark">
                <div className="w-32 h-16 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center p-2 shrink-0">
                  <span className="text-xs text-app-text-muted uppercase tracking-wider font-medium">Logotipo</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-normal dark:text-white">Logotipo da Instituição</h4>
                  <p className="text-xs text-app-text-muted font-normal max-w-md leading-relaxed">Esta imagem será utilizada no cabeçalho de receitas, atestados e documentos oficiais gerados pelos especialistas.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg h-9 font-normal border-app-border dark:border-gray-700 bg-white dark:bg-transparent">
                      <Upload className="h-3.5 w-3.5 mr-2" /> Carregar nova
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-9 font-normal text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                      Remover
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">Nome Fantasia *</Label>
                  <Input defaultValue="Integrallys Clinic" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">Razão Social</Label>
                  <Input defaultValue="Integrallys Serviços Médicos LTDA" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">CNPJ</Label>
                  <Input defaultValue="12.345.678/0001-99" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">Inscrição Municipal</Label>
                  <Input defaultValue="9876543-2" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">Endereço Completo</Label>
                  <Input defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">Telefone de Contato</Label>
                  <Input defaultValue="(11) 3232-4040" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
                <div className="space-y-2">
                  <Label className="font-normal text-app-text-primary dark:text-white">E-mail Institucional</Label>
                  <Input defaultValue="contato@integrallys.com.br" className="h-11 rounded-[10px] font-normal dark:bg-app-bg-dark border-app-border dark:border-gray-800" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-app-border-dark">
                <Button variant="outline" className="h-11 px-6 rounded-[10px] font-normal border-app-border dark:border-gray-800">Descartar</Button>
                <Button className="h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#002d82] text-white font-normal shadow-lg shadow-[#0039A6]/10">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}

          {/* TAB: SISTEMA */}
          {settingsTab === 'Sistema' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#0039A6]" />
                  <h3 className="text-lg font-normal dark:text-white">Configurações globais</h3>
                </div>
                <p className="text-sm text-app-text-muted font-normal">Defina os parâmetros técnicos da plataforma.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-normal">Fuso horário</Label>
                  <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                    <SelectTrigger className="font-normal">
                      <SelectValue preferPlaceholder placeholder="Selecione">
                        {selectedTimezone ? timezoneLabels[selectedTimezone] || selectedTimezone : 'Selecione'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/sao_paulo" className="font-normal">América/São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="america/new_york" className="font-normal">América/New York (GMT-5)</SelectItem>
                      <SelectItem value="europe/london" className="font-normal">Europa/Londres (GMT+0)</SelectItem>
                      <SelectItem value="asia/tokyo" className="font-normal">Ásia/Tóquio (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-normal">Moeda padrão</Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger className="font-normal">
                      <SelectValue preferPlaceholder placeholder="Selecione">
                        {selectedCurrency ? currencyLabels[selectedCurrency] || selectedCurrency : 'Selecione'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brl" className="font-normal">Real (R$)</SelectItem>
                      <SelectItem value="usd" className="font-normal">Dólar (US$)</SelectItem>
                      <SelectItem value="eur" className="font-normal">Euro (€)</SelectItem>
                      <SelectItem value="gbp" className="font-normal">Libra (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-6 font-normal text-sm">
                <h4 className="text-sm font-normal  text-app-text-muted">Notificações e backup</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Notificações por e-mail', desc: 'Alertas de novos agendamentos', icon: Bell },
                    { label: 'Backup automático', desc: 'Sincronização diária na nuvem', icon: Globe },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-app-border-dark rounded-[12px] hover:bg-app-bg-secondary dark:hover:bg-app-card/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-[#0039A6]" />
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

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-app-border-dark">
                <Button variant="outline" className="h-11 px-6 rounded-[10px] font-normal">Cancelar</Button>
                <Button className="h-11 px-8 rounded-[10px] bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal">Salvar configurações</Button>
              </div>
            </div>
          )}

          {/* TAB: CADASTROS */}
          {settingsTab === 'Cadastros' && <CadastrosTab />}

          {/* TAB: INTEGRAÇÕES */}
          {settingsTab === 'Integrações' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between font-normal">
                <div className="space-y-1 font-normal">
                  <h3 className="text-lg font-normal dark:text-white">Conexões externas</h3>
                  <p className="text-sm text-app-text-muted font-normal">Serviços conectados à sua conta.</p>
                </div>
                <Button className="bg-[#0039A6] text-white rounded-[10px] gap-2 font-normal">
                  <ChevronRight className="h-4 w-4 " /> Nova API
                </Button>
              </div>

              <div className="rounded-[12px] border border-gray-100 dark:border-app-border-dark overflow-hidden font-normal">
                <Table>
                  <TableHeader className="bg-app-bg-secondary dark:bg-app-table-header-dark font-normal">
                    <TableRow>
                      <TableHead className="font-normal">Nome</TableHead>
                      <TableHead className="font-normal">Tipo</TableHead>
                      <TableHead className="font-normal">Status</TableHead>
                      <TableHead className="font-normal text-right px-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIntegrations.map((item) => (
                      <TableRow key={item.id} className="dark:hover:bg-app-card/5 font-normal">
                        <TableCell className="font-normal dark:text-white">{item.nome}</TableCell>
                        <TableCell><Badge variant="outline" className="rounded-full font-normal">{item.tipo}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-normal">
                            <span className={`w-2 h-2 rounded-full ${item.status === 'Ativa' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            <span className="text-sm font-normal">{item.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-6 font-normal">
                          <Button variant="ghost" size="icon" className="rounded-full"><Edit className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* TAB: HARDWARE */}
          {settingsTab === 'Hardware' && <HardwareView />}

          {/* TAB: SEGURANÇA */}
          {settingsTab === 'Segurança' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-1 font-normal">
                <div className="flex items-center gap-2 font-normal">
                  <Shield className="h-5 w-5 text-[#0039A6]" />
                  <h3 className="text-lg font-normal dark:text-white">Segurança e acesso</h3>
                </div>
                <p className="text-sm text-app-text-muted font-normal">Gerencie sua senha e sessões de login.</p>
              </div>

              <div className="max-w-2xl space-y-6 font-normal">
                <div className="space-y-4">
                  <h4 className="text-sm font-normal text-app-text-muted ">Alterar senha</h4>
                  <div className="space-y-4 font-normal">
                    <div className="space-y-2 font-normal">
                      <Label className="font-normal">Senha atual</Label>
                      <Input type="password" placeholder="••••••••" className="h-11 rounded-[10px] dark:bg-app-bg-dark font-normal" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-normal">
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
                  <Button className="bg-black text-white dark:bg-app-card dark:text-black rounded-[10px] h-11 px-6 font-normal">Atualizar senha</Button>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-app-border-dark space-y-4 font-normal">
                  <h4 className="text-sm font-normal text-app-text-muted ">Dispositivos conectados</h4>
                  <div className="space-y-3 font-normal">
                    <div className="flex items-center justify-between p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-[12px]">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-sm font-normal dark:text-white">iPhone 14 - São Paulo, BR</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-normal">Sessão Atual</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 dark:bg-emerald-500 text-white border-none font-normal">Online</Badge>
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
