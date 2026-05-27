import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function MainLayout() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <div className="pointer-events-none fixed inset-0 subtle-grid opacity-40" aria-hidden />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
