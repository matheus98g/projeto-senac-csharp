'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumb() {
	const pathname = usePathname()
	
	// Mapeia os caminhos para nomes amigáveis
	const pathMap: Record<string, string> = {
		'dashboard': 'Dashboard',
		'alunos': 'Alunos',
		'cursos': 'Cursos',
		'professores': 'Professores'
	}

	// Gera os breadcrumbs baseado no pathname
	const generateBreadcrumbs = () => {
		const paths = pathname.split('/').filter(Boolean)
		const breadcrumbs = []

		// Sempre começa com Dashboard
		breadcrumbs.push({
			href: '/dashboard',
			label: 'Dashboard',
			isActive: pathname === '/dashboard'
		})

		// Adiciona outras páginas se não for dashboard
		if (paths.length > 1) {
			const currentPage = paths[1]
			if (pathMap[currentPage]) {
				breadcrumbs.push({
					href: `/${currentPage}`,
					label: pathMap[currentPage],
					isActive: true
				})
			}
		}

		return breadcrumbs
	}

	const breadcrumbs = generateBreadcrumbs()

	if (breadcrumbs.length <= 1) {
		return null
	}

	return (
		<nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 px-4 sm:px-6 lg:px-8">
			{breadcrumbs.map((breadcrumb, index) => (
				<div key={breadcrumb.href} className="flex items-center">
					{index > 0 && (
						<svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
						</svg>
					)}
					{breadcrumb.isActive ? (
						<span className="text-gray-900 font-medium">{breadcrumb.label}</span>
					) : (
						<Link
							href={breadcrumb.href}
							className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
						>
							{breadcrumb.label}
						</Link>
					)}
				</div>
			))}
		</nav>
	)
}
