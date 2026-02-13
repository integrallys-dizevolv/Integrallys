import React, { useState, useEffect } from 'react'
import { Phone, Printer, User, MapPin, CreditCard, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DateInput } from '@/components/ui/DateInput'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Patient } from '../../../context/types';

interface EditarPacienteModalProps {
    isOpen: boolean
    onClose: () => void
    paciente: Patient | null
}

export function EditarPacienteModal({ isOpen, onClose, paciente }: EditarPacienteModalProps) {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        rg: '',
        inscricaoEstadual: '',
        dataNascimento: '',
        sexo: '',
        telefone: '',
        email: '',
        indicacao: '',
        status: 'Ativo',
        addressDetails: {
            zipCode: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: ''
        },
        specialNeeds: { hasNeeds: 'nao', categories: [] as string[], details: '' },
        responsible: { name: '', cpf: '', phone: '', relationship: '', birthDate: '', age: '' },
        financial: {
            requiresReceipt: 'nao',
            receiptData: { useProfileData: 'mesmos', taxId: '', name: '', address: '' }
        }
    })

    const [patientAge, setPatientAge] = useState<number | null>(null);
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (paciente) {
            const birthDate = paciente.birthDate ? new Date(paciente.birthDate) : null;
            let age: number | null = null;
            if (birthDate) {
                const today = new Date();
                age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
            }
            setPatientAge(age);

            setFormData({
                nome: paciente.name || '',
                cpf: paciente.cpf || '',
                rg: paciente.rg || '',
                inscricaoEstadual: (paciente as any).inscricaoEstadual || '',
                dataNascimento: paciente.birthDate || '',
                sexo: paciente.gender || '',
                telefone: paciente.phone || '',
                email: paciente.email || '',
                indicacao: paciente.source || '',
                status: paciente.activeStatus || 'Ativo',
                addressDetails: {
                    zipCode: paciente.addressDetails?.zipCode || '',
                    street: paciente.addressDetails?.street || '',
                    number: paciente.addressDetails?.number || '',
                    complement: paciente.addressDetails?.complement || '',
                    neighborhood: paciente.addressDetails?.neighborhood || '',
                    city: paciente.addressDetails?.city || '',
                    state: paciente.addressDetails?.state || ''
                },
                specialNeeds: {
                    hasNeeds: (paciente.specialNeeds?.hasNeeds === true || paciente.specialNeeds?.hasNeeds === 'sim') ? 'sim' : 'nao',
                    categories: (paciente.specialNeeds as any)?.categories || (paciente.specialNeeds as any)?.types || [],
                    details: paciente.specialNeeds?.details || ''
                },
                responsible: {
                    name: paciente.responsible?.name || '',
                    cpf: paciente.responsible?.cpf || '',
                    phone: paciente.responsible?.phone || '',
                    relationship: paciente.responsible?.relationship || '',
                    birthDate: (paciente.responsible as any)?.birthDate || '',
                    age: (paciente.responsible as any)?.age || ''
                },
                financial: {
                    requiresReceipt: (paciente.financial?.requiresReceipt === true || paciente.financial?.requiresReceipt === 'sim') ? 'sim' : 'nao',
                    receiptData: {
                        useProfileData: (paciente.financial?.receiptData?.useProfileData === true || paciente.financial?.receiptData?.useProfileData === 'mesmos') ? 'mesmos' : 'adicionar',
                        taxId: paciente.financial?.receiptData?.taxId || '',
                        name: paciente.financial?.receiptData?.name || '',
                        address: paciente.financial?.receiptData?.address || ''
                    }
                }
            });
        }
    }, [paciente]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setFormData({ ...formData, dataNascimento: date });

        if (date) {
            const birthDate = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setPatientAge(age);
        }
    }

    const handleRespDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        let age = '';
        if (date) {
            const birthDate = new Date(date);
            const today = new Date();
            let calcAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calcAge--;
            }
            age = calcAge.toString();
        }
        setFormData(prev => ({ ...prev, responsible: { ...prev.responsible, birthDate: date, age } }));
    }

    const needsMandatoryResponsible = patientAge !== null && patientAge < 18;
    const showOptionalResponsible = patientAge !== null && patientAge > 70;

    const handleCepBlur = async () => {
        const cep = formData.addressDetails.zipCode.replace(/\D/g, '');
        if (cep.length === 8) {
            setIsLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        addressDetails: {
                            ...prev.addressDetails,
                            street: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf
                        }
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
            } finally {
                setIsLoadingCep(false);
            }
        }
    }

    const updateAddress = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            addressDetails: { ...prev.addressDetails, [field]: value }
        }));
    }

    const toggleSpecialNeed = (category: string) => {
        const current = formData.specialNeeds.categories;
        const updated = current.includes(category)
            ? current.filter(t => t !== category)
            : [...current, category];
        setFormData(prev => ({ ...prev, specialNeeds: { ...prev.specialNeeds, categories: updated } }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Dados atualizados:", formData);
        setIsSaved(true);
    }

    const FormSectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle?: string }) => (
        <div className="flex items-center gap-3 mb-6 mt-2">
            <div className="h-10 w-10 rounded-xl bg-[#0039A6]/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-[#0039A6]" />
            </div>
            <div>
                <h3 className="text-[17px] font-semibold text-[#101828] dark:text-white leading-tight">{title}</h3>
                {subtitle && <p className="text-xs text-[#667085] dark:text-gray-400 font-normal mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1000px] w-[95%] max-h-[90vh] bg-app-card dark:bg-app-card-dark p-0 overflow-hidden border-none rounded-[28px] print:hidden flex flex-col">
                <DialogHeader className="p-6 md:p-8 pb-4 border-b border-app-border dark:border-white/5 shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-app-text-primary dark:text-white">Editar paciente</DialogTitle>
                            <DialogDescription className="text-app-text-secondary dark:text-white/60">Atualize as informações do cadastro de {formData.nome || 'paciente'}.</DialogDescription>
                        </div>
                        <Button variant="outline" onClick={() => window.print()} className="h-10 rounded-xl border-gray-200 dark:border-white/10 gap-2 text-xs font-bold uppercase tracking-tight">
                            <Printer size={16} /> Imprimir Ficha
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 py-6 bg-app-bg-secondary dark:bg-transparent">
                    {!isSaved ? (
                        <form id="editar-paciente-form" onSubmit={handleSubmit} className="space-y-12">

                            {/* 1. Informações Básicas */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-app-border dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <FormSectionHeader icon={User} title="Dados pessoais" subtitle="Informações de identificação do paciente" />
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-5">
                                    <div className="md:col-span-4 space-y-2">
                                        <Label htmlFor="nome" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Nome completo *</Label>
                                        <Input id="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="h-11 rounded-xl focus:ring-2 focus:ring-[#0039A6]/20 transition-all border-gray-200 dark:border-white/10" required />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="cpf" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">CPF *</Label>
                                        <Input id="cpf" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} className="h-11 rounded-xl border-gray-200 dark:border-white/10" placeholder="000.000.000-00" required />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="rg" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">RG</Label>
                                        <Input id="rg" value={formData.rg} onChange={(e) => setFormData({ ...formData, rg: e.target.value })} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="ie" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Inscrição Estadual</Label>
                                        <Input id="ie" value={formData.inscricaoEstadual} onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="dataNascimento" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Data de nascimento *</Label>
                                        <div className="relative">
                                            <DateInput id="dataNascimento" value={formData.dataNascimento} onChange={(val) => handleDateChange({ target: { value: val } } as any)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" required />
                                            {patientAge !== null && (
                                                <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <span className="px-2 py-0.5 rounded-full bg-[#0039A6] text-white text-[10px] font-bold uppercase tracking-wider">{patientAge} anos</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Sexo *</Label>
                                        <Select value={formData.sexo} onValueChange={(v) => setFormData({ ...formData, sexo: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-gray-200 dark:border-white/10"><SelectValue preferPlaceholder placeholder="Selecione" /></SelectTrigger>
                                            <SelectContent><SelectItem value="masculino">Masculino</SelectItem><SelectItem value="feminino">Feminino</SelectItem><SelectItem value="outro">Outro</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Status</Label>
                                        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-gray-200 dark:border-white/10"><SelectValue preferPlaceholder placeholder="Selecione" /></SelectTrigger>
                                            <SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Inativo">Inativo</SelectItem><SelectItem value="Óbito">Óbito</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Origem *</Label>
                                        <Select value={formData.indicacao} onValueChange={(v) => setFormData({ ...formData, indicacao: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-gray-200 dark:border-white/10"><SelectValue preferPlaceholder placeholder="Como nos achou?" /></SelectTrigger>
                                            <SelectContent><SelectItem value="instagram">Instagram</SelectItem><SelectItem value="google">Google</SelectItem><SelectItem value="indicacao">Indicação</SelectItem><SelectItem value="outros">Outros</SelectItem></SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Localização */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-app-border dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <FormSectionHeader icon={MapPin} title="Endereço" subtitle="Localização para visitas e faturamento" />
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-x-5 gap-y-5">
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="cep" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">CEP</Label>
                                        <div className="relative">
                                            <Input id="cep" value={formData.addressDetails.zipCode} onChange={(e) => updateAddress('zipCode', e.target.value)} onBlur={handleCepBlur} className="h-11 rounded-xl pr-10 border-gray-200 dark:border-white/10" placeholder="00000-000" />
                                            {isLoadingCep && <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-[#0039A6] border-t-transparent rounded-full animate-spin" />}
                                        </div>
                                    </div>
                                    <div className="md:col-span-3 space-y-2">
                                        <Label htmlFor="logradouro" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Logradouro</Label>
                                        <Input id="logradouro" value={formData.addressDetails.street} onChange={(e) => updateAddress('street', e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-1 space-y-2">
                                        <Label htmlFor="numero" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Nº</Label>
                                        <Input id="numero" value={formData.addressDetails.number} onChange={(e) => updateAddress('number', e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="bairro" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Bairro</Label>
                                        <Input id="bairro" value={formData.addressDetails.neighborhood} onChange={(e) => updateAddress('neighborhood', e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="cidade" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Cidade</Label>
                                        <Input id="cidade" value={formData.addressDetails.city} onChange={(e) => updateAddress('city', e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-1 space-y-2">
                                        <Label htmlFor="uf" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">UF</Label>
                                        <Input id="uf" value={formData.addressDetails.state} onChange={(e) => updateAddress('state', e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="md:col-span-1 space-y-2">
                                        <Label htmlFor="complemento" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Comp.</Label>
                                        <Input id="complemento" value={formData.addressDetails.complement} onChange={(e) => updateAddress('complement', e.target.value)} className="h-11 rounded-xl border-gray-200 dark:border-white/10" />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Contato e Responsável */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-app-border dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <FormSectionHeader icon={Phone} title="Contato" subtitle="Canais de comunicação e responsáveis" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">Telefone / WhatsApp *</Label>
                                        <Input id="telefone" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} className="h-11 rounded-xl border-gray-200 dark:border-white/10" placeholder="(00) 00000-0000" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs font-bold text-[#344054] dark:text-gray-300 uppercase tracking-tight">E-mail</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 rounded-xl border-gray-200 dark:border-white/10" placeholder="exemplo@email.com" />
                                    </div>
                                </div>

                                {(needsMandatoryResponsible || showOptionalResponsible || formData.responsible.name) && (
                                    <div className="mt-8 p-6 bg-[#F8FAFC] dark:bg-white/5 rounded-2xl border border-app-border dark:border-white/5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2.5 w-2.5 rounded-full bg-[#0039A6]" />
                                                <h4 className="text-sm font-bold text-[#101828] dark:text-white uppercase tracking-widest">Responsável Legal</h4>
                                                {needsMandatoryResponsible && <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-tight">Obrigatório</span>}
                                            </div>
                                            {showOptionalResponsible && !needsMandatoryResponsible && (
                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, responsible: { name: '', cpf: '', phone: '', relationship: '', birthDate: '', age: '' } }))} className="text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tight">Remover dados</button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="resp-nome" className="text-xs font-bold text-[#475467] dark:text-gray-400 uppercase">Nome completo {needsMandatoryResponsible && '*'}</Label>
                                                <Input id="resp-nome" value={formData.responsible.name} onChange={(e) => setFormData(prev => ({ ...prev, responsible: { ...prev.responsible, name: e.target.value } }))} required={needsMandatoryResponsible} className="h-11 rounded-xl bg-white dark:bg-transparent border-gray-200 dark:border-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="resp-cpf" className="text-xs font-bold text-[#475467] dark:text-gray-400 uppercase">CPF do Responsável</Label>
                                                <Input id="resp-cpf" value={formData.responsible.cpf} onChange={(e) => setFormData(prev => ({ ...prev, responsible: { ...prev.responsible, cpf: e.target.value } }))} className="h-11 rounded-xl bg-white dark:bg-transparent border-gray-200 dark:border-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="resp-tel" className="text-xs font-bold text-[#475467] dark:text-gray-400 uppercase">Telefone do Responsável</Label>
                                                <Input id="resp-tel" value={formData.responsible.phone} onChange={(e) => setFormData(prev => ({ ...prev, responsible: { ...prev.responsible, phone: e.target.value } }))} className="h-11 rounded-xl bg-white dark:bg-transparent border-gray-200 dark:border-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="resp-nasc" className="text-xs font-bold text-[#475467] dark:text-gray-400 uppercase">Data de Nascimento</Label>
                                                <DateInput id="resp-nasc" value={formData.responsible.birthDate} onChange={(val) => handleRespDateChange({ target: { value: val } } as any)} className="h-11 rounded-xl bg-white dark:bg-transparent border-gray-200 dark:border-white/10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold text-[#475467] dark:text-gray-400 uppercase">Parentesco / Vínculo</Label>
                                                <Select value={formData.responsible.relationship} onValueChange={(v) => setFormData(prev => ({ ...prev, responsible: { ...prev.responsible, relationship: v } }))}>
                                                    <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-transparent border-gray-200 dark:border-white/10"><SelectValue preferPlaceholder placeholder="Selecione" /></SelectTrigger>
                                                    <SelectContent><SelectItem value="Pai">Pai</SelectItem><SelectItem value="Mãe">Mãe</SelectItem><SelectItem value="Irmão/ã">Irmão/ã</SelectItem><SelectItem value="Avô/ó">Avô/ó</SelectItem><SelectItem value="Outros">Outros</SelectItem></SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 4. Necessidades Especiais */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-app-border dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <FormSectionHeader icon={Heart} title="Necessidades Especiais" subtitle="Orientações e suporte assistencial" />
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-[#344054] dark:text-gray-300">Portador de necessidade especial?</Label>
                                        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-[280px]">
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, specialNeeds: { ...prev.specialNeeds, hasNeeds: 'sim' } }))} className={`flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${formData.specialNeeds.hasNeeds === 'sim' ? 'bg-white dark:bg-[#0039A6] text-[#0039A6] dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Sim</button>
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, specialNeeds: { ...prev.specialNeeds, hasNeeds: 'nao' } }))} className={`flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${formData.specialNeeds.hasNeeds === 'nao' ? 'bg-white dark:bg-[#0039A6] text-[#0039A6] dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Não</button>
                                        </div>
                                    </div>
                                    {formData.specialNeeds.hasNeeds === 'sim' && (
                                        <div className="p-6 bg-blue-50/20 dark:bg-[#0039A6]/5 rounded-2xl border border-blue-100 dark:border-blue-900/20 space-y-6 animate-in fade-in slide-in-from-top-1">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black text-[#0039A6] uppercase tracking-widest">CATEGORIAS</Label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Física', 'Auditiva', 'Visual', 'Intelectual'].map(cat => (
                                                        <label key={cat} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${formData.specialNeeds.categories.includes(cat) ? 'bg-[#0039A6] border-[#0039A6] text-white shadow-md' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#0039A6]/50'}`}>
                                                            <input type="checkbox" checked={formData.specialNeeds.categories.includes(cat)} onChange={() => toggleSpecialNeed(cat)} className="hidden" />
                                                            <span className="text-xs font-bold uppercase tracking-tight">{cat}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            {formData.specialNeeds.categories.length > 0 && (
                                                <div className="space-y-2 animate-in fade-in zoom-in-95">
                                                    <Label htmlFor="needs-details" className="text-[10px] font-black text-[#0039A6] uppercase tracking-widest">DESCRIÇÃO DETALHADA</Label>
                                                    <Input id="needs-details" value={formData.specialNeeds.details} onChange={(e) => setFormData(prev => ({ ...prev, specialNeeds: { ...prev.specialNeeds, details: e.target.value } }))} placeholder="Ex: Baixa visão no olho esquerdo, necessita de fonte ampliada..." className="h-11 rounded-xl bg-white dark:bg-transparent border-gray-200 dark:border-white/10" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 5. Financeiro */}
                            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-app-border dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <FormSectionHeader icon={CreditCard} title="Financeiro & NF" subtitle="Dados para faturamento e emissão de recibos" />
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-[#344054] dark:text-gray-300">Exige emissão de Nota Fiscal?</Label>
                                        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-[280px]">
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, financial: { ...prev.financial, requiresReceipt: 'sim' } }))} className={`flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${formData.financial.requiresReceipt === 'sim' ? 'bg-white dark:bg-[#0039A6] text-[#0039A6] dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Sim</button>
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, financial: { ...prev.financial, requiresReceipt: 'nao' } }))} className={`flex-1 h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${formData.financial.requiresReceipt === 'nao' ? 'bg-white dark:bg-[#0039A6] text-[#0039A6] dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Não</button>
                                        </div>
                                    </div>

                                    {formData.financial.requiresReceipt === 'sim' && (
                                        <div className="p-6 bg-emerald-50/20 dark:bg-emerald-900/5 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 space-y-6 animate-in fade-in slide-in-from-top-1">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">DADOS DE FATURAMENTO</Label>
                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.financial.receiptData.useProfileData === 'mesmos' ? 'border-[#0039A6] bg-[#0039A6]/10' : 'border-gray-200 group-hover:border-[#0039A6]'}`}>
                                                            {formData.financial.receiptData.useProfileData === 'mesmos' && <div className="h-3 w-3 rounded-full bg-[#0039A6]" />}
                                                        </div>
                                                        <input type="radio" checked={formData.financial.receiptData.useProfileData === 'mesmos'} onChange={() => setFormData(prev => ({ ...prev, financial: { ...prev.financial, receiptData: { ...prev.financial.receiptData, useProfileData: 'mesmos' } } }))} className="hidden" />
                                                        <span className="text-sm font-medium dark:text-gray-300">Mesmo dados do paciente</span>
                                                    </label>
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.financial.receiptData.useProfileData === 'adicionar' ? 'border-[#0039A6] bg-[#0039A6]/10' : 'border-gray-200 group-hover:border-[#0039A6]'}`}>
                                                            {formData.financial.receiptData.useProfileData === 'adicionar' && <div className="h-3 w-3 rounded-full bg-[#0039A6]" />}
                                                        </div>
                                                        <input type="radio" checked={formData.financial.receiptData.useProfileData === 'adicionar'} onChange={() => setFormData(prev => ({ ...prev, financial: { ...prev.financial, receiptData: { ...prev.financial.receiptData, useProfileData: 'adicionar' } } }))} className="hidden" />
                                                        <span className="text-sm font-medium dark:text-gray-300">Usar faturamento de terceiros</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {formData.financial.receiptData.useProfileData === 'adicionar' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in zoom-in-95">
                                                    <div className="md:col-span-2 space-y-2">
                                                        <Label className="text-[10px] font-bold text-emerald-800 uppercase">NOME OU RAZÃO SOCIAL</Label>
                                                        <Input value={formData.financial.receiptData.name} onChange={(e) => setFormData(prev => ({ ...prev, financial: { ...prev.financial, receiptData: { ...prev.financial.receiptData, name: e.target.value } } }))} placeholder="Ex: Empresa do Responsável ou Parente" className="h-11 rounded-xl bg-white dark:bg-transparent border-emerald-100 dark:border-emerald-900/40" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-emerald-800 uppercase">CPF OU CNPJ</Label>
                                                        <Input value={formData.financial.receiptData.taxId} onChange={(e) => setFormData(prev => ({ ...prev, financial: { ...prev.financial, receiptData: { ...prev.financial.receiptData, taxId: e.target.value } } }))} placeholder="00.000.000/0001-00" className="h-11 rounded-xl bg-white dark:bg-transparent border-emerald-100 dark:border-emerald-900/40" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-bold text-emerald-800 uppercase">ENDEREÇO DE COBRANÇA</Label>
                                                        <Input value={formData.financial.receiptData.address} onChange={(e) => setFormData(prev => ({ ...prev, financial: { ...prev.financial, receiptData: { ...prev.financial.receiptData, address: e.target.value } } }))} placeholder="Logradouro, Nº, Cidade..." className="h-11 rounded-xl bg-white dark:bg-transparent border-emerald-100 dark:border-emerald-900/40" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500">
                            <div className="h-24 w-24 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center relative">
                                <div className="h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white dark:bg-[#0c1e3d] rounded-full flex items-center justify-center shadow-md">
                                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-[#101828] dark:text-white uppercase tracking-tighter">Alterações Salvas!</h3>
                                <p className="text-[#667085] dark:text-gray-400 text-base max-w-sm mx-auto">O cadastro de <strong>{formData.nome}</strong> foi atualizado com sucesso.</p>
                            </div>

                            <div className="w-full max-w-lg pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-16 rounded-2xl border-[#0039A6] text-[#0039A6] hover:bg-[#0039A6]/5 gap-4 justify-start px-6 shadow-sm group" onClick={() => window.print()}>
                                    <div className="h-10 w-10 flex items-center justify-center bg-[#0039A6]/10 rounded-xl group-hover:scale-110 transition-transform"><Printer className="h-5 w-5" /></div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest">Reimprimir</p>
                                        <p className="text-[10px] text-gray-500 font-normal">Ficha cadastral física</p>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-16 rounded-2xl border-emerald-600 text-emerald-600 hover:bg-emerald-50 gap-4 justify-start px-6 shadow-sm group" onClick={() => {
                                    const msg = encodeURIComponent(`Olá ${formData.nome}! Seu cadastro na Integrallys foi atualizado com sucesso.`);
                                    window.open(`https://wa.me/${formData.telefone.replace(/\D/g, '')}?text=${msg}`, '_blank');
                                }}>
                                    <div className="h-10 w-10 flex items-center justify-center bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform"><Phone className="h-5 w-5" /></div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-widest">WhatsApp</p>
                                        <p className="text-[10px] text-gray-500 font-normal">Notificar digitalmente</p>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 md:p-8 pt-6 border-t border-app-border dark:border-white/5 bg-app-bg-secondary dark:bg-app-card-dark/50 flex justify-between items-center shrink-0">
                    {!isSaved ? (
                        <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                            <Button type="button" variant="outline" onClick={onClose} className="sm:w-32 h-12 rounded-xl font-bold text-[#667085] dark:text-gray-300 border-gray-300 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
                                Cancelar
                            </Button>
                            <Button form="editar-paciente-form" type="submit" className="flex-1 h-12 bg-[#0039A6] hover:bg-[#002d82] text-white font-black rounded-xl shadow-xl shadow-[#0039A6]/20 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.1em]">
                                Salvar Alterações
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={() => { setIsSaved(false); onClose(); }} className="w-full h-12 bg-[#101828] dark:bg-white text-white dark:text-[#101828] font-black rounded-xl transition-all uppercase tracking-[0.2em] shadow-lg">
                            FECHAR E CONCLUIR
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

