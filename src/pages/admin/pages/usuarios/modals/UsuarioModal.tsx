import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { ShieldCheck, Upload, FileCheck, DollarSign, Wallet, Users } from 'lucide-react'
import { Switch } from '@/components/ui/Switch'
import { toast } from 'sonner'
import type { User } from '../../../components/types'

interface UsuarioModalProps {
    isOpen: boolean
    onClose: (open: boolean) => void
    user?: User | null
    mode: 'add' | 'edit'
}

export function UsuarioModal({ isOpen, onClose, user, mode }: UsuarioModalProps) {
    const isEdit = mode === 'edit'
    const [selectedProfile, setSelectedProfile] = useState(user?.perfil?.toLowerCase() || '')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [tipoVinculo, setTipoVinculo] = useState<'colaborador' | 'parceiro'>(user?.tipoVinculo?.toLowerCase() as any || 'colaborador')
    const [isVendedor, setIsVendedor] = useState(user?.isVendedor || false)
    const [selectedUF, setSelectedUF] = useState('')
    const [selectedUnidade, setSelectedUnidade] = useState(user?.unidade?.toLowerCase() || '')
    const [recepProfissionais, setRecepProfissionais] = useState<string[]>((user as any)?.profissionaisPermitidos || [])

    // Mapeamento de UFs para exibiÃ§Ã£o formatada
    const ufLabels: Record<string, string> = {
        'sp': 'SP - SÃ£o Paulo',
        'rj': 'RJ - Rio de Janeiro',
        'mg': 'MG - Minas Gerais',
        'rs': 'RS - Rio Grande do Sul'
    }

    // Mapeamento de Unidades para exibiÃ§Ã£o formatada
    const unidadeLabels: Record<string, string> = {
        'central': 'ClÃ­nica Central',
        'norte': 'Unidade Norte',
        'sul': 'Unidade Sul'
    }
    const professionalOptions = [
        'Dr. João Santos',
        'Dra. Ana Lima',
        'Dra. Flávia Alves',
        'Dr. Pedro Oliveira',
        'Dra. Ana Costa',
        'Dr. Rafael Lima',
        'Dr. Adelmo',
        'Dr. Diego'
    ]

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSave = () => {
        if (selectedProfile === 'recepcionista') {
            try {
                if (recepProfissionais.length === 0) {
                    localStorage.removeItem('recepcao_profissionais_permitidos')
                } else {
                    localStorage.setItem(
                        'recepcao_profissionais_permitidos',
                        JSON.stringify(recepProfissionais)
                    )
                }
            } catch {
                // ignore storage issues in mock
            }
        }
        toast.success(isEdit ? 'UsuÃ¡rio atualizado com sucesso!' : 'UsuÃ¡rio cadastrado com sucesso!')
        onClose(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[500px] w-full gap-0 overflow-hidden rounded-[24px]">
                <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                    <DialogTitle className="text-xl font-normal">{isEdit ? 'Editar usuÃ¡rio' : 'Novo usuÃ¡rio'}</DialogTitle>
                    <DialogDescription className="text-app-text-muted mt-1.5">
                        {isEdit
                            ? 'Atualize as informaÃ§Ãµes do usuÃ¡rio no sistema.'
                            : 'Preencha os dados abaixo para cadastrar um novo usuÃ¡rio no sistema.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Nome completo</Label>
                        <Input
                            placeholder="Digite o nome completo"
                            defaultValue={user?.nome || ''}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">E-mail</Label>
                        <Input
                            type="email"
                            placeholder="email@exemplo.com"
                            defaultValue={user?.email || ''}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Perfil</Label>
                        <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione o perfil">
                                    {selectedProfile ? selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1) : 'Selecione o perfil'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="especialista">Especialista</SelectItem>
                                <SelectItem value="unidade">Unidade</SelectItem>
                                <SelectItem value="administrador">Administrador</SelectItem>
                                <SelectItem value="recepcionista">Recepcionista</SelectItem>
                                <SelectItem value="paciente">Paciente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Unidade vinculada</Label>
                        <Select value={selectedUnidade} onValueChange={setSelectedUnidade}>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione a unidade">
                                    {selectedUnidade ? unidadeLabels[selectedUnidade] || selectedUnidade : 'Selecione a unidade'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="central">ClÃ­nica Central</SelectItem>
                                <SelectItem value="norte">Unidade Norte</SelectItem>
                                <SelectItem value="sul">Unidade Sul</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">Conselho de classe (se aplicÃ¡vel)</Label>
                        <Input
                            placeholder="Ex: CRM, CRO, CREFITO, CRTH, CRP"
                            defaultValue={user?.crth?.split(' ')[0] || ''}
                        />
                        <p className="text-[11px] text-app-text-muted mt-1">
                            ObrigatÃ³rio para profissionais da saÃºde (CRM, CRO, CREFITO, CRTH, CRP, etc)
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm font-normal text-app-text-primary dark:text-white">UF do conselho (se aplicÃ¡vel)</Label>
                        <Select value={selectedUF} onValueChange={setSelectedUF}>
                            <SelectTrigger>
                                <SelectValue preferPlaceholder placeholder="Selecione o estado">
                                    {selectedUF ? ufLabels[selectedUF] || selectedUF.toUpperCase() : 'Selecione o estado'}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sp">SP - SÃ£o Paulo</SelectItem>
                                <SelectItem value="rj">RJ - Rio de Janeiro</SelectItem>
                                <SelectItem value="mg">MG - Minas Gerais</SelectItem>
                                <SelectItem value="rs">RS - Rio Grande do Sul</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                {selectedProfile === 'recepcionista' && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#0039A6]/10 p-2 rounded-lg">
                                <Users className="h-5 w-5 text-[#0039A6]" />
                            </div>
                            <div>
                                <h4 className="text-sm font-normal text-app-text-primary dark:text-white">Profissionais permitidos</h4>
                                <p className="text-xs text-app-text-muted">Selecione quais especialistas essa recepcionista pode atender.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {professionalOptions.map((prof) => {
                                const active = recepProfissionais.includes(prof)
                                return (
                                    <button
                                        key={prof}
                                        type="button"
                                        onClick={() => {
                                            setRecepProfissionais((prev) =>
                                                prev.includes(prof)
                                                    ? prev.filter((p) => p !== prof)
                                                    : [...prev, prof]
                                            )
                                        }}
                                        className={`px-3 py-2 rounded-lg text-xs font-normal border transition-all ${
                                            active
                                                ? 'border-[#0039A6] text-[#0039A6] bg-[#0039A6]/10'
                                                : 'border-app-border text-app-text-secondary hover:border-[#0039A6]/40 hover:text-[#0039A6]'
                                        }`}
                                    >
                                        {prof}
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-[11px] text-app-text-muted">
                            Se nenhum profissional for selecionado, a recepcionista visualizará todos.
                        </p>
                    </div>
                )}
                {selectedProfile === 'especialista' && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm font-normal text-app-text-primary dark:text-white">Tipo de vÃ­nculo</Label>
                            <Select value={tipoVinculo} onValueChange={(val: any) => setTipoVinculo(val)}>
                                <SelectTrigger className="h-11 rounded-lg border-app-border bg-[#F9FAFB] dark:bg-app-bg-dark dark:border-app-border-dark text-app-text-muted text-sm">
                                    <SelectValue preferPlaceholder placeholder="Selecione o vÃ­nculo">
                                        {tipoVinculo === 'colaborador' ? 'Colaborador (Repasse PadrÃ£o)' :
                                            tipoVinculo === 'parceiro' ? 'Parceiro (Recibo/PIX Direto)' : 'Selecione o vÃ­nculo'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="colaborador">Colaborador (Repasse PadrÃ£o)</SelectItem>
                                    <SelectItem value="parceiro">Parceiro (Recibo/PIX Direto)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[11px] text-app-text-muted mt-1">
                                {tipoVinculo === 'colaborador'
                                    ? 'Especialista vinculado Ã  clÃ­nica com repasse via caixa.'
                                    : 'Especialista parceiro com recebimento direto e repasse de taxa para a clÃ­nica.'}
                            </p>
                        </div>
                    </div>
                )}

                {selectedProfile === 'especialista' && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-app-bg-secondary dark:bg-app-card/5 rounded-xl border border-gray-100 dark:border-app-border-dark">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0039A6]/10 p-2 rounded-lg">
                                    <DollarSign className="h-5 w-5 text-[#0039A6]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-normal text-app-text-primary dark:text-white">Habilitar PrescriÃ§Ã£o/Vendas</h4>
                                    <p className="text-xs text-app-text-muted">Permitir que este usuÃ¡rio receba comissÃµes</p>
                                </div>
                            </div>
                            <Switch checked={isVendedor} onCheckedChange={setIsVendedor} />
                        </div>

                        {isVendedor && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                                <Label className="text-sm font-normal text-app-text-primary dark:text-white">Percentual de comissÃ£o (%)</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder="Ex: 10"
                                        defaultValue={user?.comissao || ''}
                                        className="h-11 pl-10 rounded-lg border-app-border bg-app-card dark:bg-app-bg-dark dark:border-app-border-dark text-sm"
                                    />
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-text-muted">
                                        <span className="text-sm font-medium">%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {selectedProfile === 'especialista' && (
                    <div className="px-6 py-4 space-y-4">
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-[#0039A6]/5 dark:bg-[#0039A6]/10 border border-[#0039A6]/10 dark:border-[#0039A6]/20 rounded-[12px] p-4 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-[#0039A6]/10 dark:bg-[#0039A6]/30 p-2 rounded-full shrink-0">
                                        <ShieldCheck className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-normal text-[#0039A6] dark:text-[#white]">ValidaÃ§Ã£o jurÃ­dica ICP-Brasil</h4>
                                        <p className="text-xs text-[#0039A6]/80 dark:text-[#4da885]/80 leading-relaxed">
                                            Para especialistas, Ã© obrigatÃ³rio o envio do certificado digital para assinatura de documentos com validade jurÃ­dica.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-normal text-app-text-primary dark:text-white">Upload do certificado (.pfx, .cer ou .pdf)</Label>
                                    <div
                                        className={`border-2 border-dashed transition-colors rounded-[12px] p-6 text-center cursor-pointer bg-app-card dark:bg-app-bg-dark relative ${selectedFile ? 'border-[#0039A6] dark:border-[#4da885]' : 'border-app-border dark:border-app-border-dark hover:border-[#0039A6]/50 dark:hover:border-[#0039A6]'}`}
                                    >
                                        <input
                                            type="file"
                                            accept=".pfx,.cer,.pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedFile ? 'bg-[#0039A6]/10 dark:bg-[#0039A6]/30' : 'bg-app-bg-secondary dark:bg-app-bg-dark'}`}>
                                                {selectedFile ? (
                                                    <FileCheck className="h-5 w-5 text-[#0039A6] dark:text-[#4da885]" />
                                                ) : (
                                                    <Upload className="h-5 w-5 text-app-text-muted dark:text-white/80" />
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                {selectedFile ? (
                                                    <span className="font-semibold text-[#0039A6] dark:text-[#4da885] break-all">{selectedFile.name}</span>
                                                ) : (
                                                    <>
                                                        <span className="font-semibold text-[#0039A6] dark:text-[#4da885]">Clique para enviar</span>
                                                        <span className="text-app-text-muted dark:text-app-text-muted"> ou arraste o arquivo aqui</span>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-xs text-app-text-muted">Suporta certificados e-CPF A1, A3 ou PDF assinado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="px-6 py-6 pt-2 shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => onClose(false)}
                        className="h-11 px-6 rounded-lg border-app-border text-gray-700 hover:bg-app-bg-secondary dark:border-app-border-dark dark:text-white/80 dark:hover:bg-app-card/5"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="h-11 px-8 rounded-lg bg-[#0039A6] hover:bg-[#002d82] text-white shadow-sm font-normal"
                        onClick={handleSave}
                    >
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


