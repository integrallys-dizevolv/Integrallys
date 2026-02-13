import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Moon, Sun } from 'lucide-react'
import { Button } from './components/ui/Button'
import { Input } from './components/ui/Input'
import { useDarkMode } from '../../hooks/useDarkMode'
import loginBackground from '../../assets/images/login-background.png'
import integrallysLogo from '../../assets/images/Integrallys-Logo.png'

type UserRole = 'admin' | 'paciente' | 'especialista' | 'recepcao' | 'gestor' | 'master'

interface LoginScreenProps {
  onLogin?: (role: UserRole) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [view, setView] = useState<'login' | 'forgot-password'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulação de login baseada nas credenciais fornecidas
    setTimeout(() => {
      setIsLoading(false)

      const credentials: Record<string, { password: string; role: UserRole }> = {
        'd@admin': { password: '1234', role: 'admin' },
        'd@paciente': { password: '1234', role: 'paciente' },
        'd@especialista': { password: '1234', role: 'especialista' },
        'user@recep': { password: '1234', role: 'recepcao' },
        'd@gestor': { password: '1234', role: 'gestor' },
        'd@master': { password: '1234', role: 'master' },
      }

      const user = credentials[email]

      if (user && user.password === password) {
        console.log('Login realizado:', { email, role: user.role })
        onLogin?.(user.role)
      } else {
        setError('E-mail ou senha incorretos')
      }
    }, 800)
  }


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Integrar com Supabase para recuperação de senha
    setTimeout(() => {
      setIsLoading(false)
      alert('Instruções enviadas para seu e-mail!')
      setView('login')
    }, 800)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-300 relative p-4 sm:p-6 md:p-8"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/40' : 'bg-black/20'}`} />
      {/* Botão de Dark Mode no canto superior direito */}
      <button
        onClick={toggleDarkMode}
        className={`
          absolute 
          top-3 sm:top-6 
          right-3 sm:right-6 
          w-10 sm:w-[46px] 
          h-10 sm:h-[46px] 
          rounded-lg sm:rounded-[10px] 
          border 
          flex 
          items-center 
          justify-center 
          transition-all 
          duration-300 
          shadow-sm 
          hover:shadow-md
          z-20
          ${isDarkMode
            ? 'bg-[#0f172a] border-[#1e3a5f] text-white hover:bg-[#1e293b]'
            : 'bg-white border-gray-200 text-[#364153] hover:bg-gray-50'
          }
        `}
        title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        aria-label={isDarkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>



      {/* Card de Login/Recuperação */}
      <div
        className={`
          w-full 
          max-w-[480px] 
          mx-4
          rounded-2xl 
          shadow-2xl 
          transition-colors 
          duration-300
          z-10
          ${isDarkMode
            ? 'bg-[#0f172a]/95 border border-[#1e3a5f] backdrop-blur-sm'
            : 'bg-white/95 border border-gray-100 backdrop-blur-sm'
          }
        `}
      >
        <div className="p-5 sm:p-8 space-y-5 sm:space-y-8">
          {/* Logo e Título */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <img
                src={integrallysLogo}
                alt="Integrallys"
                className="h-16 w-auto"
              />
            </div>

            <p
              className={`
                text-sm 
                text-center 
                transition-colors 
                duration-300
                ${isDarkMode ? 'text-[#99a1af]' : 'text-[#6a7282]'}
              `}
            >
              {view === 'login'
                ? 'Faça login para acessar sua conta'
                : 'Recupere sua senha'
              }
            </p>
          </div>

          {/* Formulário de Login */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label
                  className={`
                    text-sm 
                    transition-colors 
                    duration-300
                    ${isDarkMode ? 'text-[#d1d5dc]' : 'text-[#364153]'}
                  `}
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    className={`
                      absolute 
                      left-3 
                      top-3 
                      h-5 
                      w-5 
                      transition-colors 
                      duration-300
                      ${isDarkMode ? 'text-[#717182]' : 'text-[#717182]'}
                    `}
                  />
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-11"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label
                  className={`
                    text-sm 
                    transition-colors 
                    duration-300
                    ${isDarkMode ? 'text-[#d1d5dc]' : 'text-[#364153]'}
                  `}
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    className={`
                      absolute 
                      left-3 
                      top-3 
                      h-5 
                      w-5 
                      transition-colors 
                      duration-300
                      ${isDarkMode ? 'text-[#717182]' : 'text-[#717182]'}
                    `}
                  />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 pr-11 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#717182] hover:text-[#364153] transition-colors"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Esqueci minha senha */}
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className={`
                    text-sm 
                    transition-colors 
                    duration-300
                    ${isDarkMode
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-[#0039A6] hover:text-[#002D7A]'
                    }
                  `}
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Mensagem de erro */}
              {error && (
                <div
                  className={`
                    rounded-lg 
                    p-3 
                    border
                    ${isDarkMode
                      ? 'bg-red-900/20 border-red-800'
                      : 'bg-red-50 border-red-200'
                    }
                  `}
                >
                  <p
                    className={`
                      text-sm 
                      text-center
                      ${isDarkMode ? 'text-red-400' : 'text-red-600'}
                    `}
                  >
                    {error}
                  </p>
                </div>
              )}

              {/* Botão Entrar */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          )}

          {/* Formulário de Recuperação de Senha */}
          {view === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {/* Botão Voltar */}
              <button
                type="button"
                onClick={() => setView('login')}
                className={`
                  flex 
                  items-center 
                  gap-2 
                  text-sm 
                  transition-colors 
                  duration-300
                  ${isDarkMode
                    ? 'text-[#99a1af] hover:text-white'
                    : 'text-[#6a7282] hover:text-[#364153]'
                  }
                `}
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para login
              </button>

              {/* Descrição */}
              <p
                className={`
                  text-sm 
                  transition-colors 
                  duration-300
                  ${isDarkMode ? 'text-[#99a1af]' : 'text-[#6a7282]'}
                `}
              >
                Digite seu e-mail cadastrado e enviaremos instruções para recuperar sua senha.
              </p>

              {/* Email */}
              <div className="space-y-2">
                <label
                  className={`
                    text-sm 
                    transition-colors 
                    duration-300
                    ${isDarkMode ? 'text-[#d1d5dc]' : 'text-[#364153]'}
                  `}
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    className={`
                      absolute 
                      left-3 
                      top-3 
                      h-5 
                      w-5 
                      transition-colors 
                      duration-300
                      ${isDarkMode ? 'text-[#717182]' : 'text-[#717182]'}
                    `}
                  />
                  <Input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-11"
                  />
                </div>
              </div>

              {/* Botão Enviar */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Enviando...' : 'Enviar instruções'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
