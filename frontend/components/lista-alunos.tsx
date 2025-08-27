'use client'

import { useState, useMemo } from 'react'
import { useAlunos } from '@/lib/hooks/use-alunos'
import { Aluno } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiltroBusca } from '@/components/filtro-busca'

interface ListaAlunosProps {
  onEditarAluno?: (aluno: Aluno) => void
}

export function ListaAlunos({ onEditarAluno }: ListaAlunosProps) {
  const { alunos, loading, error, carregarAlunos, removerAluno } = useAlunos()
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativo' | 'inativo'>('todos')

  const alunosFiltrados = useMemo(() => {
    let resultado = alunos

    // Filtro por busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase()
      resultado = resultado.filter(aluno => 
        aluno.nome.toLowerCase().includes(termo) ||
        aluno.sobrenome.toLowerCase().includes(termo) ||
        aluno.email.toLowerCase().includes(termo)
      )
    }

    // Filtro por status
    if (filtroAtivo !== 'todos') {
      resultado = resultado.filter(aluno => 
        filtroAtivo === 'ativo' ? aluno.ativo : !aluno.ativo
      )
    }

    return resultado
  }, [alunos, termoBusca, filtroAtivo])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando alunos...</span>
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
              onClick={carregarAlunos} 
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
    if (confirm(`Tem certeza que deseja remover o aluno ${nome}?`)) {
      const resultado = await removerAluno(id)
      if (!resultado.success) {
        alert(`Erro: ${resultado.error}`)
      }
    }
  }

  const formatarData = (data: string | undefined) => {
    if (!data) return 'Não informado'
    try {
      return new Date(data).toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  const filtrosAdicionais = (
    <div className="flex gap-2">
      <select
        value={filtroAtivo}
        onChange={(e) => setFiltroAtivo(e.target.value as 'todos' | 'ativo' | 'inativo')}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todos">Todos os status</option>
        <option value="ativo">Apenas ativos</option>
        <option value="inativo">Apenas inativos</option>
      </select>
    </div>
  )

  return (
    <div className="space-y-4">
      <FiltroBusca
        placeholder="Buscar alunos por nome, sobrenome ou e-mail..."
        onBuscar={setTermoBusca}
        filtrosAdicionais={filtrosAdicionais}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Lista de Alunos ({alunosFiltrados.length} de {alunos.length})
          </CardTitle>
          <Button onClick={carregarAlunos} variant="outline" size="sm">
            🔄 Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {alunosFiltrados.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {termoBusca || filtroAtivo !== 'todos' 
                ? 'Nenhum aluno encontrado com os filtros aplicados' 
                : 'Nenhum aluno encontrado'
              }
            </p>
          ) : (
            <div className="space-y-4">
              {alunosFiltrados.map((aluno) => (
              <div 
                key={aluno.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-lg">
                    {aluno.nome} {aluno.sobrenome}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                    <p>📧 {aluno.email}</p>
                    <p>📱 {aluno.telefone}</p>
                    <p>🎂 Nascimento: {formatarData(aluno.dataDeNascimento)}</p>
                    <p>📚 Matrícula: {formatarData(aluno.dataMatricula)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={aluno.ativo ? 'default' : 'secondary'}>
                    {aluno.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  {onEditarAluno && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditarAluno(aluno)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      ✏️ Editar
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemover(aluno.id, aluno.nome)}
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