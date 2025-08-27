'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export interface NotificacaoProps {
  tipo: 'sucesso' | 'erro' | 'info' | 'aviso'
  titulo: string
  mensagem: string
  duracao?: number
  onClose?: () => void
}

interface NotificacaoContextProps {
  notificacoes: NotificacaoProps[]
  adicionarNotificacao: (notificacao: Omit<NotificacaoProps, 'id'>) => void
  removerNotificacao: (id: string) => void
}

// Hook para usar notificações
export function useNotificacao() {
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

  return {
    notificacoes,
    adicionarNotificacao,
    removerNotificacao,
    notificarSucesso,
    notificarErro,
    notificarInfo,
    notificarAviso
  }
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
        return 'bg-green-50 border-green-200 text-green-800'
      case 'erro':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'aviso':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const obterIcone = () => {
    switch (notificacao.tipo) {
      case 'sucesso':
        return '✅'
      case 'erro':
        return '❌'
      case 'aviso':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📝'
    }
  }

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${visivel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${obterEstilos()}
      p-4 rounded-lg border shadow-lg mb-2 max-w-sm w-full
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-lg">{obterIcone()}</span>
          <div className="flex-1">
            <h4 className="font-semibold">{notificacao.titulo}</h4>
            {notificacao.mensagem && (
              <p className="text-sm mt-1 opacity-90">{notificacao.mensagem}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemover}
          className="h-6 w-6 p-0 hover:bg-black/10"
        >
          ✕
        </Button>
      </div>
    </div>
  )
}

// Container de notificações
export function ContainerNotificacoes({ notificacoes, onRemover }: {
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
