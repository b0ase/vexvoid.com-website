import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'V3XV0ID - Mobile Preview',
  description: 'Immersive V3XV0ID visual experience - optimized for mobile sharing',
}

export default function MobileLayout({
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