import type { Metadata } from 'next'
import './globals.css'
import MusicPlayer from './components/MusicPlayer'

export const metadata: Metadata = {
  title: 'V3XV0ID - Digital Musician & Hacker',
  description: 'Experimental electronic music and digital art by V3XV0ID',
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