import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

import { AuthContextProvider } from '@/context/auth'
import { env } from '@/env'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const baseUrl = env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: `%s | ${env.SITE_NAME}`,
    default: env.SITE_NAME
  },
  description: 'An application that you can add your note by voice'
}

export default async function IntlLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={inter.variable}>
      <body className="bg-slate-900 text-slate-50 antialiased">
        <Toaster richColors />
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  )
}
