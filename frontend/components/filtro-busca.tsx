'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FiltroBuscaProps {
  placeholder: string
  onBuscar: (termo: string) => void
  filtrosAdicionais?: React.ReactNode
  showCard?: boolean
}

export function FiltroBusca({ 
  placeholder, 
  onBuscar, 
  filtrosAdicionais, 
  showCard = true 
}: FiltroBuscaProps) {
  const [termoBusca, setTermoBusca] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBuscar(termoBusca)
  }

  const handleLimpar = () => {
    setTermoBusca('')
    onBuscar('')
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="busca" className="sr-only">
            Buscar
          </Label>
          <Input
            id="busca"
            type="text"
            placeholder={placeholder}
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
          />
        </div>
        <Button type="submit">
          🔍 Buscar
        </Button>
        <Button type="button" variant="outline" onClick={handleLimpar}>
          🗑️ Limpar
        </Button>
      </div>
      
      {filtrosAdicionais && (
        <div className="pt-2 border-t">
          {filtrosAdicionais}
        </div>
      )}
    </form>
  )

  if (!showCard) {
    return content
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Filtros e Busca</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  )
}
