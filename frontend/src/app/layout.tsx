import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yet Another Path Planner',
  description: 'A tool for finding, creating, and tracking flight tours for flight simulation careers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
