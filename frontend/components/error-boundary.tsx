'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              ⚠️ Ops! Algo deu errado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-red-700">
                Ocorreu um erro inesperado. Isso pode acontecer quando:
              </p>
              <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
                <li>A API não está respondendo corretamente</li>
                <li>Os dados recebidos estão em formato inesperado</li>
                <li>Há problemas de conectividade</li>
              </ul>
              
              {this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-red-800">
                    Detalhes técnicos
                  </summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto text-red-900">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  🔄 Recarregar Página
                </Button>
                <Button
                  onClick={() => this.setState({ hasError: false })}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  🔁 Tentar Novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// Componente funcional para usar em hooks
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
