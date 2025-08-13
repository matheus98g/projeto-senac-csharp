'use client'

import { useState, useEffect } from 'react'
import { apiClient, Aluno } from '@/lib/api-client'

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarAlunos = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const dados = await apiClient.obterTodosAlunos()
      setAlunos(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }

  const adicionarAluno = async (novoAluno: Omit<Aluno, 'id'>) => {
    try {
      await apiClient.cadastrarAluno(novoAluno)
      await carregarAlunos() // Recarregar lista
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao adicionar aluno' 
      }
    }
  }

  const atualizarAluno = async (id: number, dados: Partial<Aluno>) => {
    try {
      await apiClient.atualizarAluno(id, dados)
      await carregarAlunos() // Recarregar lista
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao atualizar aluno' 
      }
    }
  }

  const removerAluno = async (id: number) => {
    try {
      await apiClient.deletarAluno(id)
      await carregarAlunos() // Recarregar lista
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao remover aluno' 
      }
    }
  }

  useEffect(() => {
    carregarAlunos()
  }, [])

  return {
    alunos,
    loading,
    error,
    carregarAlunos,
    adicionarAluno,
    atualizarAluno,
    removerAluno
  }
}

export function useAluno(id: number) {
  const [aluno, setAluno] = useState<Aluno | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarAluno = async () => {
    if (!id) return

    setLoading(true)
    setError(null)
    
    try {
      const dados = await apiClient.obterAlunoPorId(id)
      setAluno(dados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar aluno')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarAluno()
  }, [id])

  return {
    aluno,
    loading,
    error,
    carregarAluno
  }
} 