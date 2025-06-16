import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'V3XV0ID - Digital Musician & Hacker',
  description: 'Personal website of V3XV0ID - Digital musician, hacker, and creative technologist',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-retro bg-cyber-black text-cyber-white">
        {children}
      </body>
    </html>
  )
} 