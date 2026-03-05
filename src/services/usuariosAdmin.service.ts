import { mockUsers } from '@/mocks/admin/users'
import type { User } from '@/pages/admin/components/types'

const STORAGE_KEY = 'admin_usuarios_mock_db'
const UPDATE_EVENT = 'admin-usuarios-updated'

function readStorage(): User[] | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as User[]) : null
  } catch {
    return null
  }
}

function writeStorage(users: User[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  window.dispatchEvent(new Event(UPDATE_EVENT))
}

export function getUsuariosAdminSync(): User[] {
  return readStorage() ?? mockUsers
}

export async function getUsuariosAdmin(): Promise<User[]> {
  // TODO: Supabase
  // const { data, error } = await supabase
  //   .from('usuarios')
  //   .select('*')
  // if (error) throw error
  // return data

  return getUsuariosAdminSync()
}

export async function saveUsuarioAdmin(user: User): Promise<User[]> {
  const current = getUsuariosAdminSync()
  const index = current.findIndex((item) => item.id === user.id)

  const next = index >= 0
    ? current.map((item) => (item.id === user.id ? user : item))
    : [...current, user]

  writeStorage(next)
  return next
}

export async function deleteUsuarioAdmin(id: number): Promise<User[]> {
  const next = getUsuariosAdminSync().filter((item) => item.id !== id)
  writeStorage(next)
  return next
}

export function subscribeUsuariosAdmin(onChange: (users: User[]) => void): () => void {
  if (typeof window === 'undefined') return () => undefined

  const handler = () => onChange(getUsuariosAdminSync())
  window.addEventListener('storage', handler)
  window.addEventListener(UPDATE_EVENT, handler)

  return () => {
    window.removeEventListener('storage', handler)
    window.removeEventListener(UPDATE_EVENT, handler)
  }
}
