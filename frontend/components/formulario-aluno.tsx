'use client'

import { useState } from 'react'
import { Aluno } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotificacao } from '@/components/notificacao-provider'

interface FormularioAlunoProps {
  aluno?: Aluno | null
  onSubmit: (dados: Omit<Aluno, 'id'>) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  loading?: boolean
}

export function FormularioAluno({ aluno, onSubmit, onCancel, loading = false }: FormularioAlunoProps) {
  const { notificarCriado, notificarEditado, notificarErroOperacao } = useNotificacao()
  const [formData, setFormData] = useState({
    nome: aluno?.nome || '',
    sobrenome: aluno?.sobrenome || '',
    email: aluno?.email || '',
    telefone: aluno?.telefone || '',
    dataDeNascimento: aluno?.dataDeNascimento ? aluno.dataDeNascimento.split('T')[0] : '',
    dataMatricula: aluno?.dataMatricula ? aluno.dataMatricula.split('T')[0] : new Date().toISOString().split('T')[0],
    ativo: aluno?.ativo ?? true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.sobrenome.trim()) {
      newErrors.sobrenome = 'Sobrenome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail deve ter um formato válido'
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório'
    }

    if (!formData.dataDeNascimento) {
      newErrors.dataDeNascimento = 'Data de nascimento é obrigatória'
    }

    if (!formData.dataMatricula) {
      newErrors.dataMatricula = 'Data de matrícula é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    
    try {
      const dadosParaEnvio = {
        ...formData,
        dataDeNascimento: `${formData.dataDeNascimento}T00:00:00.000Z`,
        dataMatricula: `${formData.dataMatricula}T00:00:00.000Z`
      }

      const resultado = await onSubmit(dadosParaEnvio)
      
      if (resultado.success) {
        // Notificar sucesso
        if (aluno) {
          notificarEditado('Aluno', `${formData.nome} ${formData.sobrenome}`)
        } else {
          notificarCriado('Aluno', `${formData.nome} ${formData.sobrenome}`)
        }

        // Limpar formulário após sucesso
        setFormData({
          nome: '',
          sobrenome: '',
          email: '',
          telefone: '',
          dataDeNascimento: '',
          dataMatricula: new Date().toISOString().split('T')[0],
          ativo: true
        })
        setErrors({})
        onCancel() // Fecha o formulário
      } else {
        notificarErroOperacao('salvar', 'aluno', resultado.error)
        setErrors({ submit: resultado.error || 'Erro ao salvar aluno' })
      }
    } catch (error) {
      console.error('Erro ao salvar aluno:', error)
      notificarErroOperacao('salvar', 'aluno', 'Erro inesperado ao salvar aluno. Verifique se a API está rodando.')
      setErrors({ submit: 'Erro inesperado ao salvar aluno. Verifique se a API está rodando.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {aluno ? '✏️ Editar Aluno' : '➕ Cadastrar Novo Aluno'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Digite o nome"
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sobrenome">Sobrenome *</Label>
              <Input
                id="sobrenome"
                value={formData.sobrenome}
                onChange={(e) => handleChange('sobrenome', e.target.value)}
                placeholder="Digite o sobrenome"
                className={errors.sobrenome ? 'border-red-500' : ''}
              />
              {errors.sobrenome && <p className="text-sm text-red-500">{errors.sobrenome}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Digite o e-mail"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              placeholder="Digite o telefone"
              className={errors.telefone ? 'border-red-500' : ''}
            />
            {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataDeNascimento">Data de Nascimento *</Label>
              <Input
                id="dataDeNascimento"
                type="date"
                value={formData.dataDeNascimento}
                onChange={(e) => handleChange('dataDeNascimento', e.target.value)}
                className={errors.dataDeNascimento ? 'border-red-500' : ''}
              />
              {errors.dataDeNascimento && <p className="text-sm text-red-500">{errors.dataDeNascimento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataMatricula">Data de Matrícula *</Label>
              <Input
                id="dataMatricula"
                type="date"
                value={formData.dataMatricula}
                onChange={(e) => handleChange('dataMatricula', e.target.value)}
                className={errors.dataMatricula ? 'border-red-500' : ''}
              />
              {errors.dataMatricula && <p className="text-sm text-red-500">{errors.dataMatricula}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ativo" className="flex items-center gap-2">
              <input
                id="ativo"
                type="checkbox"
                checked={formData.ativo}
                onChange={(e) => handleChange('ativo', e.target.checked)}
                className="rounded"
              />
              Aluno ativo
            </Label>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={submitting || loading}
              className="flex-1"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  {aluno ? '💾 Atualizar' : '➕ Cadastrar'}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting || loading}
              className="flex-1"
            >
              ❌ Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
