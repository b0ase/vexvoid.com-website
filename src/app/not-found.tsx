import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-mono text-cyan-400">404</h1>
        <h2 className="text-2xl font-mono">Page Not Found</h2>
        <p className="text-gray-400 max-w-md">
          The page you're looking for has been lost in the void.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-cyan-400 text-black font-mono rounded hover:bg-cyan-500 transition-colors"
        >
          Return to V3XV0ID
        </Link>
      </div>
    </div>
  )
} 