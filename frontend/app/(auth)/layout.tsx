import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-4">
        <Breadcrumb />
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
