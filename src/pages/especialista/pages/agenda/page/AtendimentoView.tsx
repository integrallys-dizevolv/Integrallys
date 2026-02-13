import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Check, Mail, Phone, MapPin, CreditCard } from 'lucide-react'
import { PageHeader } from '../../../ui/PageHeader'
import { Dialog, DialogContent } from '@/components/ui/Dialog'
import { AtendimentoProvider, useAtendimento } from '../../../context/AtendimentoContext'
import { AnamneseSection } from '../components/AnamneseSection'
import { ProntuarioSection } from '../components/ProntuarioSection'
import { PrescricaoSection } from '../components/PrescricaoSection'
import { DocumentosSection } from '../components/DocumentosSection'
import { ConclusaoSection } from '../components/ConclusaoSection'

interface AtendimentoViewProps {
  onPageChange: (page: string) => void
  patientName?: string
  appointmentTime?: string
  appointmentType?: string
}

interface PatientDetails {
  nome: string
  dataNascimento: string
  cpf: string
  endereco: string
  telefone: string
  email: string
}

const PATIENT_DETAILS: PatientDetails[] = [
  {
    nome: 'Maria Silva',
    dataNascimento: '15/03/1985',
    cpf: '123.456.789-00',
    endereco: 'Rua das Acacias, 123 - Centro, Sao Paulo/SP',
    telefone: '(11) 99999-9999',
    email: 'maria.silva@email.com'
  },
  {
    nome: 'Joao Santos',
    dataNascimento: '02/08/1978',
    cpf: '987.654.321-00',
    endereco: 'Av. Paulista, 987 - Bela Vista, Sao Paulo/SP',
    telefone: '(11) 98888-8888',
    email: 'joao.santos@email.com'
  }
]

const normalizeName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

const patientDetailsMap = new Map(
  PATIENT_DETAILS.map((detail) => [normalizeName(detail.nome), detail])
)

