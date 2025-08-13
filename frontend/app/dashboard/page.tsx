'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ListaAlunos } from '@/components/lista-alunos'
import { ListaCursos } from '@/components/lista-cursos'
import { ListaProfessores } from '@/components/lista-professores'
import { useState } from 'react'
import { useAlunos } from '@/lib/hooks/use-alunos'
import { useCursos } from '@/lib/hooks/use-cursos'
import { useProfessores } from '@/lib/hooks/use-professores'

type TabType = 'resumo' | 'alunos' | 'cursos' | 'professores'

export default function DashboardPage() {
	const [activeTab, setActiveTab] = useState<TabType>('resumo')
	
	// Hooks para obter estatísticas
	const { alunos } = useAlunos()
	const { cursos } = useCursos()
	const { professores } = useProfessores()

	const renderContent = () => {
		switch (activeTab) {
			case 'alunos':
				return <ListaAlunos />
			case 'cursos':
				return <ListaCursos />
			case 'professores':
				return <ListaProfessores />
			default:
				return (
					<div className="space-y-6">
						{/* Estatísticas */}
						<div className="grid gap-6 md:grid-cols-3">
							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
									<span className="text-2xl">🎓</span>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{alunos.length}</div>
									<p className="text-xs text-muted-foreground">
										{alunos.filter(a => a.ativo).length} ativos
									</p>
								</CardContent>
							</Card>

							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
									<span className="text-2xl">📚</span>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{cursos.length}</div>
									<p className="text-xs text-muted-foreground">
										Cursos disponíveis
									</p>
								</CardContent>
							</Card>

							<Card className="hover:shadow-md transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total de Professores</CardTitle>
									<span className="text-2xl">👨‍🏫</span>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{professores.length}</div>
									<p className="text-xs text-muted-foreground">
										Professores cadastrados
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Ações Rápidas */}
						<Card>
							<CardHeader>
								<CardTitle>Ações Rápidas</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-3">
									<Button 
										onClick={() => setActiveTab('alunos')}
										className="h-16 flex-col gap-2"
									>
										<span className="text-xl">🎓</span>
										<span>Gerenciar Alunos</span>
									</Button>
									<Button 
										onClick={() => setActiveTab('cursos')}
										variant="outline"
										className="h-16 flex-col gap-2"
									>
										<span className="text-xl">📚</span>
										<span>Gerenciar Cursos</span>
									</Button>
									<Button 
										onClick={() => setActiveTab('professores')}
										variant="outline"
										className="h-16 flex-col gap-2"
									>
										<span className="text-xl">👨‍🏫</span>
										<span>Gerenciar Professores</span>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Status da API */}
						<Card>
							<CardHeader>
								<CardTitle>Status da Conexão</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
									<span className="text-sm">Conectado à API: http://localhost:5007</span>
								</div>
								<p className="text-xs text-muted-foreground mt-2">
									Certifique-se de que sua API C# está rodando na porta 5007
								</p>
							</CardContent>
						</Card>
					</div>
				)
		}
	}

	return (
		<main className='min-h-svh w-full p-6 bg-background'>
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Header */}
				<Card>
					<CardHeader>
						<CardTitle className="text-3xl font-bold">
							Portal Educa 🎓
						</CardTitle>
						<p className="text-muted-foreground">
							Sistema de Gestão Educacional - Dashboard Principal
						</p>
					</CardHeader>
				</Card>

				{/* Navegação */}
				<Card>
					<CardContent className="p-4">
						<div className="flex flex-wrap gap-2">
							{[
								{ id: 'resumo', label: '📊 Resumo', icon: '📊' },
								{ id: 'alunos', label: '🎓 Alunos', icon: '🎓' },
								{ id: 'cursos', label: '📚 Cursos', icon: '📚' },
								{ id: 'professores', label: '👨‍🏫 Professores', icon: '👨‍🏫' }
							].map((tab) => (
								<Button
									key={tab.id}
									variant={activeTab === tab.id ? 'default' : 'outline'}
									size="sm"
									onClick={() => setActiveTab(tab.id as TabType)}
									className="flex items-center gap-2"
								>
									<span>{tab.icon}</span>
									<span>{tab.label.split(' ')[1]}</span>
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Conteúdo */}
				{renderContent()}
			</div>
		</main>
	)
}
