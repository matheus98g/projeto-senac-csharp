'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ListaProfessores } from '@/components/lista-professores'
import { FormularioProfessor } from '@/components/formulario-professor'
import { useProfessores } from '@/lib/hooks/use-professores'
import { Professor } from '@/lib/api-client'
import Link from 'next/link'

export default function ProfessoresPage() {
	const { adicionarProfessor, atualizarProfessor } = useProfessores()
	const [mostrarFormulario, setMostrarFormulario] = useState(false)
	const [professorEdicao, setProfessorEdicao] = useState<Professor | null>(null)

	const handleNovoProfessor = () => {
		setProfessorEdicao(null)
		setMostrarFormulario(true)
	}

	const handleEditarProfessor = (professor: Professor) => {
		setProfessorEdicao(professor)
		setMostrarFormulario(true)
	}

	const handleFecharFormulario = () => {
		setMostrarFormulario(false)
		setProfessorEdicao(null)
	}

	const handleSubmitProfessor = async (dados: Omit<Professor, 'id'>) => {
		if (professorEdicao) {
			return await atualizarProfessor(professorEdicao.id, dados)
		} else {
			return await adicionarProfessor(dados)
		}
	}

	if (mostrarFormulario) {
		return (
			<main className='min-h-svh w-full p-6 bg-background'>
				<div className="max-w-7xl mx-auto space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl font-bold">
								← Voltar para Lista de Professores
							</CardTitle>
						</CardHeader>
					</Card>
					<FormularioProfessor
						professor={professorEdicao}
						onSubmit={handleSubmitProfessor}
						onCancel={handleFecharFormulario}
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
								👨‍🏫 Gerenciamento de Professores
							</CardTitle>
							<p className="text-muted-foreground">
								Visualize, adicione e gerencie professores do sistema
							</p>
						</div>
						<div className="flex gap-2">
							<Button onClick={handleNovoProfessor}>
								➕ Novo Professor
							</Button>
							<Link href="/dashboard">
								<Button variant="outline">
									← Voltar ao Dashboard
								</Button>
							</Link>
						</div>
					</CardHeader>
				</Card>

				{/* Lista de Professores */}
				<ListaProfessores onEditarProfessor={handleEditarProfessor} />

			</div>
		</main>
	)
} 