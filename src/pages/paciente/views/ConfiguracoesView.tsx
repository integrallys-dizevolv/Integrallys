import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DateInput } from '@/components/ui/DateInput'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Switch } from '@/components/ui/Switch'
import { Upload, Bell, Lock, User } from 'lucide-react'

import { AlterarFotoModal } from '../modals/AlterarFotoModal'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { MOCK_PATIENT_PROFILE } from '@/mocks/paciente/perfil'
import { getPacientes, savePacientes } from '@/services/pacientes.service'

interface ConfiguracoesViewProps {
    onPageChange: (page: string) => void
}

export function ConfiguracoesView({ onPageChange }: ConfiguracoesViewProps) {
    const [isAlterarFotoModalOpen, setIsAlterarFotoModalOpen] = useState(false)
    const profile = MOCK_PATIENT_PROFILE

    const normalizeDate = (value: string) => {
        if (!value) return ''
        if (value.includes('-')) return value
        const parts = value.split('/')
        if (parts.length != 3) return ''
        const [day, month, year] = parts
        if (!day || !month || !year) return ''
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    const [formData, setFormData] = useState(() => ({
        nome: profile.name || '',
        cpf: profile.cpf || '',
        rg: '',
        inscricaoEstadual: '',
        dataNascimento: normalizeDate(profile.birthDate || ''),
        sexo: '',
        telefone: profile.phone || '',
        email: profile.email || '',
        indicacao: '',
        status: 'Ativo',
        vinculoTipo: 'cliente',
        addressDetails: {
            zipCode: profile.cep || '',
            street: profile.address || '',
            number: '',
            complement: '',
            neighborhood: profile.neighborhood || '',
            city: profile.city || '',
            state: profile.state || ''
        },
        responsible: {
            name: '',
            cpf: '',
            phone: '',
            relationship: '',
            birthDate: '',
            age: ''
        },
        financial: {
            requiresReceipt: 'nao',
            receiptData: {
                useProfileData: 'mesmos',
                taxId: '',
                name: '',
                address: ''
            }
        },
        specialNeeds: {
            hasNeeds: 'nao',
            categories: [] as string[],
            details: ''
        }
    }))
    const [patientAge, setPatientAge] = useState<number | null>(null)
    const [isLoadingCep, setIsLoadingCep] = useState(false)

    useEffect(() => {
        const loadLinkedPatient = async () => {
            const parsed = await getPacientes()
            const linked = parsed.find((item) => item.cpf === formData.cpf)
            if (!linked) return

            setFormData((prev) => ({
                ...prev,
                rg: linked.rg || prev.rg,
                inscricaoEstadual: linked.inscricaoEstadual || prev.inscricaoEstadual,
                vinculoTipo: linked.vinculoTipo || prev.vinculoTipo,
                specialNeeds: linked.specialNeeds
                    ? {
                        hasNeeds: linked.specialNeeds.hasNeeds ? 'sim' : 'nao',
                        categories: linked.specialNeeds.categories || [],
                        details: linked.specialNeeds.details || '',
                    }
                    : prev.specialNeeds,
            }))
        }

        void loadLinkedPatient()
    }, [formData.cpf])

    const calcAge = (dateValue: string) => {
        if (!dateValue) return null
        const birthDate = new Date(dateValue)
        if (Number.isNaN(birthDate.getTime())) return null
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const m = today.getMonth() - birthDate.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    useEffect(() => {
        if (!formData.dataNascimento) {
            setPatientAge(null)
            return
        }
        const age = calcAge(formData.dataNascimento)
        setPatientAge(age)
    }, [formData.dataNascimento])

    const handleBirthDateChange = (value: string) => {
        setFormData((prev) => ({ ...prev, dataNascimento: value }))
    }

    const handleResponsibleBirthDateChange = (value: string) => {
        let age = ''
        if (value) {
            const birthDate = new Date(value)
            const today = new Date()
            let calc = today.getFullYear() - birthDate.getFullYear()
            const m = today.getMonth() - birthDate.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calc--
            }
            age = String(calc)
        }
        setFormData((prev) => ({
            ...prev,
            responsible: { ...prev.responsible, birthDate: value, age }
        }))
    }

    const handleCepBlur = async () => {
        const cep = formData.addressDetails.zipCode.replace(/\D/g, '')
        if (cep.length != 8) return
        setIsLoadingCep(true)
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()
            if (!data.erro) {
                setFormData((prev) => ({
                    ...prev,
                    addressDetails: {
                        ...prev.addressDetails,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        state: data.uf
                    }
                }))
            }
        } catch {
            // ignore errors for now
        } finally {
            setIsLoadingCep(false)
        }
    }

    const updateAddress = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            addressDetails: { ...prev.addressDetails, [field]: value }
        }))
    }

    const toggleSpecialNeed = (category: string) => {
        setFormData((prev) => {
            const exists = prev.specialNeeds.categories.includes(category)
            return {
                ...prev,
                specialNeeds: {
                    ...prev.specialNeeds,
                    categories: exists
                        ? prev.specialNeeds.categories.filter((item) => item !== category)
                        : [...prev.specialNeeds.categories, category],
                }
            }
        })
    }

    const handleSavePerfil = () => {
        const save = async () => {
            const list = await getPacientes()
            const nextPatient = {
                id: `portal-${Date.now()}`,
                name: formData.nome,
                cpf: formData.cpf,
                rg: formData.rg,
                inscricaoEstadual: formData.inscricaoEstadual,
                phone: formData.telefone,
                email: formData.email,
                birthDate: formData.dataNascimento,
                gender: formData.sexo as 'masculino' | 'feminino' | 'outro' | undefined,
                source: formData.indicacao,
                status: 'complete' as const,
                activeStatus: formData.status as 'Ativo' | 'Inativo' | 'Óbito',
                vinculoTipo: formData.vinculoTipo as 'cliente' | 'fornecedor' | 'profissional' | 'usuario' | 'outro',
                addressDetails: formData.addressDetails,
                specialNeeds: {
                    hasNeeds: formData.specialNeeds.hasNeeds === 'sim',
                    categories: formData.specialNeeds.categories,
                    details: formData.specialNeeds.details,
                },
                responsible: formData.responsible,
                financial: {
                    requiresReceipt: formData.financial.requiresReceipt === 'sim',
                    receiptData: {
                        useProfileData: formData.financial.receiptData.useProfileData === 'mesmos',
                        taxId: formData.financial.receiptData.taxId,
                        name: formData.financial.receiptData.name,
                        address: formData.financial.receiptData.address,
                    }
                }
            }

            const existsIndex = list.findIndex((item) => item.cpf === formData.cpf)
            if (existsIndex >= 0) {
                list[existsIndex] = { ...list[existsIndex], ...nextPatient }
            } else {
                list.unshift(nextPatient)
            }

            await savePacientes(list)
        }

        void save()
    }

    const needsMandatoryResponsible = patientAge !== null && patientAge < 18
    const showOptionalResponsible = patientAge !== null && patientAge > 70




    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink onClick={() => onPageChange('inicio')} className="cursor-pointer">Início</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Configurações Pessoais</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações Pessoais</h2>

            <Tabs defaultValue="perfil" className="w-full">
                <TabsList
                    className="w-full justify-start h-12 p-1 rounded-[14px] mb-8 bg-gray-100 dark:bg-[#0c1e3d] flex flex-wrap sm:flex-nowrap gap-1 overflow-x-auto scrollbar-hide"
                >
                    <TabsTrigger
                        value="perfil"
                        className="flex-1 min-w-[80px] h-full rounded-[12px] px-4 py-2 text-sm font-normal text-gray-500 dark:text-gray-400 data-[state=active]:bg-[#0039A6] data-[state=active]:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-all data-[state=active]:shadow-md"
                    >
                        Perfil
                    </TabsTrigger>

                    <TabsTrigger
                        value="notificacoes"
                        className="flex-1 min-w-[80px] h-full rounded-[12px] px-4 py-2 text-sm font-normal text-gray-500 dark:text-gray-400 data-[state=active]:bg-[#0039A6] data-[state=active]:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-all data-[state=active]:shadow-md"
                    >
                        Notificações
                    </TabsTrigger>

                    <TabsTrigger
                        value="seguranca"
                        className="flex-1 min-w-[80px] h-full rounded-[12px] px-4 py-2 text-sm font-normal text-gray-500 dark:text-gray-400 data-[state=active]:bg-[#0039A6] data-[state=active]:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-all data-[state=active]:shadow-md"
                    >
                        Segurança
                    </TabsTrigger>
                </TabsList>

                {/* --- PERFIL TAB --- */}
                <TabsContent value="perfil" className="space-y-6">
                    <div className="bg-app-card dark:bg-app-card-dark rounded-[14px] p-6 sm:p-8 shadow-sm border border-app-border dark:border-app-border-dark">
                        {/* Header Section */}
                        <div className="flex flex-col gap-6 mb-8">
                            <div className="flex items-center gap-2 text-app-primary dark:text-emerald-400">
                                <User className="h-5 w-5" />
                                <h3 className="text-lg font-semibold text-app-text-primary dark:text-white">Perfil do Paciente</h3>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-full bg-app-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
                                    {profile.initials}
                                </div>
                                <div>
                                    <Button
                                        variant="outline"
                                        className="flex flex-row items-center justify-center gap-2 h-10 px-4 rounded-[10px] border-app-border dark:border-app-border-dark whitespace-nowrap shrink-0"
                                        onClick={() => setIsAlterarFotoModalOpen(true)}
                                    >
                                        <Upload className="h-4 w-4 shrink-0" />
                                        Alterar Foto
                                    </Button>
                                    <AlterarFotoModal
                                        isOpen={isAlterarFotoModalOpen}
                                        onClose={() => setIsAlterarFotoModalOpen(false)}
                                    />

                                    <p className="text-xs text-app-text-muted mt-2">JPG, PNG ou GIF. Máx. 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-8">
                            <div className="rounded-[12px] border border-app-border dark:border-app-border-dark p-5">
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Dados pessoais</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Nome completo *</Label>
                                        <Input
                                            value={formData.nome}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">CPF *</Label>
                                        <Input
                                            value={formData.cpf}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, cpf: e.target.value }))}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">RG</Label>
                                        <Input
                                            value={formData.rg}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, rg: e.target.value }))}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Inscricao estadual</Label>
                                        <Input
                                            value={formData.inscricaoEstadual}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, inscricaoEstadual: e.target.value }))}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Data de nascimento *</Label>
                                        <DateInput
                                            value={formData.dataNascimento}
                                            onChange={handleBirthDateChange}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Sexo *</Label>
                                        <Select value={formData.sexo} onValueChange={(val) => setFormData((prev) => ({ ...prev, sexo: val }))}>
                                            <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                <SelectValue preferPlaceholder placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="masculino">Masculino</SelectItem>
                                                <SelectItem value="feminino">Feminino</SelectItem>
                                                <SelectItem value="outro">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Status</Label>
                                        <Select value={formData.status} onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}>
                                            <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                <SelectValue preferPlaceholder placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ativo">Ativo</SelectItem>
                                                <SelectItem value="Inativo">Inativo</SelectItem>
                                                <SelectItem value="Obito">Obito</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Origem</Label>
                                        <Select value={formData.indicacao} onValueChange={(val) => setFormData((prev) => ({ ...prev, indicacao: val }))}>
                                            <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                <SelectValue preferPlaceholder placeholder="Como nos achou?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="instagram">Instagram</SelectItem>
                                                <SelectItem value="google">Google</SelectItem>
                                                <SelectItem value="indicacao">Indicação</SelectItem>
                                                <SelectItem value="outros">Outros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Tipo de cadastro</Label>
                                        <Select value={formData.vinculoTipo} onValueChange={(val) => setFormData((prev) => ({ ...prev, vinculoTipo: val }))}>
                                            <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                <SelectValue preferPlaceholder placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cliente">Cliente</SelectItem>
                                                <SelectItem value="fornecedor">Fornecedor</SelectItem>
                                                <SelectItem value="profissional">Profissional</SelectItem>
                                                <SelectItem value="usuario">Usuário</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[12px] border border-app-border dark:border-app-border-dark p-5">
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Necessidades especiais</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Portador de necessidade especial?</Label>
                                        <Select value={formData.specialNeeds.hasNeeds} onValueChange={(val) => setFormData((prev) => ({ ...prev, specialNeeds: { ...prev.specialNeeds, hasNeeds: val } }))}>
                                            <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                <SelectValue preferPlaceholder placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sim">Sim</SelectItem>
                                                <SelectItem value="nao">Não</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {formData.specialNeeds.hasNeeds === 'sim' && (
                                    <div className="mt-4 space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {['Física', 'Auditiva', 'Visual', 'Intelectual'].map((category) => {
                                                const active = formData.specialNeeds.categories.includes(category)
                                                return (
                                                    <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() => toggleSpecialNeed(category)}
                                                        className={`px-3 py-1.5 rounded-full text-xs border ${active ? 'bg-[#0039A6] text-white border-[#0039A6]' : 'border-app-border text-app-text-secondary'}`}
                                                    >
                                                        {category}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Descrição</Label>
                                            <Input
                                                value={formData.specialNeeds.details}
                                                onChange={(e) => setFormData((prev) => ({ ...prev, specialNeeds: { ...prev.specialNeeds, details: e.target.value } }))}
                                                className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-[12px] border border-app-border dark:border-app-border-dark p-5">
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Endereco</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">CEP</Label>
                                        <div className="relative">
                                            <Input
                                                value={formData.addressDetails.zipCode}
                                                onChange={(e) => updateAddress('zipCode', e.target.value)}
                                                onBlur={handleCepBlur}
                                                className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all pr-10"
                                            />
                                            {isLoadingCep && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-[#0039A6] border-t-transparent rounded-full animate-spin" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Logradouro</Label>
                                        <Input
                                            value={formData.addressDetails.street}
                                            onChange={(e) => updateAddress('street', e.target.value)}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Numero</Label>
                                        <Input
                                            value={formData.addressDetails.number}
                                            onChange={(e) => updateAddress('number', e.target.value)}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Complemento</Label>
                                        <Input
                                            value={formData.addressDetails.complement}
                                            onChange={(e) => updateAddress('complement', e.target.value)}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Bairro</Label>
                                        <Input
                                            value={formData.addressDetails.neighborhood}
                                            onChange={(e) => updateAddress('neighborhood', e.target.value)}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Cidade</Label>
                                        <Input
                                            value={formData.addressDetails.city}
                                            onChange={(e) => updateAddress('city', e.target.value)}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Estado</Label>
                                        <Input
                                            value={formData.addressDetails.state}
                                            onChange={(e) => updateAddress('state', e.target.value)}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-[12px] border border-app-border dark:border-app-border-dark p-5">
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Contato</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Telefone / WhatsApp *</Label>
                                        <Input
                                            value={formData.telefone}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Email</Label>
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                            className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all"
                                        />
                                    </div>
                                </div>

                                {(needsMandatoryResponsible || showOptionalResponsible || formData.responsible.name) && (
                                    <div className="mt-6 rounded-[12px] border border-app-border dark:border-app-border-dark p-5 bg-app-bg-secondary/40 dark:bg-app-bg-dark/30">
                                        <h5 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Responsavel legal</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Nome</Label>
                                                <Input
                                                    value={formData.responsible.name}
                                                    onChange={(e) => setFormData((prev) => ({
                                                        ...prev,
                                                        responsible: { ...prev.responsible, name: e.target.value }
                                                    }))}
                                                    className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">CPF</Label>
                                                <Input
                                                    value={formData.responsible.cpf}
                                                    onChange={(e) => setFormData((prev) => ({
                                                        ...prev,
                                                        responsible: { ...prev.responsible, cpf: e.target.value }
                                                    }))}
                                                    className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Telefone</Label>
                                                <Input
                                                    value={formData.responsible.phone}
                                                    onChange={(e) => setFormData((prev) => ({
                                                        ...prev,
                                                        responsible: { ...prev.responsible, phone: e.target.value }
                                                    }))}
                                                    className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Vinculo</Label>
                                                <Select
                                                    value={formData.responsible.relationship}
                                                    onValueChange={(value) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            responsible: { ...prev.responsible, relationship: value },
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                        <SelectValue preferPlaceholder placeholder="Selecione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Pai">Pai</SelectItem>
                                                        <SelectItem value="Mãe">Mãe</SelectItem>
                                                        <SelectItem value="Irmão">Irmão</SelectItem>
                                                        <SelectItem value="Avô/Avó">Avô/Avó</SelectItem>
                                                        <SelectItem value="Outro">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Data de nascimento</Label>
                                                <DateInput
                                                    value={formData.responsible.birthDate}
                                                    onChange={handleResponsibleBirthDateChange}
                                                    className="h-11 rounded-[10px] bg-white dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Idade</Label>
                                                <Input
                                                    value={formData.responsible.age}
                                                    readOnly
                                                    className="h-11 rounded-[10px] bg-gray-50 dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-[12px] border border-app-border dark:border-app-border-dark p-5">
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Financeiro e recibo</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Exige nota fiscal?</Label>
                                        <Select
                                            value={formData.financial.requiresReceipt}
                                            onValueChange={(val) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    financial: { ...prev.financial, requiresReceipt: val }
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                <SelectValue preferPlaceholder placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sim">Sim</SelectItem>
                                                <SelectItem value="nao">Nao</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {formData.financial.requiresReceipt === 'sim' && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Dados de faturamento</Label>
                                            <Select
                                                value={formData.financial.receiptData.useProfileData}
                                                onValueChange={(val) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        financial: {
                                                            ...prev.financial,
                                                            receiptData: { ...prev.financial.receiptData, useProfileData: val }
                                                        }
                                                    }))
                                                }
                                            >
                                                <SelectTrigger className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark">
                                                    <SelectValue preferPlaceholder placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mesmos">Mesmos dados do cadastro</SelectItem>
                                                    <SelectItem value="adicionar">Outros dados</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>

                                {formData.financial.requiresReceipt === 'sim' && formData.financial.receiptData.useProfileData === 'adicionar' && (
                                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Nome ou razao social</Label>
                                            <Input
                                                value={formData.financial.receiptData.name}
                                                onChange={(e) => setFormData((prev) => ({
                                                    ...prev,
                                                    financial: {
                                                        ...prev.financial,
                                                        receiptData: { ...prev.financial.receiptData, name: e.target.value }
                                                    }
                                                }))}
                                                className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">CPF ou CNPJ</Label>
                                            <Input
                                                value={formData.financial.receiptData.taxId}
                                                onChange={(e) => setFormData((prev) => ({
                                                    ...prev,
                                                    financial: {
                                                        ...prev.financial,
                                                        receiptData: { ...prev.financial.receiptData, taxId: e.target.value }
                                                    }
                                                }))}
                                                className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Endereco de cobranca</Label>
                                            <Input
                                                value={formData.financial.receiptData.address}
                                                onChange={(e) => setFormData((prev) => ({
                                                    ...prev,
                                                    financial: {
                                                        ...prev.financial,
                                                        receiptData: { ...prev.financial.receiptData, address: e.target.value }
                                                    }
                                                }))}
                                                className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                                <Button variant="outline" className="h-11 rounded-[10px] px-6">Cancelar</Button>
                                <Button onClick={handleSavePerfil} className="h-11 rounded-[10px] px-6 bg-app-primary hover:bg-app-primary/90 text-white shadow-lg shadow-blue-900/20">Salvar Alteracoes</Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- NOTIFICACOES TAB --- */}
                <TabsContent value="notificacoes" className="space-y-6">
                    <div className="bg-app-card dark:bg-app-card-dark rounded-[14px] p-6 sm:p-8 shadow-sm border border-app-border dark:border-app-border-dark">
                        <div className="flex items-center gap-2 mb-8 text-app-primary dark:text-app-primary">
                            <Bell className="h-5 w-5" />
                            <h3 className="text-lg font-semibold text-app-text-primary dark:text-white">Preferências de Notificações</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Canais de Comunicação</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-app-text-primary dark:text-white">Notificações por Email</p>
                                            <p className="text-sm text-app-text-muted">Receba notificações no seu email cadastrado</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-app-primary" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-app-text-primary dark:text-white">Notificações por SMS</p>
                                            <p className="text-sm text-app-text-muted">Receba SMS com lembretes importantes</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-app-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-app-border dark:border-app-border-dark pt-6">
                                <h4 className="text-sm font-semibold text-app-text-primary dark:text-white mb-4">Tipos de Notificação</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-app-text-primary dark:text-white">Lembretes de Consultas</p>
                                            <p className="text-sm text-app-text-muted">Receba lembretes 24h antes das consultas</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-app-primary" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-app-text-primary dark:text-white">Avisos de Pagamento</p>
                                            <p className="text-sm text-app-text-muted">Notificações sobre pagamentos pendentes</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-app-primary" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-app-text-primary dark:text-white">Promoções e Novidades</p>
                                            <p className="text-sm text-app-text-muted">Receba ofertas e atualizações da clínica</p>
                                        </div>
                                        <Switch className="data-[state=checked]:bg-app-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
                            <Button
                                variant="outline"
                                className="h-11 rounded-[10px] px-6 font-semibold whitespace-nowrap transition-all active:scale-95 w-full sm:w-auto border-app-border dark:border-white/10 text-app-text-secondary dark:text-gray-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="h-11 rounded-[10px] px-6 bg-app-primary hover:bg-app-primary/90 text-white font-semibold whitespace-nowrap transition-all active:scale-95 w-full sm:w-auto"
                            >
                                Salvar Preferências
                            </Button>
                        </div>
                    </div>
                </TabsContent>



                {/* --- SEGURANCA TAB --- */}
                <TabsContent value="seguranca" className="space-y-6">
                    <div className="bg-app-card dark:bg-app-card-dark rounded-[14px] p-6 sm:p-8 shadow-sm border border-app-border dark:border-app-border-dark">
                        <div className="flex items-center gap-2 mb-2 text-app-primary dark:text-emerald-400">
                            <Lock className="h-5 w-5" />
                            <h3 className="text-lg font-semibold text-app-text-primary dark:text-white">Segurança da Conta</h3>
                        </div>
                        <p className="text-sm text-app-text-muted mb-8">Altere sua senha de acesso</p>

                        <div className="space-y-6 max-w-2xl">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Senha Atual *</label>
                                <Input type="password" className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Nova Senha *</label>
                                <Input type="password" className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all" />
                                <p className="text-xs text-app-text-muted">Mínimo de 8 caracteres com letras e números</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-app-text-secondary dark:text-gray-300">Confirmar Nova Senha *</label>
                                <Input type="password" className="h-11 rounded-[10px] bg-app-bg-secondary dark:bg-app-bg-dark border-app-border dark:border-app-border-dark focus:bg-app-card transition-all" />
                            </div>


                        </div>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
                            <Button
                                variant="outline"
                                className="h-11 rounded-[10px] px-6 font-semibold whitespace-nowrap transition-all active:scale-95 w-full sm:w-auto border-app-border dark:border-white/10 text-app-text-secondary dark:text-gray-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="h-11 rounded-[10px] px-6 bg-app-primary hover:bg-app-primary/90 text-white font-semibold whitespace-nowrap transition-all active:scale-95 w-full sm:w-auto"
                            >
                                Alterar Senha
                            </Button>
                        </div>

                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
