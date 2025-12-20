import { ReactNode } from 'react'
import Navigation from '@/components/layout/Navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </>
  )
}
