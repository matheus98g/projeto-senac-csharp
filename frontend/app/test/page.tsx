import { Button } from "@/components/ui/button"
import Link from "next/link"

    /**
 * Página básica de teste
 * 
 * Esta página serve como exemplo inicial para estruturação de rotas no Next.js.
 * 
 * @returns JSX.Element
 */
function TestPage () {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-8'>
			<h1 className='text-3xl font-bold mb-4'>
				Página de Teste
			</h1>
            <Link href="/">
                <Button>
                    Voltar
                </Button>
            </Link>
			<p className='text-lg text-gray-600'>
				Esta é uma página básica criada para fins de teste.
			</p>
		</main>
	)
}

export default TestPage
