import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@nexaagenda.com')
  const [password, setPassword] = useState('Admin@123')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login({ email, password })
      toast.success('Login realizado com sucesso!')
      navigate('/admin/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Nexa</h1>
          <p className="text-text-secondary">Painel Administrativo</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-card/50 border border-card rounded-lg p-8 space-y-6"
        >
          <Input
            id="email"
            type="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            id="password"
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>

          {/* Demo Info */}
          <div className="bg-background/50 border border-warning/30 rounded-lg p-4 text-sm text-text-secondary">
            <p className="font-semibold text-warning mb-2">Credenciais de Demonstração:</p>
            <p>E-mail: admin@nexaagenda.com</p>
            <p>Senha: Admin@123</p>
          </div>
        </form>
      </div>
    </div>
  )
}