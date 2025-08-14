'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ListaCursos } from '@/components/lista-cursos'
import Link from 'next/link'

export default function CursosPage() {
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
						<Link href="/dashboard">
							<Button variant="outline">
								← Voltar ao Dashboard
							</Button>
						</Link>
					</CardHeader>
				</Card>

				{/* Lista de Cursos */}
				<ListaCursos />

				{/* Ações Futuras */}
				<Card>
					<CardHeader>
						<CardTitle>Ações Disponíveis</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							<Button variant="outline" disabled>
								➕ Adicionar Novo Curso
							</Button>
							<Button variant="outline" disabled>
								📊 Relatórios de Cursos
							</Button>
							<Button variant="outline" disabled>
								👥 Gerenciar Matrículas
							</Button>
						</div>
						<p className="text-sm text-muted-foreground mt-4">
							* Funcionalidades em desenvolvimento
						</p>
					</CardContent>
				</Card>
			</div>
		</main>
	)
} 