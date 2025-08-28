'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export interface ModalConfirmacaoProps {
  aberto: boolean
  titulo: string
  mensagem: string
  textoConfirmacao?: string
  textoCancelamento?: string
  tipo?: 'perigo' | 'aviso' | 'info'
  onConfirmar: () => void
  onCancelar: () => void
  carregando?: boolean
}

export function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmacao = 'Confirmar',
  textoCancelamento = 'Cancelar',
  tipo = 'perigo',
  onConfirmar,
  onCancelar,
  carregando = false
}: ModalConfirmacaoProps) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    if (aberto) {
      setVisivel(true)
    } else {
      setVisivel(false)
    }
  }, [aberto])

  const handleConfirmar = () => {
    onConfirmar()
  }

  const handleCancelar = () => {
    setVisivel(false)
    setTimeout(() => onCancelar(), 200)
  }

  const obterEstilosTipo = () => {
    switch (tipo) {
      case 'perigo':
        return {
          botaoConfirmar: 'bg-red-600 hover:bg-red-700 text-white',
          icone: '🔴',
          corBorda: 'border-red-200'
        }
      case 'aviso':
        return {
          botaoConfirmar: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          icone: '⚠️',
          corBorda: 'border-yellow-200'
        }
      case 'info':
        return {
          botaoConfirmar: 'bg-blue-600 hover:bg-blue-700 text-white',
          icone: 'ℹ️',
          corBorda: 'border-blue-200'
        }
      default:
        return {
          botaoConfirmar: 'bg-red-600 hover:bg-red-700 text-white',
          icone: '🔴',
          corBorda: 'border-red-200'
        }
    }
  }

  const estilos = obterEstilosTipo()

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancelar}
      />
      
      {/* Modal */}
      <div className={`
        relative transform transition-all duration-200 ease-in-out
        ${visivel ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <Card className={`w-full max-w-md shadow-2xl ${estilos.corBorda}`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <span className="text-3xl">{estilos.icone}</span>
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {titulo}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center pb-6">
            <p className="text-gray-600 leading-relaxed">
              {mensagem}
            </p>
          </CardContent>
          
          <CardFooter className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleCancelar}
              disabled={carregando}
              className="flex-1"
            >
              {textoCancelamento}
            </Button>
            
            <Button
              onClick={handleConfirmar}
              disabled={carregando}
              className={`flex-1 ${estilos.botaoConfirmar}`}
            >
              {carregando ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </div>
              ) : (
                textoConfirmacao
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
