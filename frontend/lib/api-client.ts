// Cliente para consumir API local em C#

const API_BASE_URL = 'http://localhost:5007' // Porta da sua API C#

export interface Aluno {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  email: string
  dataNasc?: string
  matricula?: string
  ativo: boolean
}

export interface Curso {
  id: number
  nome: string
  descricao?: string
  valor: number
  dataCriacao?: string
  ProfessorId?: number
  CargaHoraria?: number
  categoria?: string
  ativo: boolean
  // Adicione outros campos conforme seu modelo C#
}

export interface Professor {
  id: number
  nome: string
  email: string
  telefone?: string
  especialidade?: string
  dataNascimento?: string
  // Adicione outros campos conforme seu modelo C#
}

export interface ErroResponse {
  mensagem: string
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log(`🔄 Fazendo requisição para: ${url}`)
      
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMessage = errorData?.mensagem || `Erro ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log(`✅ Resposta recebida:`, data)
      return data
    } catch (error) {
      console.error(`❌ Erro na requisição para ${url}:`, error)
      throw error
    }
  }

  // ========== ALUNOS ==========
  async obterTodosAlunos(): Promise<Aluno[]> {
    return this.request<Aluno[]>('/aluno')
  }

  async obterAlunoPorId(id: number): Promise<Aluno> {
    return this.request<Aluno>(`/aluno/${id}`)
  }

  async cadastrarAluno(dados: Omit<Aluno, 'id'>): Promise<any> {
    return this.request('/aluno', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  async atualizarAluno(id: number, dados: Partial<Aluno>): Promise<void> {
    return this.request(`/aluno/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
  }

  async deletarAluno(id: number): Promise<void> {
    return this.request(`/aluno/${id}`, {
      method: 'DELETE'
    })
  }

  // ========== CURSOS ==========
  async obterTodosCursos(): Promise<Curso[]> {
    return this.request<Curso[]>('/curso')
  }

  async obterCursoPorId(id: number): Promise<Curso> {
    return this.request<Curso>(`/curso/${id}`)
  }

  async cadastrarCurso(dados: Omit<Curso, 'id'>): Promise<any> {
    return this.request('/curso', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  async atualizarCurso(id: number, dados: Partial<Curso>): Promise<void> {
    return this.request(`/curso/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
  }

  async deletarCurso(id: number): Promise<void> {
    return this.request(`/curso/${id}`, {
      method: 'DELETE'
    })
  }

  // ========== PROFESSORES ==========
  async obterTodosProfessores(): Promise<Professor[]> {
    return this.request<Professor[]>('/professor')
  }

  async obterProfessorPorId(id: number): Promise<Professor> {
    return this.request<Professor>(`/professor/${id}`)
  }

  async cadastrarProfessor(dados: Omit<Professor, 'id'>): Promise<any> {
    return this.request('/professor', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  async atualizarProfessor(id: number, dados: Partial<Professor>): Promise<void> {
    return this.request(`/professor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
  }

  async deletarProfessor(id: number): Promise<void> {
    return this.request(`/professor/${id}`, {
      method: 'DELETE'
    })
  }
}

// Exportar instância única
export const apiClient = new ApiClient() 