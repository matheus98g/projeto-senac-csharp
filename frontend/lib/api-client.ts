// Cliente para consumir API local em C#

const API_BASE_URL = 'http://localhost:5007' // Porta da sua API C#

export interface Aluno {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  email: string
  dataDeNascimento: string
  dataMatricula: string
  ativo: boolean
}

export interface Curso {
  id: number
  nome: string
  descricao: string
  valor: number
  dataCriacao?: string
  professorId?: number
  cargaHoraria: number
  categoria: CategoriaCurso
  ativo: boolean
}

export interface Professor {
  id: number
  nome: string
  sobrenome: string
  telefone: string
  email: string
  dataDeNascimento?: string
  dataContratacao?: string
  formacao: FormacaoProfessor
  ativo: boolean
}

export enum FormacaoProfessor {
  EnsinoMedio = 1,
  EnsinoTecnico = 2,
  Graduado = 3,
  PosGraduado = 4,
  Mestrado = 5,
  Doutorado = 6
}

export enum CategoriaCurso {
  Basico = 1,
  Medio = 2,
  Avancado = 3
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
    const dados = await this.request<any[]>('/aluno')
    // Mapear os dados do backend para o formato do frontend
    return dados.map(aluno => ({
      id: aluno.id,
      nome: aluno.nome || aluno.Nome || '',
      sobrenome: aluno.sobrenome || aluno.Sobrenome || '',
      telefone: aluno.telefone || aluno.Telefone || '',
      email: aluno.email || aluno.Email || '',
      dataDeNascimento: aluno.dataDeNascimento || aluno.DataDeNascimento,
      dataMatricula: aluno.dataMatricula || aluno.DataMatricula,
      ativo: (aluno.ativo || aluno.Ativo) ?? true
    }))
  }

  async obterAlunoPorId(id: number): Promise<Aluno> {
    const dados = await this.request<any>(`/aluno/${id}`)
    // Mapear os dados do backend para o formato do frontend
    return {
      id: dados.id,
      nome: dados.nome || dados.Nome || '',
      sobrenome: dados.sobrenome || dados.Sobrenome || '',
      telefone: dados.telefone || dados.Telefone || '',
      email: dados.email || dados.Email || '',
      dataDeNascimento: dados.dataDeNascimento || dados.DataDeNascimento,
      dataMatricula: dados.dataMatricula || dados.DataMatricula,
      ativo: (dados.ativo || dados.Ativo) ?? true
    }
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
    const dados = await this.request<any[]>('/curso')
    // Mapear os dados do backend para o formato do frontend
    return dados.map(curso => ({
      id: curso.id,
      nome: curso.nome || curso.Nome || '',
      descricao: curso.descricao || curso.Descricao || '',
      valor: curso.valor || curso.Valor || 0,
      dataCriacao: curso.dataCriacao || curso.DataCriacao,
      professorId: curso.professorId || curso.ProfessorId,
      cargaHoraria: curso.cargaHoraria || curso.CargaHoraria || 0,
      categoria: curso.categoria || curso.Categoria || 1,
      ativo: (curso.ativo || curso.Ativo) ?? true
    }))
  }

  async obterCursoPorId(id: number): Promise<Curso> {
    const dados = await this.request<any>(`/curso/${id}`)
    // Mapear os dados do backend para o formato do frontend
    return {
      id: dados.id,
      nome: dados.nome || dados.Nome || '',
      descricao: dados.descricao || dados.Descricao || '',
      valor: dados.valor || dados.Valor || 0,
      dataCriacao: dados.dataCriacao || dados.DataCriacao,
      professorId: dados.professorId || dados.ProfessorId,
      cargaHoraria: dados.cargaHoraria || dados.CargaHoraria || 0,
      categoria: dados.categoria || dados.Categoria || 1,
      ativo: (dados.ativo || dados.Ativo) ?? true
    }
  }

  async cadastrarCurso(dados: Omit<Curso, 'id'>): Promise<any> {
    // Mapear as propriedades do frontend para o formato esperado pelo backend
    const dadosFormatados = {
      Nome: dados.nome,
      Descricao: dados.descricao,
      Valor: dados.valor,
      DataCriacao: dados.dataCriacao,
      Categoria: dados.categoria, // Manter como número (enum)
      CargaHoraria: dados.cargaHoraria,
      Ativo: dados.ativo,
      ...(dados.professorId && { ProfessorId: dados.professorId }) // Incluir apenas se existir
    }
    
    console.log('📤 Enviando dados do curso:', dadosFormatados)
    
    return this.request('/curso', {
      method: 'POST',
      body: JSON.stringify(dadosFormatados)
    })
  }

  async atualizarCurso(id: number, dados: Partial<Curso>): Promise<void> {
    // Mapear as propriedades do frontend para o formato esperado pelo backend
    const dadosFormatados: any = {}
    
    if (dados.nome !== undefined) dadosFormatados.Nome = dados.nome
    if (dados.descricao !== undefined) dadosFormatados.Descricao = dados.descricao
    if (dados.valor !== undefined) dadosFormatados.Valor = dados.valor
    if (dados.categoria !== undefined) dadosFormatados.Categoria = dados.categoria
    if (dados.cargaHoraria !== undefined) dadosFormatados.CargaHoraria = dados.cargaHoraria
    if (dados.ativo !== undefined) dadosFormatados.Ativo = dados.ativo
    if (dados.professorId !== undefined) {
      dadosFormatados.ProfessorId = dados.professorId
    } else if ('professorId' in dados) {
      // Se professorId foi explicitamente definido como undefined, enviar null
      dadosFormatados.ProfessorId = null
    }
    
    return this.request(`/curso/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dadosFormatados)
    })
  }

  async deletarCurso(id: number): Promise<void> {
    return this.request(`/curso/${id}`, {
      method: 'DELETE'
    })
  }

  // ========== PROFESSORES ==========
  async obterTodosProfessores(): Promise<Professor[]> {
    const dados = await this.request<any[]>('/professor')
    // Mapear os dados do backend para o formato do frontend
    return dados.map(professor => ({
      id: professor.id,
      nome: professor.nome || professor.Nome || '',
      sobrenome: professor.sobrenome || professor.Sobrenome || '',
      telefone: professor.telefone || professor.Telefone || '',
      email: professor.email || professor.Email || '',
      dataDeNascimento: professor.dataDeNascimento || professor.DataDeNascimento,
      dataContratacao: professor.dataContratacao || professor.DataContratacao,
      formacao: professor.formacao || professor.Formacao || 1,
      ativo: (professor.ativo || professor.Ativo) ?? true
    }))
  }

  async obterProfessorPorId(id: number): Promise<Professor> {
    const dados = await this.request<any>(`/professor/${id}`)
    // Mapear os dados do backend para o formato do frontend
    return {
      id: dados.id,
      nome: dados.nome || dados.Nome || '',
      sobrenome: dados.sobrenome || dados.Sobrenome || '',
      telefone: dados.telefone || dados.Telefone || '',
      email: dados.email || dados.Email || '',
      dataDeNascimento: dados.dataDeNascimento || dados.DataDeNascimento,
      dataContratacao: dados.dataContratacao || dados.DataContratacao,
      formacao: dados.formacao || dados.Formacao || 1,
      ativo: (dados.ativo || dados.Ativo) ?? true
    }
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