'use client'

import { useAlunos } from '@/lib/hooks/use-alunos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ListaAlunos() {
  const { alunos, loading, error, carregarAlunos, removerAluno } = useAlunos()

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lista de Alunos ({alunos.length})</CardTitle>
        <Button onClick={carregarAlunos} variant="outline" size="sm">
          🔄 Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {alunos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum aluno encontrado
          </p>
        ) : (
          <div className="space-y-4">
            {alunos.map((aluno) => (
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
                    <p>🎂 Nascimento: {formatarData(aluno.dataNasc)}</p>
                    <p>📚 Matrícula: {formatarData(aluno.matricula)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant={aluno.ativo ? 'default' : 'secondary'}>
                    {aluno.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
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
  )
} 