'use client'

import { useState, useEffect } from 'react'
import { apiClient, Curso, Professor, Aluno } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNotificacao } from '@/components/notificacao-provider'

interface VinculacaoCursoProps {
  curso: Curso
  onClose: () => void
}

export function VinculacaoCurso({ curso, onClose }: VinculacaoCursoProps) {
  const { notificarSucesso, notificarErroOperacao } = useNotificacao()
  const [professores, setProfessores] = useState<Professor[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [alunosVinculados, setAlunosVinculados] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [professorVinculado, setProfessorVinculado] = useState<Professor | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true)
      try {
        const [professoresData, alunosData] = await Promise.all([
          apiClient.obterTodosProfessores(),
          apiClient.obterTodosAlunos()
        ])
        
        // Filtrar apenas ativos
        const professoresAtivos = professoresData.filter(p => p.ativo)
        const alunosAtivos = alunosData.filter(a => a.ativo)
        
        setProfessores(professoresAtivos)
        setAlunos(alunosAtivos)
        
        // Buscar o professor vinculado se houver
        if (curso.professorId) {
          const professor = professoresAtivos.find(p => p.id === curso.professorId)
          setProfessorVinculado(professor || null)
        }

        // Carregar alunos vinculados separadamente para evitar erro 404
        try {
          const alunosVinculadosData = await apiClient.obterAlunosDoCurso(curso.id)
          setAlunosVinculados(alunosVinculadosData)
        } catch (err) {
          console.warn('Erro ao carregar alunos vinculados:', err)
          setAlunosVinculados([])
        }
      } catch (err) {
        setError('Erro ao carregar dados')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [curso.professorId, curso.id])

  const handleVincularProfessor = async (professorId: number | undefined) => {
    try {
      // Enviar apenas os dados necessários para a atualização
      await apiClient.atualizarCurso(curso.id, { 
        descricao: curso.descricao,
        categoria: curso.categoria,
        valor: curso.valor,
        cargaHoraria: curso.cargaHoraria,
        ativo: curso.ativo,
        professorId: professorId 
      })
      
      // Atualizar o professor vinculado
      if (professorId) {
        const professor = professores.find(p => p.id === professorId)
        setProfessorVinculado(professor || null)
        notificarSucesso('Professor vinculado', 'Professor vinculado ao curso com sucesso!')
      } else {
        setProfessorVinculado(null)
        notificarSucesso('Professor desvinculado', 'Professor desvinculado do curso com sucesso!')
      }
      
      onClose()
    } catch (err) {
      const operacao = professorId ? 'vincular' : 'desvincular'
      notificarErroOperacao(operacao, 'professor', 'Erro ao vincular professor ao curso')
      console.error(err)
    }
  }

  const handleVincularAluno = async (alunoId: number) => {
    try {
      // Verificar se o curso está ativo
      if (!curso.ativo) {
        notificarErroOperacao('vincular', 'aluno', 'Não é possível vincular alunos a um curso inativo')
        return
      }

      // Verificar se o aluno está ativo
      const aluno = alunos.find(a => a.id === alunoId)
      if (!aluno?.ativo) {
        notificarErroOperacao('vincular', 'aluno', 'Não é possível vincular um aluno inativo')
        return
      }

      await apiClient.vincularAlunoACurso(alunoId, curso.id)
      
      // Atualizar lista de alunos vinculados
      if (aluno) {
        setAlunosVinculados(prev => [...prev, aluno])
      }
      
      notificarSucesso('Aluno vinculado', 'Aluno vinculado ao curso com sucesso!')
    } catch (err) {
      notificarErroOperacao('vincular', 'aluno', 'Erro ao vincular aluno ao curso')
      console.error(err)
    }
  }

  const handleDesvincularAluno = async (alunoId: number) => {
    try {
      await apiClient.desvincularAlunoDoCurso(alunoId, curso.id)
      
      // Remover da lista de alunos vinculados
      setAlunosVinculados(prev => prev.filter(a => a.id !== alunoId))
      
      notificarSucesso('Aluno desvinculado', 'Aluno desvinculado do curso com sucesso!')
    } catch (err) {
      notificarErroOperacao('desvincular', 'aluno', 'Erro ao desvincular aluno do curso')
      console.error(err)
    }
  }

  const isAlunoVinculado = (alunoId: number) => {
    return alunosVinculados.some(a => a.id === alunoId)
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
          {professorVinculado ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                {professorVinculado.nome} {professorVinculado.sobrenome}
              </p>
              <p className="text-green-600 text-sm">
                {professorVinculado.email}
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

        {/* Alunos Vinculados */}
        <div>
          <h3 className="text-lg font-semibold mb-3">👨‍🎓 Alunos Vinculados ({alunosVinculados.length})</h3>
          {alunosVinculados.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Nenhum aluno vinculado a este curso
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {alunosVinculados.map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200"
                >
                  <div>
                    <p className="font-medium text-green-800">
                      {aluno.nome} {aluno.sobrenome}
                    </p>
                    <p className="text-sm text-green-600">
                      {aluno.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default" className="bg-green-600">Vinculado</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDesvincularAluno(aluno.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️ Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de Alunos Disponíveis para Vincular */}
        <div>
          <h3 className="text-lg font-semibold mb-3">👨‍🎓 Alunos Disponíveis para Vincular</h3>
          
          {/* Informações de debug */}
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <p><strong>Status do Curso:</strong> {curso.ativo ? '✅ Ativo' : '❌ Inativo'}</p>
            <p><strong>Alunos ativos disponíveis:</strong> {alunos.filter(a => a.ativo).length}</p>
          </div>
          
          {alunos.length === 0 ? (
            <p className="text-muted-foreground">Nenhum aluno ativo encontrado</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {alunos
                .filter(aluno => aluno.ativo && !isAlunoVinculado(aluno.id))
                .slice(0, 6)
                .map((aluno) => (
                <div
                  key={aluno.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {aluno.nome} {aluno.sobrenome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {aluno.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Disponível</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVincularAluno(aluno.id)}
                    >
                      🔗 Vincular
                    </Button>
                  </div>
                </div>
              ))}
              {alunos.filter(aluno => aluno.ativo && !isAlunoVinculado(aluno.id)).length > 6 && (
                <div className="p-3 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  +{alunos.filter(aluno => aluno.ativo && !isAlunoVinculado(aluno.id)).length - 6} alunos adicionais
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
