import type { Metadata } from 'next'
import './globals.css'
import MusicPlayer from './components/MusicPlayer'

export const metadata: Metadata = {
  title: 'v3xv0id - Digital Music & Visual Art',
  description: 'Experimental electronic music, visual art, and creative technology by v3xv0id',
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
        <MusicPlayer />
      </body>
    </html>
  )
} 