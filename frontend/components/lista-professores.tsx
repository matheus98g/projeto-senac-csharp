'use client'

import { useState, useMemo } from 'react'
import { useProfessores } from '@/lib/hooks/use-professores'
import { FormacaoProfessor, Professor } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiltroBusca } from '@/components/filtro-busca'

const getFormacaoLabel = (formacao: FormacaoProfessor): string => {
  switch (formacao) {
    case FormacaoProfessor.EnsinoMedio:
      return 'Ensino Médio'
    case FormacaoProfessor.EnsinoTecnico:
      return 'Ensino Técnico'
    case FormacaoProfessor.Graduado:
      return 'Graduado'
    case FormacaoProfessor.PosGraduado:
      return 'Pós-Graduado'
    case FormacaoProfessor.Mestrado:
      return 'Mestrado'
    case FormacaoProfessor.Doutorado:
      return 'Doutorado'
    default:
      return 'Não informado'
  }
}

interface ListaProfessoresProps {
  onEditarProfessor?: (professor: Professor) => void
}

export function ListaProfessores({ onEditarProfessor }: ListaProfessoresProps) {
  const { professores, loading, error, carregarProfessores, removerProfessor } = useProfessores()
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [filtroFormacao, setFiltroFormacao] = useState<string>('todas')

  const professoresFiltrados = useMemo(() => {
    let resultado = professores

    // Filtro por busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase()
      resultado = resultado.filter(professor => 
        professor.nome.toLowerCase().includes(termo) ||
        professor.sobrenome.toLowerCase().includes(termo) ||
        professor.email.toLowerCase().includes(termo)
      )
    }

    // Filtro por status
    if (filtroAtivo !== 'todos') {
      resultado = resultado.filter(professor => 
        filtroAtivo === 'ativo' ? professor.ativo : !professor.ativo
      )
    }

    // Filtro por formação
    if (filtroFormacao !== 'todas') {
      resultado = resultado.filter(professor => 
        professor.formacao.toString() === filtroFormacao
      )
    }

    return resultado
  }, [professores, termoBusca, filtroAtivo, filtroFormacao])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando professores...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>❌ {error}</p>
            <Button 
              onClick={carregarProfessores} 
              variant="outline" 
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleRemover = async (id: number, nome: string) => {
    if (confirm(`Tem certeza que deseja remover o professor ${nome}?`)) {
      const resultado = await removerProfessor(id)
      if (!resultado.success) {
        alert(`Erro: ${resultado.error}`)
      }
    }
  }

  const filtrosAdicionais = (
    <div className="flex gap-2 flex-wrap">
      <select
        value={filtroAtivo}
        onChange={(e) => setFiltroAtivo(e.target.value as 'todos' | 'ativo' | 'inativo')}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todos">Todos os status</option>
        <option value="ativo">Apenas ativos</option>
        <option value="inativo">Apenas inativos</option>
      </select>
      
      <select
        value={filtroFormacao}
        onChange={(e) => setFiltroFormacao(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todas">Todas as formações</option>
        <option value="1">Ensino Médio</option>
        <option value="2">Ensino Técnico</option>
        <option value="3">Graduado</option>
        <option value="4">Pós-Graduado</option>
        <option value="5">Mestrado</option>
        <option value="6">Doutorado</option>
      </select>
    </div>
  )

  return (
    <div className="space-y-4">
      <FiltroBusca
        placeholder="Buscar professores por nome, sobrenome ou e-mail..."
        onBuscar={setTermoBusca}
        filtrosAdicionais={filtrosAdicionais}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Lista de Professores ({professoresFiltrados.length} de {professores.length})
          </CardTitle>
          <Button onClick={carregarProfessores} variant="outline" size="sm">
            🔄 Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {professoresFiltrados.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {termoBusca || filtroAtivo !== 'todos' || filtroFormacao !== 'todas'
                ? 'Nenhum professor encontrado com os filtros aplicados' 
                : 'Nenhum professor encontrado'
              }
            </p>
          ) : (
            <div className="space-y-4">
              {professoresFiltrados.map((professor) => (
              <div 
                key={professor.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-lg">
                    👨‍🏫 {professor.nome} {professor.sobrenome}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                    <p>📧 {professor.email}</p>
                    <p>📱 {professor.telefone}</p>
                    <p>🎓 Formação: {getFormacaoLabel(professor.formacao)}</p>
                    <p>🆔 ID: {professor.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={professor.ativo ? 'default' : 'secondary'}>
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  {onEditarProfessor && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditarProfessor(professor)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      ✏️ Editar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemover(professor.id, professor.nome)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    🗑️ Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  )
} 