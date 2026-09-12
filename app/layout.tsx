import React from 'react'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'dashop - Your Everyday Essentials',
  description: 'Quality household essentials, cleaning supplies, personal care and beauty products.',
  keywords: ['household', 'cleaning', 'personal care', 'beauty', 'essential'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
