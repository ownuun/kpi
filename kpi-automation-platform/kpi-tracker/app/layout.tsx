import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KPI Tracker',
  description: 'KPI 자동화 트래킹 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
