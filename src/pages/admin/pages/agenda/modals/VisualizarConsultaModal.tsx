import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { FileText, User, Stethoscope, Calendar, CreditCard } from 'lucide-react';

interface VisualizarConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  consulta?: {
    paciente: string;
    telefone: string;
    email: string;
    especialista: string;
    tipo: string;
    status: string;
    data: string;
    horario: string;
    duracao: string;
    valor: string;
    pagamentoStatus: string;
    cpf?: string;
    observacoes?: string;
  };
}

export function VisualizarConsultaModal({
  isOpen,
  onClose,
  consulta = {
    paciente: "Maria Silva",
    telefone: "(11) 9 9999-9999",
    email: "maria.silva@email.com",
    especialista: "Dr. João Santos",
    tipo: "Consulta",
    status: "Confirmação de Consulta",
    data: "19/11/2025",
    horario: "08:00",
    duracao: "30min",
    valor: "R$ 150,00",
    pagamentoStatus: "Pagamento efetuado"
  }
}: VisualizarConsultaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-app-card dark:bg-app-card-dark">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <FileText className="h-5 w-5 text-[#0039A6]" />
            Detalhes da consulta
          </DialogTitle>
          <DialogDescription className="font-normal">
            Informações completas sobre o agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-6">
          {/* Paciente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#0039A6]" />
              <h3 className="text-sm font-normal text-app-text-primary dark:text-white uppercase tracking-wider">Paciente</h3>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-sm font-normal text-app-text-primary dark:text-white">{consulta.paciente}</p>
              <p className="text-xs text-[#4a5565] dark:text-app-text-muted font-normal">{consulta.telefone}</p>
              {consulta.cpf && <p className="text-xs text-[#4a5565] dark:text-app-text-muted font-normal">CPF: {consulta.cpf}</p>}
              <p className="text-xs text-[#4a5565] dark:text-app-text-muted font-normal">{consulta.email}</p>
            </div>
          </div>

          <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark" />

          {/* Consulta */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-[#0039A6]" />
              <h3 className="text-sm font-normal text-app-text-primary dark:text-white uppercase tracking-wider">Consulta</h3>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Especialista:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{consulta.especialista}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Tipo:</p>
                <span className="bg-app-bg-secondary dark:bg-app-bg-dark border border-gray-100 dark:border-app-border-dark text-app-text-primary dark:text-white/80 px-2 py-0.5 rounded text-[10px] font-normal">
                  {consulta.tipo}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Status:</p>
                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-normal">
                  {consulta.status}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark" />

          {/* Agendamento */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#0039A6]" />
              <h3 className="text-sm font-normal text-app-text-primary dark:text-white uppercase tracking-wider">Agendamento</h3>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Data:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{consulta.data}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Horário:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{consulta.horario}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Duração:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{consulta.duracao}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark" />

          {/* Pagamento */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#0039A6]" />
              <h3 className="text-sm font-normal text-app-text-primary dark:text-white uppercase tracking-wider">Pagamento</h3>
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Valor:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{consulta.valor}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-[#4a5565] dark:text-app-text-muted font-normal">Status:</p>
                <p className="text-app-text-primary dark:text-white font-normal">{consulta.pagamentoStatus}</p>
              </div>
            </div>
          </div>

          {consulta.observacoes && (
            <>
              <div className="h-px bg-app-bg-secondary dark:bg-app-bg-dark" />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0039A6]" />
                  <h3 className="text-sm font-normal text-app-text-primary dark:text-white uppercase tracking-wider">Observações</h3>
                </div>
                <div className="pl-6">
                  <p className="text-xs text-[#4a5565] dark:text-app-text-muted leading-relaxed font-normal">
                    {consulta.observacoes}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            className="w-full h-11 bg-[#0039A6] hover:bg-[#1d3b2e] text-white font-normal rounded-[10px] shadow-sm transition-all active:scale-[0.98]"
          >
            Fechar detalhes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
