import { useEffect, useMemo, useState } from 'react'
import { Check, Shield, Save } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import type { PermissionModule } from '../../../components/types'
import { toast } from 'sonner'
import { useUsuariosAdmin } from '@/hooks/useUsuariosAdmin'

import { MOCK_PROFILES, MOCK_PERMISSION_MODULES } from '@/mocks/admin/profiles';


export function GerenciarPerfisView() {
  const { usuarios } = useUsuariosAdmin()
  const [selectedProfile, setSelectedProfile] = useState('')
  const [modules, setModules] = useState<PermissionModule[]>(MOCK_PERMISSION_MODULES)
  const recepcionistas = useMemo(
    () => usuarios.filter((user) => user.perfil === 'Recepcionista' && user.status === 'Ativo'),
    [usuarios],
  )
  const especialistas = useMemo(
    () => usuarios.filter((user) => user.perfil === 'Especialista' && user.status === 'Ativo'),
    [usuarios],
  )

  const [selectedRecepcionistaId, setSelectedRecepcionistaId] = useState<string>('')
  const [recepcaoConfig, setRecepcaoConfig] = useState<
    Record<string, { especialistaIds: number[]; podeAcessarAgendaPessoal: boolean }>
  >({})

  useEffect(() => {
    if (!selectedRecepcionistaId && recepcionistas.length > 0) {
      setSelectedRecepcionistaId(String(recepcionistas[0].id))
    }

    setRecepcaoConfig((prev) => {
      const next = { ...prev }
      const especialistaIds = especialistas.map((especialista) => especialista.id)

      recepcionistas.forEach((recepcionista) => {
        const key = String(recepcionista.id)
        if (!next[key]) {
          next[key] = {
            especialistaIds,
            podeAcessarAgendaPessoal: true,
          }
        }
      })

      return next
    })
  }, [especialistas, recepcionistas, selectedRecepcionistaId])

  const handleTogglePermission = (moduleId: string, permissionId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          permissoes: module.permissoes.map(perm => {
            if (perm.id === permissionId) {
              return { ...perm, enabled: !perm.enabled }
            }
            return perm
          }),
        }
      }
      return module
    }))
  }

  const getEnabledCount = (module: PermissionModule) => {
    return module.permissoes.filter(p => p.enabled).length
  }

  const recepcionistaConfig = recepcaoConfig[selectedRecepcionistaId] || {
    especialistaIds: [],
    podeAcessarAgendaPessoal: false,
  }

  const toggleEspecialista = (especialistaId: number) => {
    setRecepcaoConfig((prev) => {
      const current = prev[selectedRecepcionistaId] || { especialistaIds: [], podeAcessarAgendaPessoal: false }
      const especialistaIds = current.especialistaIds.includes(especialistaId)
        ? current.especialistaIds.filter((id) => id !== especialistaId)
        : [...current.especialistaIds, especialistaId]

      return {
        ...prev,
        [selectedRecepcionistaId]: {
          ...current,
          especialistaIds,
        },
      }
    })
  }

  const setAgendaPessoalAcesso = (checked: boolean) => {
    setRecepcaoConfig((prev) => {
      const current = prev[selectedRecepcionistaId] || { especialistaIds: [], podeAcessarAgendaPessoal: false }
      return {
        ...prev,
        [selectedRecepcionistaId]: {
          ...current,
          podeAcessarAgendaPessoal: checked,
        },
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-normal text-app-text-primary dark:text-white">
          Selecione o perfil para configurar
        </label>
        <Select value={selectedProfile} onValueChange={setSelectedProfile}>
          <SelectTrigger className="h-10 w-full md:max-w-sm bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-lg">
            <SelectValue preferPlaceholder placeholder="Selecione o perfil" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-app-border dark:border-app-border-dark">
            {MOCK_PROFILES.map(profile => (
              <SelectItem key={profile} value={profile}>
                {profile}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion className="space-y-0">
        {modules.map((module, index) => {
          const enabledCount = getEnabledCount(module)
          const totalCount = module.permissoes.length
          const isLast = index === modules.length - 1

          return (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className={`hover:no-underline p-0 py-4 bg-transparent border-0 border-b ${isLast ? 'border-b-0' : 'border-slate-100'} rounded-none hover:bg-transparent`}>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-app-text-primary dark:text-white" strokeWidth={1.5} />
                  <span className="font-normal text-app-text-primary dark:text-white">
                    Módulo {module.nome}
                  </span>
                  <span className="text-sm text-slate-400 dark:text-white/40">
                    ({enabledCount}/{totalCount} habilitadas)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0 bg-transparent border-0 rounded-none mt-0 transition-all duration-300">
                <div className="flex flex-col gap-4 pt-2 pb-6 pl-11">
                  {module.permissoes.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center gap-4 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={permission.enabled}
                        onChange={() => handleTogglePermission(module.id, permission.id)}
                        className="hidden"
                      />
                      {permission.enabled ? (
                        <div className="w-5 h-5 rounded-md bg-[#0039A6] flex items-center justify-center shrink-0 transition-all duration-200">
                          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-[1.5px] border-[#d1dceb] bg-transparent shrink-0 transition-all duration-200" />
                      )}
                      <span className="text-sm text-app-text-primary dark:text-white">
                        {permission.label}
                      </span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      {selectedProfile && (
        <div className="space-y-4 pt-6">
          {selectedProfile.toLowerCase() === 'recepcionista' && (
            <div className="space-y-4 rounded-xl border border-app-border dark:border-app-border-dark p-4 bg-app-card dark:bg-app-card/5">
              <p className="text-sm font-normal text-app-text-primary dark:text-white">
                Configuração de especialistas por recepcionista
              </p>

              <div className="space-y-1.5">
                <label className="text-xs text-app-text-muted">Recepcionista</label>
                <Select value={selectedRecepcionistaId} onValueChange={setSelectedRecepcionistaId}>
                  <SelectTrigger className="h-10 w-full md:max-w-sm bg-app-card dark:bg-app-bg-dark border-app-border dark:border-app-border-dark rounded-lg">
                    <SelectValue preferPlaceholder placeholder="Selecione a recepcionista" />
                  </SelectTrigger>
                  <SelectContent>
                    {recepcionistas.map((recepcionista) => (
                      <SelectItem key={recepcionista.id} value={String(recepcionista.id)}>
                        {recepcionista.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-app-text-muted">Especialistas gerenciados</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {especialistas.map((especialista) => {
                    const checked = recepcionistaConfig.especialistaIds.includes(especialista.id)
                    return (
                      <label
                        key={especialista.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-app-border dark:border-app-border-dark hover:bg-app-bg-secondary dark:hover:bg-app-card/10 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEspecialista(especialista.id)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-app-text-primary dark:text-white/80">{especialista.nome}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-app-border dark:border-app-border-dark p-3">
                <div>
                  <p className="text-sm text-app-text-primary dark:text-white">Acesso à agenda pessoal do especialista</p>
                  <p className="text-xs text-app-text-muted">Permite visualizar ou bloquear agenda pessoal na recepção.</p>
                </div>
                <Switch
                  checked={recepcionistaConfig.podeAcessarAgendaPessoal}
                  onCheckedChange={setAgendaPessoalAcesso}
                />
              </div>
            </div>
          )}

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              Atenção: Permissões críticas (como "Deletar Prontuário") estão bloqueadas por padrão para garantir a integridade dos dados.
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              className="h-11 px-6 bg-[#0039A6] hover:bg-[#1a3329] text-white rounded-lg font-normal"
              onClick={() => toast.success('Configurações de perfil salvas com sucesso.')}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