const getAgeFromBirthDate = (dateStr?: string) => {
  if (!dateStr) return '--'
  const [day, month, year] = dateStr.split('/').map(Number)
  if (!day || !month || !year) return '--'
  const birthDate = new Date(year, month - 1, day)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

const steps = [
  { id: 1, label: 'Anamnese' },
  { id: 2, label: 'Prontuario' },
  { id: 3, label: 'Prescricao' },
  { id: 4, label: 'Documentos' },
  { id: 5, label: 'Conclusao' }
]

function AtendimentoContent({ onPageChange, patientName }: AtendimentoViewProps) {
  const { currentStep, setCurrentStep, finalizeAtendimento } = useAtendimento()
  const [showFinalizeModal, setShowFinalizeModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnOption, setReturnOption] = useState<string>('30')
  const [returnCustomDays, setReturnCustomDays] = useState('')
  const [returnError, setReturnError] = useState('')

  const safePatientName = patientName || 'Paciente'
  const patientDetails = patientDetailsMap.get(normalizeName(safePatientName))
  const displayDetails: PatientDetails = patientDetails || {
    nome: safePatientName,
    dataNascimento: '--',
    cpf: '--',
    endereco: '--',
    telefone: '--',
    email: '--'
  }
  const initials = displayDetails.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
    else setShowFinalizeModal(true)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
    else onPageChange('agenda')
  }

  const handleFinalize = () => {
    setShowFinalizeModal(false)
    setShowReturnModal(true)
  }

  const addDays = (base: Date, days: number) => {
    const next = new Date(base)
    next.setDate(next.getDate() + days)
    return next
  }

  const addMonths = (base: Date, months: number) => {
    const next = new Date(base)
    next.setMonth(next.getMonth() + months)
    return next
  }

  const saveReturnRequest = () => {
    const now = new Date()
    let dueDate: Date | null = null
    let customDays = 0

    if (returnOption === 'custom') {
      customDays = Number(returnCustomDays)
      if (!customDays || customDays <= 0) {
        setReturnError('Informe um prazo valido em dias.')
        return
      }
      dueDate = addDays(now, customDays)
    } else if (returnOption === 'liberado') {
      dueDate = null
    } else if (returnOption === '6m') {
      dueDate = addMonths(now, 6)
    } else {
      const days = Number(returnOption)
      dueDate = addDays(now, days)
    }

    try {
      const key = 'return_requests_v1'
      const stored = localStorage.getItem(key)
      const list = stored ? JSON.parse(stored) : []
      list.push({
        patientName: safePatientName,
        requestedAt: now.toISOString(),
        returnOption,
        customDays: returnOption === 'custom' ? customDays : null,
        dueDate: dueDate ? dueDate.toISOString() : null
      })
      localStorage.setItem(key, JSON.stringify(list))
    } catch {
      // ignore storage errors in mock
    }

    finalizeAtendimento()
    setShowReturnModal(false)
    onPageChange('agenda')
  }

  const breadcrumbs = [
    { label: 'Agenda', onClick: () => onPageChange('agenda') },
    { label: `Atendimento: ${safePatientName}`, isCurrent: true }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <PageHeader
        title="Atendimento clinico"
        subtitle={`Paciente: ${safePatientName}`}
        breadcrumbs={breadcrumbs}
        onPageChange={onPageChange}
        backAction={{
          label: 'Sair do atendimento',
          onClick: () => onPageChange('agenda')
        }}
      />

      <div className="bg-white dark:bg-app-card-dark p-6 rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#0039A6]/10 text-[#0039A6] dark:text-white dark:bg-[#0039A6]/30 flex items-center justify-center text-xl font-normal">
              {initials || 'P'}
            </div>
            <div>
              <p className="text-xs text-app-text-muted uppercase tracking-wider">Paciente</p>
              <p className="text-lg font-normal text-gray-900 dark:text-white">{displayDetails.nome}</p>
              <p className="text-[12px] text-app-text-muted">
                Nascimento: {displayDetails.dataNascimento} • Idade: {getAgeFromBirthDate(displayDetails.dataNascimento)} anos
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-app-text-muted" />
              <div>
                <p className="text-[10px] text-app-text-muted uppercase tracking-wider">CPF</p>
                <p className="text-sm text-gray-900 dark:text-white">{displayDetails.cpf}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-app-text-muted" />
              <div>
                <p className="text-[10px] text-app-text-muted uppercase tracking-wider">Telefone</p>
                <p className="text-sm text-gray-900 dark:text-white">{displayDetails.telefone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-app-text-muted" />
              <div>
                <p className="text-[10px] text-app-text-muted uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{displayDetails.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-app-text-muted" />
              <div>
                <p className="text-[10px] text-app-text-muted uppercase tracking-wider">Endereco</p>
                <p className="text-sm text-gray-900 dark:text-white">{displayDetails.endereco}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-app-card-dark p-6 rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between relative px-12">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full px-20 -z-0">
            <div className="h-0.5 bg-gray-200 dark:bg-gray-700 w-full relative">
              <div
                className="absolute left-0 top-0 h-full bg-[#0039A6] transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id
            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center gap-2 bg-white dark:bg-app-card-dark px-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-normal border-2 transition-all ${
                    isCompleted || isActive
                      ? 'bg-[#0039A6] border-[#0039A6] text-white'
                      : 'bg-app-bg-secondary text-app-text-muted'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5 stroke-[3]" /> : step.id}
                </div>
                <span
                  className={`text-xs font-normal ${isActive ? 'text-[#0039A6]' : 'text-app-text-muted'}`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <section className="bg-white dark:bg-app-card-dark p-8 rounded-[14px] shadow-sm border border-gray-100 dark:border-gray-800">
        {currentStep === 1 && (
          <AnamneseSection onCancel={() => onPageChange('agenda')} onNext={handleNext} />
        )}
        {currentStep === 2 && <ProntuarioSection onBack={handleBack} onNext={handleNext} />}
        {currentStep === 3 && <PrescricaoSection onBack={handleBack} onNext={handleNext} />}
        {currentStep === 4 && <DocumentosSection onBack={handleBack} onNext={handleNext} />}
        {currentStep === 5 && (
          <ConclusaoSection onBack={handleBack} onFinalize={() => setShowFinalizeModal(true)} />
        )}
      </section>

      <Dialog open={showFinalizeModal} onOpenChange={setShowFinalizeModal}>
        <DialogContent className="sm:max-w-md p-8">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-normal text-gray-900">Finalizar atendimento?</h2>
            <p className="text-app-text-muted font-normal">
              Esta acao ira congelar o prontuario conforme a RN-009 e disparar a orcamentacao automatica.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 font-normal"
                onClick={() => setShowFinalizeModal(false)}
              >
                Revisar
              </Button>
              <Button className="flex-1 bg-[#0039A6] font-normal" onClick={handleFinalize}>
                Sim, finalizar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent className="sm:max-w-lg p-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-normal text-gray-900">Definir prazo de retorno</h2>
              <p className="text-sm text-app-text-muted font-normal">
                Informe o prazo sugerido para retorno do paciente.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: '30', label: '30 dias' },
                { id: '60', label: '60 dias' },
                { id: '90', label: '90 dias' },
                { id: '120', label: '120 dias' },
                { id: '6m', label: '6 meses' },
                { id: 'liberado', label: 'Liberado' },
                { id: 'custom', label: 'Personalizado' }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setReturnOption(option.id)
                    setReturnError('')
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-normal border transition-all ${
                    returnOption === option.id
                      ? 'bg-[#0039A6] border-[#0039A6] text-white'
                      : 'border-app-border text-app-text-secondary hover:border-[#0039A6]/40 hover:text-[#0039A6]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {returnOption === 'custom' && (
              <div className="space-y-2">
                <Label className="text-xs font-normal text-app-text-muted uppercase tracking-wider">
                  Informe o prazo em dias
                </Label>
                <Input
                  value={returnCustomDays}
                  onChange={(e) => setReturnCustomDays(e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="Ex: 45"
                  className="h-11 rounded-[10px] bg-app-bg-secondary/50 dark:bg-app-table-header-dark border-app-border dark:border-gray-800"
                />
                {returnError && <p className="text-xs text-red-500">{returnError}</p>}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 font-normal" onClick={() => setShowReturnModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-[#0039A6] font-normal" onClick={saveReturnRequest}>
                Salvar retorno
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function AtendimentoView(props: AtendimentoViewProps) {
  return (
    <AtendimentoProvider patientName={props.patientName || 'Paciente'} appointmentTime={props.appointmentTime}>
      <AtendimentoContent {...props} />
    </AtendimentoProvider>
  )
}
