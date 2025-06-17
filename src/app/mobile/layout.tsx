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
      <head>
        <style>{`
          /* Hide any music player components on mobile page */
          .mobile-preview-page ~ *,
          .mobile-preview-page + *,
          body:has(.mobile-preview-page) > *:not(.mobile-preview-page) {
            display: none !important;
          }
          
          /* Additional selectors to hide music players */
          [class*="music"],
          [class*="player"],
          [data-component="music"],
          [data-component="player"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      </head>
      <body className="font-retro bg-cyber-black text-cyber-white">
        {children}
      </body>
    </html>
  )
} 