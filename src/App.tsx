import { useState } from 'react'
import { LoginScreen } from './pages/login/LoginScreen'
import { PrincipalAdmin } from './pages/admin/PrincipalAdmin'
import { PrincipalPaciente } from './pages/paciente/PrincipalPaciente'
import { PrincipalEspecialista } from './pages/especialista/PrincipalEspecialista'
import { PrincipalRecepcao } from './pages/recepcao/PrincipalRecepcao'
import { PrincipalGestor } from './pages/gestor/PrincipalGestor'
import { PrincipalMasterUnified } from './pages/master'

type UserRole = 'admin' | 'paciente' | 'especialista' | 'recepcao' | 'gestor' | 'master'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  const handleLogin = (role: UserRole) => {
    setUserRole(role)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const renderContent = () => {
    switch (userRole) {
      case 'admin':
        return <PrincipalAdmin onLogout={handleLogout} />
      case 'paciente':
        return <PrincipalPaciente onLogout={handleLogout} />
      case 'especialista':
        return <PrincipalEspecialista onLogout={handleLogout} />
      case 'recepcao':
        return <PrincipalRecepcao onLogout={handleLogout} />
      case 'gestor':
        return <PrincipalGestor onLogout={handleLogout} />
      case 'master':
        return <PrincipalMasterUnified onLogout={handleLogout} />
      default:
        return <PrincipalRecepcao onLogout={handleLogout} />
    }
  }

  return renderContent()
}

export default App


