'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function TokenPage() {
  const [copied, setCopied] = useState(false)
  
  const tokenAddress = "0x1234567890abcdef1234567890abcdef12345678" // Replace with actual token address
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const tokenStats = [
    { label: "TOTAL SUPPLY", value: "1,000,000 V3X" },
    { label: "CIRCULATING", value: "750,000 V3X" },
    { label: "BURNED", value: "250,000 V3X" },
    { label: "HOLDERS", value: "1,337" },
  ]

  const features = [
    "FUND MUSIC PRODUCTION",
    "SUPPORT VISUAL DEVELOPMENT", 
    "ENABLE TECH INNOVATION",
    "EXCLUSIVE EARLY ACCESS",
    "LIMITED SUPPLY",
    "TRANSPARENT FUNDING"
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 cyber-grid-line opacity-5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-white/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-lg font-bold cyber-text hover:text-cyan-400 transition-colors">
            ← V3XV0ID
          </a>
          <div className="text-xs text-white/60 lo-fi-text">
            DIGITAL CURRENCY • EXPERIMENTAL TOKEN
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto p-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-block p-4 border border-white/30 mb-6">
            <h1 className="text-4xl md:text-6xl font-bold cyber-text mb-2">
              $V3X
            </h1>
            <div className="w-24 h-px bg-white mx-auto mb-2"></div>
            <p className="text-sm text-white/80 lo-fi-text">
              THE OFFICIAL V3XV0ID TOKEN
            </p>
          </div>
          
                     <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8 lo-fi-text">
             DIGITAL SHARES IN THE V3XV0ID PROJECT. 
             FUND BETTER MUSIC, VISUALS, AND TECHNOLOGY. SIMPLE.
           </p>

          {/* Token Address */}
          <div className="bg-black/80 border border-white/30 p-4 max-w-2xl mx-auto">
            <div className="text-xs text-white/60 mb-2 lo-fi-text">CONTRACT ADDRESS</div>
            <div className="flex items-center justify-between gap-4">
              <code className="text-xs md:text-sm text-cyan-400 font-mono break-all">
                {tokenAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="text-xs px-3 py-1 border border-white/30 hover:bg-white hover:text-black transition-colors lo-fi-text whitespace-nowrap"
              >
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold cyber-text mb-6 text-center">TOKEN METRICS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tokenStats.map((stat, index) => (
              <div key={index} className="bg-black/80 border border-white/30 p-4 text-center">
                <div className="text-xs text-white/60 mb-2 lo-fi-text">{stat.label}</div>
                <div className="text-lg font-bold text-cyan-400">{stat.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-xl font-bold cyber-text mb-6 text-center">WHAT YOUR INVESTMENT FUNDS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-black/80 border border-white/30 p-4">
                <div className="text-sm font-bold text-white lo-fi-text flex items-center">
                  <span className="text-cyan-400 mr-2">▶</span>
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Buy */}
        <section className="mb-12">
          <h2 className="text-xl font-bold cyber-text mb-6 text-center">HOW TO ACQUIRE</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/80 border border-white/30 p-4 text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm font-bold mb-2 lo-fi-text">DIRECT PURCHASE</div>
                <div className="text-xs text-white/70">Buy directly to fund the project and support development</div>
              </div>
              <div className="bg-black/80 border border-white/30 p-4 text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-sm font-bold mb-2 lo-fi-text">DEX TRADING</div>
                <div className="text-xs text-white/70">Trade on decentralized exchanges when available</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Simple Truth */}
        <section className="mb-12">
          <h2 className="text-xl font-bold cyber-text mb-6 text-center">THE SIMPLE TRUTH</h2>
          <div className="max-w-3xl mx-auto bg-black/80 border border-white/30 p-6">
            <div className="text-sm text-white/90 space-y-4 lo-fi-text">
              <p>
                <strong>$V3X is not a complex DeFi token.</strong> It's digital shares in the V3XV0ID project.
              </p>
              <p>
                <strong>What you're funding:</strong> Better music production, cutting-edge visual art, 
                innovative software tools, and the time needed to create without compromise.
              </p>
              <p>
                <strong>What you get:</strong> Early access to releases, behind-the-scenes content, 
                and the satisfaction of supporting independent digital art.
              </p>
              <p>
                <strong>No promises of riches.</strong> No complex tokenomics. No listen-to-earn schemes. 
                Just honest funding for honest art.
              </p>
            </div>
          </div>
        </section>

        {/* Development Roadmap */}
        <section className="mb-12">
          <h2 className="text-xl font-bold cyber-text mb-6 text-center">DEVELOPMENT ROADMAP</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-black/80 border border-white/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-green-400 lo-fi-text">PHASE 1 - CURRENT</div>
                <div className="text-xs text-white/60">2024-2025</div>
              </div>
              <div className="text-xs text-white/80">Music Production • Visual Art Development • Platform Foundation</div>
            </div>
            <div className="bg-black/80 border border-white/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-cyan-400 lo-fi-text">PHASE 2 - EXPANSION</div>
                <div className="text-xs text-white/60">2025</div>
              </div>
              <div className="text-xs text-white/80">Advanced Video Generation • Live Performance Tech • Community Features</div>
            </div>
            <div className="bg-black/80 border border-white/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-white/60 lo-fi-text">PHASE 3 - INNOVATION</div>
                <div className="text-xs text-white/60">2025+</div>
              </div>
              <div className="text-xs text-white/80">AI Music Collaboration • Immersive Experiences • Open Source Tools</div>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="text-center">
          <div className="bg-red-900/20 border border-red-500/30 p-4 max-w-2xl mx-auto">
            <div className="text-sm font-bold text-red-400 mb-2 lo-fi-text">⚠ EXPERIMENTAL TOKEN</div>
            <div className="text-xs text-white/70">
              $V3X is an experimental digital asset. Only invest what you can afford to lose. 
              This is not financial advice. Do your own research.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 p-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs text-white/50 lo-fi-text">
            © 2024 V3XV0ID • EXPERIMENTAL DIGITAL MUSIC & TECHNOLOGY
          </div>
        </div>
      </footer>
    </div>
  )
} 