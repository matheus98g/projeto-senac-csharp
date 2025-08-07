import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/dark-mode/theme-provider"
import { ModeToggle } from "@/components/dark-mode/theme-togle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button className="cursor-pointer">Click me</Button>
        <ModeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App