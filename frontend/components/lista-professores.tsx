'use client'

import { useProfessores } from '@/lib/hooks/use-professores'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ListaProfessores() {
  const { professores, loading, error, carregarProfessores, removerProfessor } = useProfessores()

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lista de Professores ({professores.length})</CardTitle>
        <Button onClick={carregarProfessores} variant="outline" size="sm">
          🔄 Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {professores.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum professor encontrado
          </p>
        ) : (
          <div className="space-y-4">
            {professores.map((professor) => (
              <div 
                key={professor.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-lg">
                    👨‍🏫 {professor.nome}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                    <p>📧 {professor.email}</p>
                    {professor.telefone && (
                      <p>📱 {professor.telefone}</p>
                    )}
                    {professor.especialidade && (
                      <p>🎯 Especialidade: {professor.especialidade}</p>
                    )}
                    <p>🆔 ID: {professor.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
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
  )
} 