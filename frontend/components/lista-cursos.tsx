'use client'

import { useCursos } from '@/lib/hooks/use-cursos'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ListaCursos() {
  const { cursos, loading, error, carregarCursos, removerCurso } = useCursos()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando cursos...</span>
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
              onClick={carregarCursos} 
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
    if (confirm(`Tem certeza que deseja remover o curso "${nome}"?`)) {
      const resultado = await removerCurso(id)
      if (!resultado.success) {
        alert(`Erro: ${resultado.error}`)
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lista de Cursos ({cursos.length})</CardTitle>
        <Button onClick={carregarCursos} variant="outline" size="sm">
          🔄 Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {cursos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum curso encontrado
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cursos.map((curso) => (
              <Card key={curso.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{curso.nome}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {curso.descricao && (
                    <p className="text-sm text-muted-foreground">
                      {curso.descricao}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>🆔 ID: {curso.id}</p>
                    {curso.cargaHoraria && (
                      <p>⏱️ Carga Horária: {curso.cargaHoraria}h</p>
                    )}
                    {curso.categoria && (
                      <p>📂 Categoria: {curso.categoria}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      ✏️ Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemover(curso.id, curso.nome)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      🗑️ Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 