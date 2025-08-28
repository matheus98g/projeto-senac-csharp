'use client'

import { useState, useMemo } from 'react'
import { useAlunos } from '@/lib/hooks/use-alunos'
import { Aluno } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiltroBusca } from '@/components/filtro-busca'
import { ModalConfirmacao } from '@/components/ui/modal-confirmacao'
import { useNotificacao } from '@/components/notificacao-provider'

interface ListaAlunosProps {
  onEditarAluno?: (aluno: Aluno) => void
}

export function ListaAlunos({ onEditarAluno }: ListaAlunosProps) {
  const { alunos, loading, error, carregarAlunos, removerAluno } = useAlunos()
  const { notificarExcluido, notificarErroOperacao } = useNotificacao()
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [modalExclusao, setModalExclusao] = useState<{
    aberto: boolean
    aluno: Aluno | null
  }>({
    aberto: false,
    aluno: null
  })
  const [excluindo, setExcluindo] = useState(false)

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

  const handleRemover = async (aluno: Aluno) => {
    setModalExclusao({
      aberto: true,
      aluno
    })
  }

  const confirmarExclusao = async () => {
    if (!modalExclusao.aluno) return

    setExcluindo(true)
    try {
      const resultado = await removerAluno(modalExclusao.aluno.id)
      if (resultado.success) {
        notificarExcluido('Aluno', modalExclusao.aluno.nome)
        setModalExclusao({ aberto: false, aluno: null })
        // Recarregar a lista para garantir sincronização
        await carregarAlunos()
      } else {
        notificarErroOperacao('excluir', 'aluno', resultado.error)
        // Mesmo com erro, fechar o modal para não travar a interface
        setModalExclusao({ aberto: false, aluno: null })
      }
    } catch (error) {
      console.error('Erro inesperado ao excluir aluno:', error)
      notificarErroOperacao('excluir', 'aluno', 'Erro inesperado ocorreu')
      // Mesmo com erro, fechar o modal para não travar a interface
      setModalExclusao({ aberto: false, aluno: null })
    } finally {
      setExcluindo(false)
    }
  }

  const cancelarExclusao = () => {
    setModalExclusao({ aberto: false, aluno: null })
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {alunosFiltrados.map((aluno) => (
                <Card key={aluno.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {aluno.nome} {aluno.sobrenome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>📧 {aluno.email}</p>
                      <p>📱 {aluno.telefone || 'Não informado'}</p>
                      <p>🎂 Nascimento: {formatarData(aluno.dataDeNascimento)}</p>
                      <p>📚 Matrícula: {formatarData(aluno.dataMatricula)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Badge variant={aluno.ativo ? 'default' : 'secondary'}>
                        {aluno.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <div className="flex gap-1 flex-wrap">
                        {onEditarAluno && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEditarAluno(aluno)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            ✏️
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemover(aluno)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmacao
        aberto={modalExclusao.aberto}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o aluno "${modalExclusao.aluno?.nome} ${modalExclusao.aluno?.sobrenome}"? Esta ação não pode ser desfeita.`}
        textoConfirmacao="Excluir Aluno"
        textoCancelamento="Cancelar"
        tipo="perigo"
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
        carregando={excluindo}
      />
    </div>
  )
} 