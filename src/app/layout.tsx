import type { Metadata } from 'next'
import './globals.css'
import MusicPlayer from './components/MusicPlayer'
import { MusicPlayerProvider } from './lib/musicPlayerContext'

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
        <MusicPlayerProvider>
          {children}
          <MusicPlayer />
        </MusicPlayerProvider>
      </body>
    </html>
  )
} 