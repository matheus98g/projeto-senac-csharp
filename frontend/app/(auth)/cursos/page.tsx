'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ListaCursos } from '@/components/lista-cursos'
import { FormularioCurso } from '@/components/formulario-curso'
import { VinculacaoCurso } from '@/components/vinculacao-curso'
import { useCursos } from '@/lib/hooks/use-cursos'
import { Curso } from '@/lib/api-client'
import Link from 'next/link'

export default function CursosPage() {
	const { adicionarCurso, atualizarCurso } = useCursos()
	const [mostrarFormulario, setMostrarFormulario] = useState(false)
	const [mostrarVinculacao, setMostrarVinculacao] = useState(false)
	const [cursoEdicao, setCursoEdicao] = useState<Curso | null>(null)
	const [cursoVinculacao, setCursoVinculacao] = useState<Curso | null>(null)

	const handleNovoCurso = () => {
		setCursoEdicao(null)
		setMostrarFormulario(true)
	}

	const handleEditarCurso = (curso: Curso) => {
		setCursoEdicao(curso)
		setMostrarFormulario(true)
	}

	const handleVincularCurso = (curso: Curso) => {
		setCursoVinculacao(curso)
		setMostrarVinculacao(true)
	}

	const handleFecharFormulario = () => {
		setMostrarFormulario(false)
		setCursoEdicao(null)
	}

	const handleFecharVinculacao = () => {
		setMostrarVinculacao(false)
		setCursoVinculacao(null)
	}

	const handleSubmitCurso = async (dados: Omit<Curso, 'id'>) => {
		if (cursoEdicao) {
			return await atualizarCurso(cursoEdicao.id, dados)
		} else {
			return await adicionarCurso(dados)
		}
	}

	if (mostrarFormulario) {
		return (
			<main className='min-h-svh w-full p-6 bg-background'>
				<div className="max-w-7xl mx-auto space-y-6">
					<Card>
						<CardHeader>
							<CardTitle 
								className="text-2xl font-bold cursor-pointer hover:text-blue-600"
								onClick={handleFecharFormulario}
							>
								← Voltar para Lista de Cursos
							</CardTitle>
						</CardHeader>
					</Card>
					<FormularioCurso
						curso={cursoEdicao}
						onSubmit={handleSubmitCurso}
						onCancel={handleFecharFormulario}
					/>
				</div>
			</main>
		)
	}

	if (mostrarVinculacao && cursoVinculacao) {
		return (
			<main className='min-h-svh w-full p-6 bg-background'>
				<div className="max-w-7xl mx-auto space-y-6">
					<Card>
						<CardHeader>
							<CardTitle 
								className="text-2xl font-bold cursor-pointer hover:text-blue-600"
								onClick={handleFecharVinculacao}
							>
								← Voltar para Lista de Cursos
							</CardTitle>
						</CardHeader>
					</Card>
					<VinculacaoCurso
						curso={cursoVinculacao}
						onClose={handleFecharVinculacao}
					/>
				</div>
			</main>
		)
	}

	return (
		<main className='min-h-svh w-full p-6 bg-background'>
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="text-3xl font-bold">
								📚 Gerenciamento de Cursos
							</CardTitle>
							<p className="text-muted-foreground">
								Visualize, adicione e gerencie cursos do sistema
							</p>
						</div>
						<div className="flex gap-2">
							<Button onClick={handleNovoCurso}>
								➕ Novo Curso
							</Button>
							<Link href="/dashboard">
								<Button variant="outline">
									← Voltar ao Dashboard
								</Button>
							</Link>
						</div>
					</CardHeader>
				</Card>

				{/* Lista de Cursos */}
				<ListaCursos 
					onEditarCurso={handleEditarCurso} 
					onVincularCurso={handleVincularCurso}
				/>
			</div>
		</main>
	)
} 