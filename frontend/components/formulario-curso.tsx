'use client'

import { useState, useEffect } from 'react'
import { Curso, CategoriaCurso, Professor } from '@/lib/api-client'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNotificacao } from '@/components/notificacao-provider'

interface FormularioCursoProps {
  curso?: Curso | null
  onSubmit: (dados: Omit<Curso, 'id'>) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  loading?: boolean
}

const categoriasDisponiveis = [
  { value: CategoriaCurso.Basico, label: 'Básico' },
  { value: CategoriaCurso.Medio, label: 'Médio' },
  { value: CategoriaCurso.Avancado, label: 'Avançado' }
]

export function FormularioCurso({ curso, onSubmit, onCancel, loading = false }: FormularioCursoProps) {
  const { notificarCriado, notificarEditado, notificarErroOperacao } = useNotificacao()
  const [formData, setFormData] = useState({
    nome: curso?.nome || '',
    descricao: curso?.descricao || '',
    valor: curso?.valor || 0,
    dataCriacao: curso?.dataCriacao ? curso.dataCriacao.split('T')[0] : new Date().toISOString().split('T')[0],
    professorId: curso?.professorId || undefined,
    cargaHoraria: curso?.cargaHoraria || 0,
    categoria: curso?.categoria || CategoriaCurso.Basico,
    ativo: curso?.ativo ?? true
  })

  const [professores, setProfessores] = useState<Professor[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [loadingProfessores, setLoadingProfessores] = useState(false)

  useEffect(() => {
    const carregarProfessores = async () => {
      setLoadingProfessores(true)
      try {
        const dados = await apiClient.obterTodosProfessores()
        setProfessores(dados.filter(professor => professor.ativo))
      } catch (error) {
        console.error('Erro ao carregar professores:', error)
      } finally {
        setLoadingProfessores(false)
      }
    }

    carregarProfessores()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória'
    }

    if (formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
    }

    if (formData.cargaHoraria <= 0) {
      newErrors.cargaHoraria = 'Carga horária deve ser maior que zero'
    }

    if (!formData.dataCriacao) {
      newErrors.dataCriacao = 'Data de criação é obrigatória'
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
        dataCriacao: formData.dataCriacao ? `${formData.dataCriacao}T00:00:00.000Z` : undefined
      }

      const resultado = await onSubmit(dadosParaEnvio)
      
      if (resultado.success) {
        // Notificar sucesso
        if (curso) {
          notificarEditado('Curso', formData.nome)
        } else {
          notificarCriado('Curso', formData.nome)
        }

        // Limpar formulário após sucesso
        setFormData({
          nome: '',
          descricao: '',
          valor: 0,
          cargaHoraria: 0,
          categoria: CategoriaCurso.Basico,
          ativo: true
        })
        setErrors({})
        onCancel() // Fecha o formulário
      } else {
        notificarErroOperacao('salvar', 'curso', resultado.error)
        setErrors({ submit: resultado.error || 'Erro ao salvar curso' })
      }
    } catch (error) {
      console.error('Erro ao salvar curso:', error)
      notificarErroOperacao('salvar', 'curso', 'Erro inesperado ao salvar curso. Verifique se a API está rodando.')
      setErrors({ submit: 'Erro inesperado ao salvar curso. Verifique se a API está rodando.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {curso ? '✏️ Editar Curso' : '➕ Cadastrar Novo Curso'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Digite o nome do curso"
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Digite a descrição do curso"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20 ${errors.descricao ? 'border-red-500' : ''}`}
            />
            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => handleChange('valor', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className={errors.valor ? 'border-red-500' : ''}
              />
              {errors.valor && <p className="text-sm text-red-500">{errors.valor}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargaHoraria">Carga Horária (horas) *</Label>
              <Input
                id="cargaHoraria"
                type="number"
                min="1"
                value={formData.cargaHoraria}
                onChange={(e) => handleChange('cargaHoraria', parseInt(e.target.value) || 0)}
                placeholder="Digite a carga horária"
                className={errors.cargaHoraria ? 'border-red-500' : ''}
              />
              {errors.cargaHoraria && <p className="text-sm text-red-500">{errors.cargaHoraria}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => handleChange('categoria', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categoriasDisponiveis.map((categoria) => (
                  <option key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataCriacao">Data de Criação *</Label>
              <Input
                id="dataCriacao"
                type="date"
                value={formData.dataCriacao}
                onChange={(e) => handleChange('dataCriacao', e.target.value)}
                className={errors.dataCriacao ? 'border-red-500' : ''}
              />
              {errors.dataCriacao && <p className="text-sm text-red-500">{errors.dataCriacao}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="professorId">Professor Responsável</Label>
            <select
              id="professorId"
              value={formData.professorId || ''}
              onChange={(e) => handleChange('professorId', e.target.value ? Number(e.target.value) : undefined)}
              disabled={loadingProfessores}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um professor (opcional)</option>
              {professores.map((professor) => (
                <option key={professor.id} value={professor.id}>
                  {professor.nome} {professor.sobrenome}
                </option>
              ))}
            </select>
            {loadingProfessores && <p className="text-sm text-gray-500">Carregando professores...</p>}
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
              Curso ativo
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
                  {curso ? '💾 Atualizar' : '➕ Cadastrar'}
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
