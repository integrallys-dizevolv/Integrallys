import { useState } from 'react'
import { Check, Shield, Save } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { PermissionModule } from '../../../components/types'

import { MOCK_PROFILES, MOCK_PERMISSION_MODULES } from '@/mocks/admin/profiles';


export function GerenciarPerfisView() {
  const [selectedProfile, setSelectedProfile] = useState('')
  const [modules, setModules] = useState<PermissionModule[]>(MOCK_PERMISSION_MODULES)

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
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              Atenção: Permissões críticas (como "Deletar Prontuário") estão bloqueadas por padrão para garantir a integridade dos dados.
            </p>
          </div>
          <div className="flex justify-end">
            <Button className="h-11 px-6 bg-[#0039A6] hover:bg-[#1a3329] text-white rounded-lg font-normal">
              <Save className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

