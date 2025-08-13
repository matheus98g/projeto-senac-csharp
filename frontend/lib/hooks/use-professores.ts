'use client'

import { useState, useEffect } from 'react'
import { apiClient, Professor } from '@/lib/api-client'

export function useProfessores() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarProfessores = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const dados = await apiClient.obterTodosProfessores()
      setProfessores(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar professores')
    } finally {
      setLoading(false)
    }
  }

  const adicionarProfessor = async (novoProfessor: Omit<Professor, 'id'>) => {
    try {
      await apiClient.cadastrarProfessor(novoProfessor)
      await carregarProfessores()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao adicionar professor' 
      }
    }
  }

  const atualizarProfessor = async (id: number, dados: Partial<Professor>) => {
    try {
      await apiClient.atualizarProfessor(id, dados)
      await carregarProfessores()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao atualizar professor' 
      }
    }
  }

  const removerProfessor = async (id: number) => {
    try {
      await apiClient.deletarProfessor(id)
      await carregarProfessores()
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao remover professor' 
      }
    }
  }

  useEffect(() => {
    carregarProfessores()
  }, [])

  return {
    professores,
    loading,
    error,
    carregarProfessores,
    adicionarProfessor,
    atualizarProfessor,
    removerProfessor
  }
}

export function useProfessor(id: number) {
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarProfessor = async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    
    try {
      const dados = await apiClient.obterProfessorPorId(id)
      setProfessor(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar professor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarProfessor()
  }, [id])

  return {
    professor,
    loading,
    error,
    carregarProfessor
  }
} 