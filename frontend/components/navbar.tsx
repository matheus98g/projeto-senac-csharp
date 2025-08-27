'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navbar() {
	const pathname = usePathname()
	const router = useRouter()
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const navigationItems = [
		{
			href: '/dashboard',
			label: 'Dashboard',
			icon: '📊'
		},
		{
			href: '/alunos',
			label: 'Alunos',
			icon: '👨‍🎓'
		},
		{
			href: '/cursos',
			label: 'Cursos',
			icon: '📚'
		},
		{
			href: '/professores',
			label: 'Professores',
			icon: '👨‍🏫'
		}
	]

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen)
	}

	const handleLogout = () => {
		// Aqui você pode adicionar lógica de logout (limpar tokens, etc.)
		router.push('/login')
	}

	return (
		<nav className="bg-white shadow-lg border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo e Nome da Aplicação */}
					<div className="flex items-center">
						<Link href="/dashboard" className="flex items-center space-x-2">
							<span className="text-2xl">🎓</span>
							<span className="text-xl font-bold text-gray-900">Portal Educa</span>
						</Link>
					</div>

					{/* Menu Desktop */}
					<div className="hidden md:flex items-center space-x-4">
						{navigationItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
									pathname === item.href
										? 'bg-blue-100 text-blue-700 border border-blue-200'
										: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
								}`}
							>
								<span className="mr-2">{item.icon}</span>
								{item.label}
							</Link>
						))}
					</div>

					{/* Botões de Ação Desktop */}
					<div className="hidden md:flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleLogout}
							className="text-gray-700 hover:bg-gray-100"
						>
							<span className="mr-2">🚪</span>
							Sair
						</Button>
					</div>

					{/* Botão Mobile Menu */}
					<div className="md:hidden flex items-center">
						<Button
							variant="ghost"
							size="sm"
							onClick={toggleMobileMenu}
							className="text-gray-700 hover:bg-gray-100"
						>
							<span className="sr-only">Abrir menu principal</span>
							{isMobileMenuOpen ? (
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</Button>
					</div>
				</div>

				{/* Menu Mobile */}
				{isMobileMenuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
							{navigationItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
										pathname === item.href
											? 'bg-blue-100 text-blue-700 border border-blue-200'
											: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
									}`}
								>
									<span className="mr-2">{item.icon}</span>
									{item.label}
								</Link>
							))}
							<div className="pt-2 border-t border-gray-200">
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										handleLogout()
										setIsMobileMenuOpen(false)
									}}
									className="w-full text-gray-700 hover:bg-gray-100"
								>
									<span className="mr-2">🚪</span>
									Sair
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	)
}
