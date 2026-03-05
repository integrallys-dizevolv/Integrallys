import { useEffect, useState } from 'react'
import type { User } from '@/pages/admin/components/types'
import {
  deleteUsuarioAdmin,
  getUsuariosAdmin,
  getUsuariosAdminSync,
  saveUsuarioAdmin,
  subscribeUsuariosAdmin,
} from '@/services/usuariosAdmin.service'
import { mockUsers } from '@/mocks/admin/users'

export function useUsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadUsuarios = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getUsuariosAdmin()
        if (!isMounted) return
        setUsuarios(data)
      } catch {
        if (!isMounted) return
        setError('Erro ao carregar usuários do Admin')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUsuarios()

    const unsubscribe = subscribeUsuariosAdmin((users) => {
      if (isMounted) {
        setUsuarios(users)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const upsertUsuario = async (user: User) => {
    const previous = usuarios
    const hasUser = previous.some((item) => item.id === user.id)
    const optimistic = hasUser
      ? previous.map((item) => (item.id === user.id ? user : item))
      : [...previous, user]

    setUsuarios(optimistic)

    try {
      const next = await saveUsuarioAdmin(user)
      setUsuarios(next)
    } catch {
      setUsuarios(previous)
      throw new Error('Erro ao salvar usuário')
    }
  }

  const removeUsuario = async (id: number) => {
    const previous = usuarios
    setUsuarios(previous.filter((item) => item.id !== id))

    try {
      const next = await deleteUsuarioAdmin(id)
      setUsuarios(next)
    } catch {
      setUsuarios(previous)
      throw new Error('Erro ao remover usuário')
    }
  }

  const reloadUsuarios = async () => {
    setUsuarios(getUsuariosAdminSync())
  }

  return {
    usuarios,
    loading,
    error,
    upsertUsuario,
    removeUsuario,
    reloadUsuarios,
  }
}
