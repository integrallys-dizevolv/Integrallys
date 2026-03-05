import { useState, useEffect } from 'react'
import { PageHeader } from '../../../ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ChevronLeft, Calendar, User, Save, X, Camera, Upload, ChevronDown, Mail, Phone, Image as ImageIcon } from 'lucide-react'

interface NovoPacienteViewProps {
    onPageChange: (page: string) => void
}

export function NovoPacienteView({ onPageChange }: NovoPacienteViewProps) {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        dataNascimento: '',
        idade: '',
        sexo: '',
        telefone: '',
        email: '',
        indicacao: '',
        endereco: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: ''
    })

    // Calculate age automatically when birth date changes
    useEffect(() => {
        if (formData.dataNascimento) {
            const birth = new Date(formData.dataNascimento)
            const today = new Date()

            // Adjust for UTC/Local time difference to avoid day-shift errors
            const utcBirth = new Date(birth.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate())

            let age = today.getFullYear() - utcBirth.getFullYear()
            const m = today.getMonth() - utcBirth.getMonth()

            if (m < 0 || (m === 0 && today.getDate() < utcBirth.getDate())) {
                age--
            }

            setFormData(prev => ({
                ...prev,
                idade: age >= 0 ? `${age} anos` : 'Data inválida'
            }))
        } else {
            setFormData(prev => ({ ...prev, idade: '' }))
        }
    }, [formData.dataNascimento])

    const handleBack = () => {
        onPageChange('pacientes')
    }

    const breadcrumbs = [
        { label: 'Pacientes', onClick: () => onPageChange('pacientes') },
        { label: 'Novo cadastro', isCurrent: true }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <PageHeader
                title="Ficha de cadastro completo (Crm)"
                subtitle="Complete todos os campos obrigatórios para finalizar o cadastro"
                breadcrumbs={breadcrumbs}
                onPageChange={onPageChange}
                backAction={{
                    label: "Voltar",
                    onClick: handleBack
                }}
            />

            {/* Form Card */}
            <div className="bg-white dark:bg-app-card-dark rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden">
                <div className="p-8 md:p-12">
                    <div className="space-y-16">
                        {/* Section 1: Dados Pessoais */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-normal text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="text-[#0039A6] dark:text-[#4da885]">1.</span>
                                    Dados pessoais
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Nome Completo */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Nome completo <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Nome completo do paciente"
                                        className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    />
                                </div>

                                {/* CPF */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Cpf <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="000.000.000-00"
                                        className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    />
                                </div>

                                {/* Data de Nascimento */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Data de nascimento <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input type="date" hideDateIcon
                                            className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all appearance-none"
                                            value={formData.dataNascimento}
                                            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                                        />
                                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted pointer-events-none" />
                                    </div>
                                </div>

                                {/* Idade */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Idade
                                    </Label>
                                    <Input
                                        placeholder="Calculado automaticamente"
                                        disabled
                                        className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-app-bg-secondary dark:bg-app-table-header-dark px-4 text-app-text-muted dark:text-app-text-muted cursor-not-allowed transition-all"
                                        value={formData.idade}
                                    />
                                </div>

                                {/* Sexo */}
                                <div className="space-y-4 md:col-span-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Sexo <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-8">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="sexo"
                                                    value="feminino"
                                                    className="peer appearance-none w-5 h-5 rounded-full border-2 border-app-border dark:border-app-border-dark checked:border-[#0039A6] transition-all cursor-pointer"
                                                    onChange={() => setFormData({ ...formData, sexo: 'feminino' })}
                                                />
                                                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0039A6] scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                                            </div>
                                            <span className="text-gray-600 dark:text-white/80 font-normal group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Feminino</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="sexo"
                                                    value="masculino"
                                                    className="peer appearance-none w-5 h-5 rounded-full border-2 border-app-border dark:border-app-border-dark checked:border-[#0039A6] transition-all cursor-pointer"
                                                    onChange={() => setFormData({ ...formData, sexo: 'masculino' })}
                                                />
                                                <div className="absolute w-2.5 h-2.5 rounded-full bg-[#0039A6] scale-0 peer-checked:scale-100 transition-all duration-200"></div>
                                            </div>
                                            <span className="text-gray-600 dark:text-white/80 font-normal group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Masculino</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Informações de Contato e Identificação */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-normal text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="text-[#0039A6] dark:text-[#4da885]">2.</span>
                                    Informações de contato e identificação
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {/* Telefone */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Telefone <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="(00) 0 0000-0000"
                                            className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                            value={formData.telefone}
                                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        />
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                    </div>
                                </div>

                                {/* E-mail */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        E-mail <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="email"
                                            placeholder="email@exemplo.com"
                                            className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                    </div>
                                </div>

                                {/* Foto de Perfil */}
                                <div className="md:col-span-2 space-y-4">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Foto de perfil
                                    </Label>
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        {/* Profile Photo Placeholder */}
                                        <div className="w-48 h-48 rounded-[16px] border-2 border-dashed border-app-border dark:border-app-border-dark bg-app-bg-secondary/50 dark:bg-app-table-header-dark flex flex-col items-center justify-center text-center p-4">
                                            <div className="w-12 h-12 rounded-full bg-white dark:bg-app-bg-dark shadow-sm flex items-center justify-center mb-3">
                                                <Camera className="h-6 w-6 text-app-text-muted" />
                                            </div>
                                            <span className="text-sm text-app-text-muted dark:text-app-text-muted font-normal leading-tight">Nenhuma foto capturada</span>
                                        </div>

                                        {/* Photo Buttons */}
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                variant="outline"
                                                className="h-11 px-6 rounded-[10px] border-app-border dark:border-app-border-dark flex items-center gap-2 font-normal text-gray-700 dark:text-white/80 transition-all hover:bg-app-bg-secondary"
                                            >
                                                <Camera className="h-4 w-4" />
                                                Capturar foto
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-11 px-6 rounded-[10px] border-app-border dark:border-app-border-dark flex items-center gap-2 font-normal text-gray-700 dark:text-white/80 transition-all hover:bg-app-bg-secondary"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Upload
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Indicação */}
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Indicação (origem) <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-app-bg-secondary/30 dark:bg-transparent px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0039A6]/50 text-gray-600 dark:text-app-text-muted cursor-pointer transition-all"
                                            value={formData.indicacao}
                                            onChange={(e) => setFormData({ ...formData, indicacao: e.target.value })}
                                        >
                                            <option value="">Selecione a origem</option>
                                            <option value="google">Google search</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="indicacao">Indicação de amigo</option>
                                            <option value="outdoor">Outdoor / placa</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Endereço */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-normal text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="text-[#0039A6] dark:text-[#4da885]">3.</span>
                                    Endereço
                                </h2>
                            </div>

                            <div className="space-y-8">
                                {/* Endereço (Rua e Número) */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Endereço (rua e número) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Rua Exemplo, 123"
                                        className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                        value={formData.endereco}
                                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                                    />
                                </div>

                                {/* Complemento */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                        Complemento
                                    </Label>
                                    <Input
                                        placeholder="Apto, Bloco, etc."
                                        className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                        value={formData.complemento}
                                        onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    {/* Bairro */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                            Bairro <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            placeholder="Centro"
                                            className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                            value={formData.bairro}
                                            onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                                        />
                                    </div>

                                    {/* Cidade */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                            Cidade <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            placeholder="São Paulo"
                                            className="h-12 rounded-[12px] border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 focus-visible:ring-[#0039A6] transition-all"
                                            value={formData.cidade}
                                            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                                        />
                                    </div>

                                    {/* UF */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-normal text-gray-700 dark:text-white/80">
                                            Uf <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-12 rounded-[12px] border border-app-border dark:border-app-border-dark bg-white/50 dark:bg-transparent px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0039A6]/50 text-gray-600 dark:text-app-text-muted cursor-pointer transition-all"
                                                value={formData.uf}
                                                onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                                            >
                                                <option value="">UF</option>
                                                <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                                                <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                                                <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                                                <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                                                <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                                                <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                                                <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                                                <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                                                <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-app-text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-red-500 text-sm font-normal">
                            * Campos obrigatórios
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                className="h-12 px-10 rounded-[12px] border-app-border text-gray-700 dark:text-white/80 dark:border-app-border-dark font-normal text-base hover:bg-app-bg-secondary dark:hover:bg-white/5 transition-all w-full sm:w-auto flex items-center justify-center"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="h-12 px-10 rounded-[12px] bg-[#1a342b] hover:bg-[#152a22] text-white font-normal text-base shadow-lg shadow-[#1a342b]/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto"
                            >

                                Salvar cadastro completo
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

