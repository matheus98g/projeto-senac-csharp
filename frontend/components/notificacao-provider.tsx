'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export interface NotificacaoProps {
  tipo: 'sucesso' | 'erro' | 'info' | 'aviso'
  titulo: string
  mensagem: string
  duracao?: number
  onClose?: () => void
}

interface NotificacaoContextProps {
  notificacoes: (NotificacaoProps & { id: string })[]
  adicionarNotificacao: (notificacao: Omit<NotificacaoProps, 'id'>) => void
  removerNotificacao: (id: string) => void
  notificarSucesso: (titulo: string, mensagem?: string) => void
  notificarErro: (titulo: string, mensagem?: string) => void
  notificarInfo: (titulo: string, mensagem?: string) => void
  notificarAviso: (titulo: string, mensagem?: string) => void
  notificarCriado: (entidade: string, nome?: string) => void
  notificarEditado: (entidade: string, nome?: string) => void
  notificarExcluido: (entidade: string, nome?: string) => void
  notificarErroOperacao: (operacao: string, entidade: string, erro?: string) => void
}

const NotificacaoContext = createContext<NotificacaoContextProps | undefined>(undefined)

export function useNotificacao() {
  const context = useContext(NotificacaoContext)
  if (!context) {
    throw new Error('useNotificacao deve ser usado dentro de um NotificacaoProvider')
  }
  return context
}

interface NotificacaoProviderProps {
  children: ReactNode
}

// Componente individual de notificação
function ItemNotificacao({ notificacao, onRemover }: { 
  notificacao: NotificacaoProps & { id: string }
  onRemover: (id: string) => void 
}) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    setVisivel(true)
  }, [])

  const handleRemover = () => {
    setVisivel(false)
    setTimeout(() => onRemover(notificacao.id), 300)
  }

  const obterEstilos = () => {
    switch (notificacao.tipo) {
      case 'sucesso':
        return {
          container: 'bg-green-50 border-green-200 text-green-800 shadow-green-100',
          icone: <CheckCircle className="w-5 h-5 text-green-600" />,
          botaoFechar: 'hover:bg-green-100 text-green-600'
        }
      case 'erro':
        return {
          container: 'bg-red-50 border-red-200 text-red-800 shadow-red-100',
          icone: <XCircle className="w-5 h-5 text-red-600" />,
          botaoFechar: 'hover:bg-red-100 text-red-600'
        }
      case 'aviso':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-yellow-100',
          icone: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          botaoFechar: 'hover:bg-yellow-100 text-yellow-600'
        }
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100',
          icone: <Info className="w-5 h-5 text-blue-600" />,
          botaoFechar: 'hover:bg-blue-100 text-blue-600'
        }
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800 shadow-gray-100',
          icone: <Info className="w-5 h-5 text-gray-600" />,
          botaoFechar: 'hover:bg-gray-100 text-gray-600'
        }
    }
  }

  const estilos = obterEstilos()

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${visivel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${estilos.container}
      p-4 rounded-lg border shadow-lg mb-3 max-w-sm w-full backdrop-blur-sm
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5">{estilos.icone}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notificacao.titulo}</h4>
            {notificacao.mensagem && (
              <p className="text-sm mt-1 opacity-90 leading-relaxed">{notificacao.mensagem}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemover}
          className={`h-6 w-6 p-0 ${estilos.botaoFechar} transition-colors`}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// Container de notificações
function ContainerNotificacoes({ notificacoes, onRemover }: {
  notificacoes: (NotificacaoProps & { id: string })[]
  onRemover: (id: string) => void
}) {
  if (notificacoes.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notificacoes.map(notificacao => (
        <ItemNotificacao
          key={notificacao.id}
          notificacao={notificacao}
          onRemover={onRemover}
        />
      ))}
    </div>
  )
}

export function NotificacaoProvider({ children }: NotificacaoProviderProps) {
  const [notificacoes, setNotificacoes] = useState<(NotificacaoProps & { id: string })[]>([])

  const adicionarNotificacao = (notificacao: Omit<NotificacaoProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const novaNotificacao = { ...notificacao, id }
    
    setNotificacoes(prev => [...prev, novaNotificacao])

    // Auto remover após duracao
    const duracao = notificacao.duracao || 5000
    setTimeout(() => {
      removerNotificacao(id)
    }, duracao)
  }

  const removerNotificacao = (id: string) => {
    setNotificacoes(prev => prev.filter(n => n.id !== id))
  }

  const notificarSucesso = (titulo: string, mensagem: string = '') => {
    adicionarNotificacao({ tipo: 'sucesso', titulo, mensagem })
  }

  const notificarErro = (titulo: string, mensagem: string = '') => {
    adicionarNotificacao({ tipo: 'erro', titulo, mensagem })
  }

  const notificarInfo = (titulo: string, mensagem: string = '') => {
    adicionarNotificacao({ tipo: 'info', titulo, mensagem })
  }

  const notificarAviso = (titulo: string, mensagem: string = '') => {
    adicionarNotificacao({ tipo: 'aviso', titulo, mensagem })
  }

  // Métodos específicos para operações CRUD
  const notificarCriado = (entidade: string, nome?: string) => {
    const mensagem = nome ? `${entidade} "${nome}" criado com sucesso!` : `${entidade} criado com sucesso!`
    notificarSucesso('Criado com sucesso', mensagem)
  }

  const notificarEditado = (entidade: string, nome?: string) => {
    const mensagem = nome ? `${entidade} "${nome}" atualizado com sucesso!` : `${entidade} atualizado com sucesso!`
    notificarSucesso('Atualizado com sucesso', mensagem)
  }

  const notificarExcluido = (entidade: string, nome?: string) => {
    const mensagem = nome ? `${entidade} "${nome}" excluído com sucesso!` : `${entidade} excluído com sucesso!`
    notificarSucesso('Excluído com sucesso', mensagem)
  }

  const notificarErroOperacao = (operacao: string, entidade: string, erro?: string) => {
    const mensagem = erro || `Erro ao ${operacao} ${entidade.toLowerCase()}. Tente novamente.`
    notificarErro(`Erro ao ${operacao}`, mensagem)
  }

  const value: NotificacaoContextProps = {
    notificacoes,
    adicionarNotificacao,
    removerNotificacao,
    notificarSucesso,
    notificarErro,
    notificarInfo,
    notificarAviso,
    notificarCriado,
    notificarEditado,
    notificarExcluido,
    notificarErroOperacao
  }

  return (
    <NotificacaoContext.Provider value={value}>
      {children}
      <ContainerNotificacoes 
        notificacoes={notificacoes} 
        onRemover={removerNotificacao} 
      />
    </NotificacaoContext.Provider>
  )
}
