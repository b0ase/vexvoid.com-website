'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VideoEditorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to studio with editor tab active
    router.replace('/studio?tab=editor')
  }, [router])

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold lo-fi-text mb-4">🎥 Redirecting to Studio...</h1>
        <p className="text-white/70 lo-fi-text">
          Video Editor has been consolidated into the Studio.
        </p>
        <div className="mt-4">
          <a 
            href="/studio?tab=editor" 
            className="text-cyan-400 hover:text-cyan-300 lo-fi-text"
          >
            → Continue to Studio
          </a>
        </div>
      </div>
    </div>
  )
} 