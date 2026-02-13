import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { Badge } from "@/components/ui/Badge";
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  X,
  FileText,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  horario?: string;
  prioridade: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Concluída";
  categoria?: string;
}

interface TarefasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_TAREFAS: Tarefa[] = [
  {
    id: "1",
    titulo: "Confirmar agendamentos de amanhã",
    descricao: "Ligar para pacientes agendados para confirmar presença",
    data: "2025-11-21",
    horario: "09:00",
    prioridade: "Alta",
    status: "Pendente",
    categoria: "Agenda",
  },
  {
    id: "2",
    titulo: "Organizar prontuários pendentes",
    descricao: "Separar documentos que precisam de assinatura",
    data: "2025-11-21",
    prioridade: "Média",
    status: "Pendente",
    categoria: "Documentação",
  },
  {
    id: "3",
    titulo: "Atualizar cadastro de pacientes",
    descricao: "Revisar e atualizar informações de contato",
    data: "2025-11-20",
    prioridade: "Baixa",
    status: "Concluída",
    categoria: "Cadastro",
  },
];

export function TarefasModal({ isOpen, onClose }: TarefasModalProps) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(MOCK_TAREFAS);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<
    "Todas" | "Pendentes" | "Concluídas"
  >("Todas");

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    data: "",
    horario: "",
    prioridade: "Média" as "Alta" | "Média" | "Baixa",
    categoria: "",
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      data: "",
      horario: "",
      prioridade: "Média",
      categoria: "",
    });
    setTarefaEditando(null);
  };

  const handleClose = () => {
    resetForm();
    setMostrarFormulario(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tarefaEditando) {
      // Editar tarefa existente
      setTarefas(
        tarefas.map((t) =>
          t.id === tarefaEditando.id ? { ...t, ...formData } : t,
        ),
      );
    } else {
      // Criar nova tarefa
      const novaTarefa: Tarefa = {
        id: Date.now().toString(),
        ...formData,
        status: "Pendente",
      };
      setTarefas([novaTarefa, ...tarefas]);
    }

    resetForm();
    setMostrarFormulario(false);
  };

  const handleToggleStatus = (id: string) => {
    setTarefas(
      tarefas.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Pendente" ? "Concluída" : "Pendente" }
          : t,
      ),
    );
  };

  const handleEdit = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa);
    setFormData({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "",
      data: tarefa.data,
      horario: tarefa.horario || "",
      prioridade: tarefa.prioridade,
      categoria: tarefa.categoria || "",
    });
    setMostrarFormulario(true);
  };

  const handleDelete = (id: string) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
  };

  const getPrioridadeBadge = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-[10px]">
            Alta
          </Badge>
        );
      case "Média":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[10px]">
            Média
          </Badge>
        );
      case "Baixa":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-[10px]">
            Baixa
          </Badge>
        );
      default:
        return null;
    }
  };

  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtroStatus === "Pendentes") return t.status === "Pendente";
    if (filtroStatus === "Concluídas") return t.status === "Concluída";
    return true;
  });

  const tarefasPendentes = tarefas.filter(
    (t) => t.status === "Pendente",
  ).length;
  const tarefasConcluidas = tarefas.filter(
    (t) => t.status === "Concluída",
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] bg-app-card dark:bg-app-card-dark rounded-[14px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0 p-6 pb-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#0039A6]/10 flex items-center justify-center border border-[#0039A6]/20">
                <CheckCircle2 className="h-6 w-6 text-[#0039A6]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-normal text-app-text-primary dark:text-white">
                  Lista de Tarefas
                </DialogTitle>
                <DialogDescription className="text-xs text-app-text-muted mt-0.5">
                  Gerencie suas responsabilidades individuais.
                </DialogDescription>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 p-6 pb-4 shrink-0">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[10px] p-3 text-center">
              <p className="text-2xl font-normal text-[#0039A6] dark:text-blue-400">
                {tarefas.length}
              </p>
              <p className="text-xs text-app-text-muted dark:text-white/60">
                Total
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-[10px] p-3 text-center">
              <p className="text-2xl font-normal text-amber-600 dark:text-amber-400">
                {tarefasPendentes}
              </p>
              <p className="text-xs text-app-text-muted dark:text-white/60">
                Pendentes
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-[10px] p-3 text-center">
              <p className="text-2xl font-normal text-green-600 dark:text-green-400">
                {tarefasConcluidas}
              </p>
              <p className="text-xs text-app-text-muted dark:text-white/60">
                Concluídas
              </p>
            </div>
          </div>

          {/* Filtros e Ações */}
          <div className="px-6 pb-4 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 bg-app-bg-secondary dark:bg-app-bg-dark/50 p-1 rounded-[10px]">
              {(["Todas", "Pendentes", "Concluídas"] as const).map((filtro) => (
                <button
                  key={filtro}
                  onClick={() => setFiltroStatus(filtro)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[8px] transition-all ${
                    filtroStatus === filtro
                      ? "bg-white dark:bg-app-card-dark text-[#0039A6] dark:text-white shadow-sm"
                      : "text-app-text-muted hover:text-[#0039A6]"
                  }`}
                >
                  {filtro}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-app-text-muted">
              <BarChart3 size={12} />
              <span>Hierarquia: Administrador</span>
            </div>
          </div>

          {/* Formulário de Nova/Editar Tarefa */}
          {mostrarFormulario && (
            <div className="px-6 pb-4 shrink-0">
              <form
                onSubmit={handleSubmit}
                className="bg-app-bg-secondary dark:bg-app-bg-dark/30 rounded-[10px] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-app-text-primary dark:text-white">
                    {tarefaEditando ? "Editar tarefa" : "Nova tarefa"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setMostrarFormulario(false);
                    }}
                    className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={16} className="text-app-text-muted" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[12px] font-normal">Título *</Label>
                  <Input
                    placeholder="Título da tarefa"
                    value={formData.titulo}
                    onChange={(e) =>
                      setFormData({ ...formData, titulo: e.target.value })
                    }
                    className="h-9 text-xs rounded-[8px]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[12px] font-normal">Descrição</Label>
                  <Textarea
                    placeholder="Descrição opcional..."
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    className="min-h-[60px] text-xs rounded-[8px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[12px] font-normal flex items-center gap-1">
                      Data
                    </Label>
                    <Input
                      type="date"
                      value={formData.data}
                      onChange={(e) =>
                        setFormData({ ...formData, data: e.target.value })
                      }
                      className="h-9 text-xs rounded-[8px]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] font-normal flex items-center gap-1">
                      <Clock size={12} /> Horário
                    </Label>
                    <Input
                      type="time"
                      value={formData.horario}
                      onChange={(e) =>
                        setFormData({ ...formData, horario: e.target.value })
                      }
                      className="h-9 text-xs rounded-[8px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] font-normal">
                      Prioridade
                    </Label>
                    <Select
                      value={formData.prioridade}
                      onValueChange={(v) =>
                        setFormData({
                          ...formData,
                          prioridade: v as "Alta" | "Média" | "Baixa",
                        })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs rounded-[8px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setMostrarFormulario(false);
                    }}
                    className="h-8 px-4 text-xs rounded-[8px]"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="h-8 px-4 text-xs rounded-[8px] bg-[#0039A6] hover:bg-[#002d82] text-white"
                  >
                    {tarefaEditando ? "Salvar" : "Adicionar"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Tarefas */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {tarefasFiltradas.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-app-text-muted/50 mx-auto mb-3" />
                <p className="text-sm text-app-text-muted dark:text-white/60">
                  Nenhuma tarefa{" "}
                  {filtroStatus === "Todas" ? "" : filtroStatus.toLowerCase()}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {tarefasFiltradas.map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className={`group flex items-start gap-3 p-3 rounded-[10px] border transition-all ${
                      tarefa.status === "Concluída"
                        ? "bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 opacity-70"
                        : "bg-white dark:bg-app-card-dark border-app-border dark:border-app-border-dark hover:border-[#0039A6]/30"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleStatus(tarefa.id)}
                      className="mt-0.5 shrink-0"
                    >
                      {tarefa.status === "Concluída" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-app-text-muted hover:text-[#0039A6] transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-normal ${
                              tarefa.status === "Concluída"
                                ? "text-app-text-muted line-through"
                                : "text-app-text-primary dark:text-white"
                            }`}
                          >
                            {tarefa.titulo}
                          </p>
                          {tarefa.descricao && (
                            <p className="text-xs text-app-text-muted dark:text-white/60 mt-1 line-clamp-2">
                              {tarefa.descricao}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {getPrioridadeBadge(tarefa.prioridade)}
                            {tarefa.data && (
                              <span className="text-[10px] text-app-text-muted flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(tarefa.data).toLocaleDateString(
                                  "pt-BR",
                                )}
                                {tarefa.horario && ` ${tarefa.horario}`}
                              </span>
                            )}
                            {tarefa.categoria && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-app-bg-secondary dark:bg-app-bg-dark rounded text-app-text-muted">
                                {tarefa.categoria}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(tarefa)}
                            className="p-1.5 hover:bg-app-bg-secondary dark:hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} className="text-app-text-muted" />
                          </button>
                          <button
                            onClick={() => handleDelete(tarefa.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="shrink-0 px-6 pb-6 pt-2 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() =>
                toast.info("Gerando relatÃ³rio consolidado para gestores...")
              }
              className="h-10 px-4 rounded-xl gap-2 font-normal border-app-border dark:border-gray-700 hover:text-[#0039A6] transition-all"
            >
              <FileText size={16} />
              <span>Relatórios</span>
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setMostrarFormulario(true);
              }}
              className="bg-[#0039A6] hover:bg-[#002d82] text-white h-10 px-4 rounded-xl gap-2 shadow-sm"
            >
              <Plus size={18} />
              <span>Nova Tarefa</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
