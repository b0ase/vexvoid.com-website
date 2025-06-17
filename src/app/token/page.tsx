'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function TokenPage() {
  const [copied, setCopied] = useState(false)
  
  const tokenAddress = "TBD - LAUNCHING ON SOLANA" // Will be updated when token is deployed
  
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
    { label: "TOTAL SUPPLY", value: "1,000,000,000 V3X" },
    { label: "PUBLIC RELEASE", value: "500,000,000 V3X (50%)" },
    { label: "VEXVOID LTD RETAINED", value: "500,000,000 V3X (50%)" },
    { label: "CURRENT HOLDERS", value: "1 (VexVoid)" },
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
          <a href="/" className="text-xl font-bold cyber-text hover:text-cyan-400 transition-colors">
            ← V3XV0ID
          </a>
          <div className="text-sm text-white/60 lo-fi-text">
            DIGITAL CURRENCY • EXPERIMENTAL TOKEN
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto p-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-block p-4 border border-white/30 mb-6">
            <h1 className="text-5xl md:text-7xl font-bold cyber-text mb-2">
              $V3X
            </h1>
            <div className="w-24 h-px bg-white mx-auto mb-2"></div>
            <p className="text-base text-white/80 lo-fi-text">
              THE OFFICIAL V3XV0ID TOKEN
            </p>
          </div>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4 lo-fi-text">
            Digital shares in the V3XV0ID creative project - funding innovative music, visual art, and technology development.
          </p>
          <p className="text-base text-cyan-400 max-w-2xl mx-auto mb-8 lo-fi-text">
            Supporting independent digital artistry with transparent funding and revenue sharing for stakeholders.
          </p>

          {/* Token Address */}
          <div className="bg-black/80 border border-white/30 p-4 max-w-2xl mx-auto">
            <div className="text-sm text-white/60 mb-2 lo-fi-text">CONTRACT ADDRESS</div>
            <div className="flex items-center justify-between gap-4">
              <code className="text-sm md:text-base text-cyan-400 font-mono break-all">
                {tokenAddress}
              </code>
              <button
                onClick={copyToClipboard}
                className="text-sm px-3 py-1 border border-white/30 hover:bg-white hover:text-black transition-colors lo-fi-text whitespace-nowrap"
              >
                {copied ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>
        </section>

        {/* Token Distribution Pie Chart */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">TOKEN DISTRIBUTION</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/80 border border-white/30 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* CSS Pie Chart */}
                <div className="flex justify-center">
                  <div className="relative w-64 h-64">
                    <div 
                      className="w-full h-full rounded-full"
                      style={{
                        background: `conic-gradient(
                          #06b6d4 0deg 180deg,
                          #10b981 180deg 360deg
                        )`
                      }}
                    >
                      <div className="absolute inset-8 bg-black rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">1B</div>
                          <div className="text-sm text-white/60">V3X TOKENS</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-cyan-400"></div>
                    <div>
                      <div className="text-lg font-bold text-cyan-400">VexVoid LTD Retained</div>
                      <div className="text-base text-white/80">500,000,000 V3X (50%)</div>
                      <div className="text-sm text-white/60">Governance & Control</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-400"></div>
                    <div>
                      <div className="text-lg font-bold text-green-400">Public Release</div>
                      <div className="text-base text-white/80">500,000,000 V3X (50%)</div>
                      <div className="text-sm text-white/60">10 Tranches • Progressive Pricing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">TOKEN METRICS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tokenStats.map((stat, index) => (
              <div key={index} className="bg-black/80 border border-white/30 p-4 text-center">
                <div className="text-sm text-white/60 mb-2 lo-fi-text">{stat.label}</div>
                <div className="text-xl font-bold text-cyan-400">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <div className="text-sm text-white/60 lo-fi-text">
              CURRENT HOLDER: VEX VOID • LAUNCHING ON SOLANA BLOCKCHAIN
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">WHAT YOUR INVESTMENT FUNDS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-black/80 border border-white/30 p-4">
                <div className="text-base font-bold text-white lo-fi-text flex items-center">
                  <span className="text-cyan-400 mr-2">▶</span>
                  {feature}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Token Release Schedule */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">RELEASE SCHEDULE</h2>
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/80 border border-white/30 p-6 mb-6">
              <div className="text-base text-white/90 mb-6 lo-fi-text text-center">
                TOKENS RELEASED IN TRANCHES • PROGRESSIVE PRICING • PLATFORM DEVELOPMENT FUNDING
              </div>
              
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/30">
                      <th className="text-left p-3 text-sm lo-fi-text text-cyan-400">TRANCHE</th>
                      <th className="text-left p-3 text-sm lo-fi-text text-cyan-400">TOKENS</th>
                      <th className="text-left p-3 text-sm lo-fi-text text-cyan-400">PRICE</th>
                      <th className="text-left p-3 text-sm lo-fi-text text-cyan-400">FUNDING PURPOSE</th>
                      <th className="text-left p-3 text-sm lo-fi-text text-cyan-400">DELIVERABLES</th>
                      <th className="text-left p-3 text-sm lo-fi-text text-cyan-400">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/20 bg-cyan-400/5">
                      <td className="p-3 text-base font-bold text-white">1</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-green-400">$5,000</td>
                      <td className="p-3 text-base text-white">Studio Enhancement & Content Automation</td>
                      <td className="p-3 text-sm text-white/80">Advanced video generator, content analysis tools, automated scheduling, enhanced music library integration</td>
                      <td className="p-3 text-sm text-green-400 font-bold lo-fi-text">AVAILABLE</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">2</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$10,000</td>
                      <td className="p-3 text-base text-white">Content Scaling & Platform Optimization</td>
                      <td className="p-3 text-sm text-white/80">Automated thumbnail generation, SEO optimization, multi-format content creation, analytics dashboard</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">3</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$20,000</td>
                      <td className="p-3 text-base text-white">Platform Expansion & Multi-Channel Growth</td>
                      <td className="p-3 text-sm text-white/80">TikTok integration, Instagram automation, cross-platform publishing, brand partnerships system</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">4</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$40,000</td>
                      <td className="p-3 text-base text-white">Live Performance & Virtual Experiences</td>
                      <td className="p-3 text-sm text-white/80">Virtual concert platform, live streaming infrastructure, venue partnerships, real-time audience interaction</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">5</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$80,000</td>
                      <td className="p-3 text-base text-white">Advanced Creative Tools & Automation</td>
                      <td className="p-3 text-sm text-white/80">Enhanced creative workflow systems, automated decision making, fan interaction tools, collaboration platforms</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">6</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$160,000</td>
                      <td className="p-3 text-base text-white">Global Performance Infrastructure</td>
                      <td className="p-3 text-sm text-white/80">Physical venue partnerships, projection systems, global event coordination, merchandise distribution</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">7</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$320,000</td>
                      <td className="p-3 text-base text-white">Revenue Optimization & Brand Partnerships</td>
                      <td className="p-3 text-sm text-white/80">Corporate sponsorship platform, brand collaboration tools, premium content tiers, exclusive fan experiences</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">8</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$640,000</td>
                      <td className="p-3 text-base text-white">Immersive Digital Experiences</td>
                      <td className="p-3 text-sm text-white/80">Virtual concert venues, immersive world performances, NFT integration, digital asset marketplace</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">9</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$1,280,000</td>
                      <td className="p-3 text-base text-white">Enterprise & Licensing Platform</td>
                      <td className="p-3 text-sm text-white/80">Creative technology licensing, enterprise API, B2B partnerships, technology licensing deals</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                    <tr className="border-b border-white/20">
                      <td className="p-3 text-base font-bold text-white">10</td>
                      <td className="p-3 text-base text-white">50M V3X (5%)</td>
                      <td className="p-3 text-base font-bold text-white">$2,560,000</td>
                      <td className="p-3 text-base text-white">Global Creative Network</td>
                      <td className="p-3 text-sm text-white/80">Multi-language content creation, global market expansion, artist collaboration platform, autonomous creative systems</td>
                      <td className="p-3 text-sm text-white/60 font-bold lo-fi-text">LOCKED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="text-center mt-6">
                <div className="text-sm text-white/60 lo-fi-text mb-2">
                  EACH TRANCHE MUST BE FULLY PURCHASED BEFORE NEXT RELEASE • PRICES DOUBLE WITH EACH TRANCHE
                </div>
                <div className="text-sm text-cyan-400 lo-fi-text mb-2">
                  TOTAL FUNDING TARGET: $5,115,000 • VEXVOID LTD RETAINS 50% CONTROL
                </div>
                <div className="text-sm text-white/50 lo-fi-text">
                  Building innovative creative technology and content generation systems for sustainable revenue
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Sharing Model */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">REVENUE SHARING</h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-black/80 border border-white/30 p-6 mb-6">
              <div className="text-base text-white/90 mb-4 lo-fi-text text-center">
                PLATFORM REVENUE DISTRIBUTED TO V3X STAKERS • DIVIDEND MODEL
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/60 border border-green-400/30 p-4 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <div className="text-base font-bold mb-2 lo-fi-text text-green-400">REVENUE SOURCES</div>
                  <div className="text-sm text-white/70 mb-2">Content monetization</div>
                  <div className="text-sm text-white/70 mb-2">Sponsorship deals</div>
                  <div className="text-sm text-white/70">Platform partnerships</div>
                </div>
                <div className="bg-black/60 border border-cyan-400/30 p-4 text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-base font-bold mb-2 lo-fi-text text-cyan-400">STAKING REWARDS</div>
                  <div className="text-sm text-white/70 mb-2">Monthly dividend payouts</div>
                  <div className="text-sm text-white/70 mb-2">Proportional to stake</div>
                  <div className="text-sm text-white/70">Automatic distribution</div>
                </div>
                <div className="bg-black/60 border border-purple-400/30 p-4 text-center">
                  <div className="text-2xl mb-2">👑</div>
                  <div className="text-base font-bold mb-2 lo-fi-text text-purple-400">GOVERNANCE</div>
                  <div className="text-sm text-white/70 mb-2">Vex Void retains majority</div>
                  <div className="text-sm text-white/70 mb-2">Creative direction</div>
                  <div className="text-sm text-white/70">Platform development</div>
                </div>
              </div>
              <div className="text-center mt-6">
                <div className="bg-black/40 border border-yellow-400/30 p-4 rounded">
                  <div className="text-base text-yellow-400 font-bold mb-2 lo-fi-text">REVENUE EXAMPLE</div>
                  <div className="text-sm text-white/80">
                    $10,000 monthly platform revenue → Majority to operations & development → Portion distributed to stakers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Buy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">HOW TO ACQUIRE</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/80 border border-white/30 p-4 text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-base font-bold mb-2 lo-fi-text">TRANCHE PURCHASE</div>
                <div className="text-sm text-white/70">Buy entire tranches to fund development and secure tokens at current pricing</div>
              </div>
              <div className="bg-black/80 border border-white/30 p-4 text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-base font-bold mb-2 lo-fi-text">SECONDARY MARKET</div>
                <div className="text-sm text-white/70">Trade on decentralized exchanges after initial distribution</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Simple Truth */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">THE SIMPLE TRUTH</h2>
          <div className="max-w-3xl mx-auto bg-black/80 border border-white/30 p-6">
            <div className="text-base text-white/90 space-y-4 lo-fi-text">
              <p>
                <strong>$V3X is not a complex DeFi token.</strong> It's digital shares in the V3XV0ID creative project.
              </p>
              <p>
                <strong>What you're funding:</strong> Better music production, cutting-edge visual art, 
                innovative creative tools, and the time needed to create without compromise.
              </p>
              <p>
                <strong>What you get:</strong> Early access to releases, behind-the-scenes content, 
                and the satisfaction of supporting independent digital artistry.
              </p>
              <p>
                <strong>No promises of riches.</strong> No complex tokenomics. No gimmicky schemes. 
                Just honest funding for honest creative work.
              </p>
            </div>
          </div>
        </section>

        {/* Development Roadmap */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold cyber-text mb-6 text-center">DEVELOPMENT ROADMAP</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-black/80 border border-white/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-bold text-green-400 lo-fi-text">PHASE 1 - CURRENT</div>
                <div className="text-sm text-white/60">2024-2025</div>
              </div>
              <div className="text-sm text-white/80">Music Production • Visual Art Development • Platform Foundation</div>
            </div>
            <div className="bg-black/80 border border-white/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-bold text-cyan-400 lo-fi-text">PHASE 2 - EXPANSION</div>
                <div className="text-sm text-white/60">2025</div>
              </div>
              <div className="text-sm text-white/80">Advanced Content Generation • Live Performance Tech • Community Features</div>
            </div>
            <div className="bg-black/80 border border-white/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base font-bold text-white/60 lo-fi-text">PHASE 3 - INNOVATION</div>
                <div className="text-sm text-white/60">2025+</div>
              </div>
              <div className="text-sm text-white/80">Creative Collaboration Tools • Immersive Experiences • Open Source Development</div>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="text-center">
          <div className="bg-red-900/20 border border-red-500/30 p-4 max-w-2xl mx-auto">
            <div className="text-base font-bold text-red-400 mb-2 lo-fi-text">⚠ EXPERIMENTAL TOKEN</div>
            <div className="text-sm text-white/70">
              $V3X is an experimental digital asset. Only invest what you can afford to lose. 
              This is not financial advice. Do your own research.
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 p-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-sm text-white/50 lo-fi-text">
            © 2024 V3XV0ID • EXPERIMENTAL DIGITAL MUSIC & TECHNOLOGY
          </div>
        </div>
      </footer>
    </div>
  )
} 