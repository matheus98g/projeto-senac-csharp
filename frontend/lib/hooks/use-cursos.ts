'use client'

import { useState, useEffect } from 'react'
import { apiClient, Curso } from '@/lib/api-client'

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarCursos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const dados = await apiClient.obterTodosCursos()
      setCursos(dados)
    } catch (err) {
      console.error('Erro ao carregar cursos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }

  const adicionarCurso = async (novoCurso: Omit<Curso, 'id'>) => {
    try {
      await apiClient.cadastrarCurso(novoCurso)
      await carregarCursos()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao adicionar curso' 
      }
    }
  }

  const atualizarCurso = async (id: number, dados: Partial<Curso>) => {
    try {
      await apiClient.atualizarCurso(id, dados)
      await carregarCursos()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao atualizar curso' 
      }
    }
  }

  const removerCurso = async (id: number) => {
    try {
      await apiClient.deletarCurso(id)
      // Atualizar a lista local removendo o curso excluído
      setCursos(prevCursos => prevCursos.filter(curso => curso.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Erro ao remover curso:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao remover curso' 
      }
    }
  }

  useEffect(() => {
    carregarCursos()
  }, [])

  return {
    cursos,
    loading,
    error,
    carregarCursos,
    adicionarCurso,
    atualizarCurso,
    removerCurso
  }
}

export function useCurso(id: number) {
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarCurso = async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    
    try {
      const dados = await apiClient.obterCursoPorId(id)
      setCurso(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar curso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarCurso()
  }, [id])

  return {
    curso,
    loading,
    error,
    carregarCurso
  }
} 