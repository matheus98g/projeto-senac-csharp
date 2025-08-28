'use client'

import { useState, useMemo } from 'react'
import { useCursos } from '@/lib/hooks/use-cursos'
import { CategoriaCurso, Curso } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FiltroBusca } from '@/components/filtro-busca'
import { ModalConfirmacao } from '@/components/ui/modal-confirmacao'
import { useNotificacao } from '@/components/notificacao-provider'

const getCategoriaLabel = (categoria: CategoriaCurso | undefined): string => {
  if (categoria === undefined || categoria === null) {
    return 'Não informado'
  }
  
  switch (categoria) {
    case CategoriaCurso.Basico:
      return 'Básico'
    case CategoriaCurso.Medio:
      return 'Médio'
    case CategoriaCurso.Avancado:
      return 'Avançado'
    default:
      return 'Não informado'
  }
}

interface ListaCursosProps {
  onEditarCurso?: (curso: Curso) => void
  onVincularCurso?: (curso: Curso) => void
}

export function ListaCursos({ onEditarCurso, onVincularCurso }: ListaCursosProps) {
  const { cursos, loading, error, carregarCursos, removerCurso } = useCursos()
  const { notificarExcluido, notificarErroOperacao } = useNotificacao()
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
  const [filtroValorMin, setFiltroValorMin] = useState<string>('')
  const [modalExclusao, setModalExclusao] = useState<{
    aberto: boolean
    curso: Curso | null
  }>({
    aberto: false,
    curso: null
  })
  const [excluindo, setExcluindo] = useState(false)

  const cursosFiltrados = useMemo(() => {
    let resultado = cursos

    // Filtro por busca
    if (termoBusca.trim()) {
      const termo = termoBusca.toLowerCase()
      resultado = resultado.filter(curso => 
        curso.nome.toLowerCase().includes(termo) ||
        curso.descricao.toLowerCase().includes(termo)
      )
    }

    // Filtro por status
    if (filtroAtivo !== 'todos') {
      resultado = resultado.filter(curso => 
        filtroAtivo === 'ativo' ? curso.ativo : !curso.ativo
      )
    }

    // Filtro por categoria
    if (filtroCategoria !== 'todas') {
      resultado = resultado.filter(curso => 
        curso.categoria && curso.categoria.toString() === filtroCategoria
      )
    }

    // Filtro por valor mínimo
    if (filtroValorMin && !isNaN(parseFloat(filtroValorMin))) {
      const valorMin = parseFloat(filtroValorMin)
      resultado = resultado.filter(curso => (curso.valor || 0) >= valorMin)
    }

    return resultado
  }, [cursos, termoBusca, filtroAtivo, filtroCategoria, filtroValorMin])

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

  const handleRemover = async (curso: Curso) => {
    setModalExclusao({
      aberto: true,
      curso
    })
  }

  const confirmarExclusao = async () => {
    if (!modalExclusao.curso) return

    setExcluindo(true)
    try {
      const resultado = await removerCurso(modalExclusao.curso.id)
      if (resultado.success) {
        notificarExcluido('Curso', modalExclusao.curso.nome)
        setModalExclusao({ aberto: false, curso: null })
      } else {
        notificarErroOperacao('excluir', 'curso', resultado.error)
      }
    } catch (error) {
      notificarErroOperacao('excluir', 'curso', 'Erro inesperado ocorreu')
    } finally {
      setExcluindo(false)
    }
  }

  const cancelarExclusao = () => {
    setModalExclusao({ aberto: false, curso: null })
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
        value={filtroCategoria}
        onChange={(e) => setFiltroCategoria(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todas">Todas as categorias</option>
        <option value="1">Básico</option>
        <option value="2">Médio</option>
        <option value="3">Avançado</option>
      </select>
      
      <input
        type="number"
        placeholder="Valor mínimo"
        value={filtroValorMin}
        onChange={(e) => setFiltroValorMin(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )

  return (
    <div className="space-y-4">
      <FiltroBusca
        placeholder="Buscar cursos por nome ou descrição..."
        onBuscar={setTermoBusca}
        filtrosAdicionais={filtrosAdicionais}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Lista de Cursos ({cursosFiltrados.length} de {cursos.length})
          </CardTitle>
          <Button onClick={carregarCursos} variant="outline" size="sm">
            🔄 Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          {cursosFiltrados.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {termoBusca || filtroAtivo !== 'todos' || filtroCategoria !== 'todas' || filtroValorMin
                ? 'Nenhum curso encontrado com os filtros aplicados' 
                : 'Nenhum curso encontrado'
              }
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cursosFiltrados.map((curso) => (
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
                      <p>💰 Valor: R$ {curso.valor ? curso.valor.toFixed(2) : '0.00'}</p>
                      <p>⏱️ Carga Horária: {curso.cargaHoraria || 0}h</p>
                      <p>📂 Categoria: {getCategoriaLabel(curso.categoria)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Badge variant={curso.ativo ? 'default' : 'secondary'}>
                        {curso.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <div className="flex gap-1 flex-wrap">
                        {onEditarCurso && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEditarCurso(curso)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            ✏️
                          </Button>
                        )}
                        {onVincularCurso && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onVincularCurso(curso)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            🔗
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemover(curso)}
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
        mensagem={`Tem certeza que deseja excluir o curso "${modalExclusao.curso?.nome}"? Esta ação não pode ser desfeita.`}
        textoConfirmacao="Excluir Curso"
        textoCancelamento="Cancelar"
        tipo="perigo"
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
        carregando={excluindo}
      />
    </div>
  )
} 