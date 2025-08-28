'use client'

import { useState } from 'react'
import { Professor, FormacaoProfessor } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotificacao } from '@/components/notificacao-provider'

interface FormularioProfessorProps {
  professor?: Professor | null
  onSubmit: (dados: Omit<Professor, 'id'>) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  loading?: boolean
}

const formacoesDisponiveis = [
  { value: FormacaoProfessor.EnsinoMedio, label: 'Ensino Médio' },
  { value: FormacaoProfessor.EnsinoTecnico, label: 'Ensino Técnico' },
  { value: FormacaoProfessor.Graduado, label: 'Graduado' },
  { value: FormacaoProfessor.PosGraduado, label: 'Pós-Graduado' },
  { value: FormacaoProfessor.Mestrado, label: 'Mestrado' },
  { value: FormacaoProfessor.Doutorado, label: 'Doutorado' }
]

export function FormularioProfessor({ professor, onSubmit, onCancel, loading = false }: FormularioProfessorProps) {
  const { notificarCriado, notificarEditado, notificarErroOperacao } = useNotificacao()
  const [formData, setFormData] = useState({
    nome: professor?.nome || '',
    sobrenome: professor?.sobrenome || '',
    email: professor?.email || '',
    telefone: professor?.telefone || '',
    dataDeNascimento: professor?.dataDeNascimento ? professor.dataDeNascimento.split('T')[0] : '',
    dataContratacao: professor?.dataContratacao ? professor.dataContratacao.split('T')[0] : new Date().toISOString().split('T')[0],
    formacao: professor?.formacao || FormacaoProfessor.Graduado,
    ativo: professor?.ativo ?? true
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

    if (!formData.dataContratacao) {
      newErrors.dataContratacao = 'Data de contratação é obrigatória'
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
        dataDeNascimento: formData.dataDeNascimento ? `${formData.dataDeNascimento}T00:00:00.000Z` : undefined,
        dataContratacao: formData.dataContratacao ? `${formData.dataContratacao}T00:00:00.000Z` : undefined
      }

      const resultado = await onSubmit(dadosParaEnvio)
      
      if (resultado.success) {
        // Notificar sucesso
        if (professor) {
          notificarEditado('Professor', `${formData.nome} ${formData.sobrenome}`)
        } else {
          notificarCriado('Professor', `${formData.nome} ${formData.sobrenome}`)
        }

        // Limpar formulário após sucesso
        setFormData({
          nome: '',
          sobrenome: '',
          email: '',
          telefone: '',
          formacao: FormacaoProfessor.Graduado,
          ativo: true
        })
        setErrors({})
        onCancel() // Fecha o formulário
      } else {
        notificarErroOperacao('salvar', 'professor', resultado.error)
        setErrors({ submit: resultado.error || 'Erro ao salvar professor' })
      }
    } catch (error) {
      console.error('Erro ao salvar professor:', error)
      notificarErroOperacao('salvar', 'professor', 'Erro inesperado ao salvar professor. Verifique se a API está rodando.')
      setErrors({ submit: 'Erro inesperado ao salvar professor. Verifique se a API está rodando.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {professor ? '✏️ Editar Professor' : '➕ Cadastrar Novo Professor'}
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
              <Label htmlFor="dataDeNascimento">Data de Nascimento</Label>
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
              <Label htmlFor="dataContratacao">Data de Contratação *</Label>
              <Input
                id="dataContratacao"
                type="date"
                value={formData.dataContratacao}
                onChange={(e) => handleChange('dataContratacao', e.target.value)}
                className={errors.dataContratacao ? 'border-red-500' : ''}
              />
              {errors.dataContratacao && <p className="text-sm text-red-500">{errors.dataContratacao}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="formacao">Formação *</Label>
            <select
              id="formacao"
              value={formData.formacao}
              onChange={(e) => handleChange('formacao', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formacoesDisponiveis.map((formacao) => (
                <option key={formacao.value} value={formacao.value}>
                  {formacao.label}
                </option>
              ))}
            </select>
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
              Professor ativo
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
                  {professor ? '💾 Atualizar' : '➕ Cadastrar'}
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
