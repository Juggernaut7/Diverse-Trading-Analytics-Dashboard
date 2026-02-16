import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { Sidebar } from '@/components/layout/sidebar';
import { Providers } from '@/components/providers/wallet-provider';

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deriverse Trading Dashboard',
  description: 'Comprehensive on-chain trading analytics dashboard for Deriverse protocol. Track PnL, analyze performance, and gain insights from your trading data.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#050505] text-white">
        {/* <Providers> */}
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:pl-64 transition-all duration-300">
            {children}
          </main>
        </div>
        {/* </Providers> */}
      </body>
    </html>
  )
}
