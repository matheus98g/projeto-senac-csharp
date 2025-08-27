'use client'

import { useState, useEffect } from 'react'
import { apiClient, Curso, Professor, Aluno } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface VinculacaoCursoProps {
  curso: Curso
  onClose: () => void
}

export function VinculacaoCurso({ curso, onClose }: VinculacaoCursoProps) {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        const [professoresData, alunosData] = await Promise.all([
          apiClient.obterTodosProfessores(),
          apiClient.obterTodosAlunos()
        ])
        
        // Filtrar apenas ativos
        setProfessores(professoresData.filter(p => p.ativo))
        setAlunos(alunosData.filter(a => a.ativo))
      } catch (err) {
        setError('Erro ao carregar dados')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  const handleVincularProfessor = async (professorId: number | undefined) => {
    try {
      await apiClient.atualizarCurso(curso.id, { 
        ...curso, 
        professorId: professorId 
      })
      alert(professorId ? 'Professor vinculado com sucesso!' : 'Professor desvinculado com sucesso!')
      onClose()
    } catch (err) {
      alert(professorId ? 'Erro ao vincular professor' : 'Erro ao desvincular professor')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando dados...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>❌ {error}</p>
            <Button onClick={onClose} variant="outline" className="mt-4">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          🔗 Vinculações do Curso: {curso.nome}
        </CardTitle>
        <p className="text-muted-foreground">
          Gerencie professores e alunos vinculados a este curso
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Professor Atual */}
        <div>
          <h3 className="text-lg font-semibold mb-3">👨‍🏫 Professor Responsável</h3>
          {curso.professorId ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                Professor ID: {curso.professorId} está vinculado a este curso
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVincularProfessor(undefined)}
                className="mt-2"
              >
                🗑️ Remover Vinculação
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-3">
                Nenhum professor vinculado a este curso
              </p>
            </div>
          )}
        </div>

        {/* Lista de Professores Disponíveis */}
        <div>
          <h3 className="text-lg font-semibold mb-3">👨‍🏫 Professores Disponíveis</h3>
          {professores.length === 0 ? (
            <p className="text-muted-foreground">Nenhum professor ativo encontrado</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {professores.map((professor) => (
                <div
                  key={professor.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {professor.nome} {professor.sobrenome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {professor.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default">Ativo</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVincularProfessor(professor.id)}
                      disabled={curso.professorId === professor.id}
                    >
                      {curso.professorId === professor.id ? '✅ Vinculado' : '🔗 Vincular'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de Alunos */}
        <div>
          <h3 className="text-lg font-semibold mb-3">👨‍🎓 Alunos Disponíveis</h3>
          <p className="text-sm text-muted-foreground mb-3">
            * Funcionalidade de vinculação de alunos será implementada nas próximas versões
          </p>
          {alunos.length === 0 ? (
            <p className="text-muted-foreground">Nenhum aluno ativo encontrado</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {alunos.slice(0, 6).map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {aluno.nome} {aluno.sobrenome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {aluno.email}
                    </p>
                  </div>
                  <Badge variant="secondary">Disponível</Badge>
                </div>
              ))}
              {alunos.length > 6 && (
                <div className="p-3 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  +{alunos.length - 6} alunos adicionais
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            ✅ Concluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
