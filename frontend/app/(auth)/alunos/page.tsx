'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ListaAlunos } from '@/components/lista-alunos'
import { FormularioAluno } from '@/components/formulario-aluno'
import { useAlunos } from '@/lib/hooks/use-alunos'
import { Aluno } from '@/lib/api-client'
import Link from 'next/link'

export default function AlunosPage() {
	const { adicionarAluno, atualizarAluno } = useAlunos()
	const [mostrarFormulario, setMostrarFormulario] = useState(false)
	const [alunoEdicao, setAlunoEdicao] = useState<Aluno | null>(null)

	const handleNovoAluno = () => {
		setAlunoEdicao(null)
		setMostrarFormulario(true)
	}

	const handleEditarAluno = (aluno: Aluno) => {
		setAlunoEdicao(aluno)
		setMostrarFormulario(true)
	}

	const handleFecharFormulario = () => {
		setMostrarFormulario(false)
		setAlunoEdicao(null)
	}

	const handleSubmitAluno = async (dados: Omit<Aluno, 'id'>) => {
		if (alunoEdicao) {
			return await atualizarAluno(alunoEdicao.id, dados)
		} else {
			return await adicionarAluno(dados)
		}
	}

	if (mostrarFormulario) {
		return (
			<main className='min-h-svh w-full p-6 bg-background'>
				<div className="max-w-7xl mx-auto space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl font-bold">
								← Voltar para Lista de Alunos
							</CardTitle>
						</CardHeader>
					</Card>
					<FormularioAluno
						aluno={alunoEdicao}
						onSubmit={handleSubmitAluno}
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
								🎓 Gerenciamento de Alunos
							</CardTitle>
							<p className="text-muted-foreground">
								Visualize, adicione e gerencie alunos do sistema
							</p>
						</div>
						<div className="flex gap-2">
							<Button onClick={handleNovoAluno}>
								➕ Novo Aluno
							</Button>
							<Link href="/dashboard">
								<Button variant="outline">
									← Voltar ao Dashboard
								</Button>
							</Link>
						</div>
					</CardHeader>
				</Card>

				{/* Lista de Alunos */}
				<ListaAlunos onEditarAluno={handleEditarAluno} />

				
			</div>
		</main>
	)
} 