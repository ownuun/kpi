import type { Metadata } from 'next'
import './globals.css'
import { I18nProvider } from '@/lib/i18n/context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'KPI Tracker',
  description: 'Manage social media posts, email campaigns, and leads',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        <I18nProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <LanguageSwitcher />
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
