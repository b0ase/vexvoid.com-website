import Hero from './components/Hero'
import ConceptArtGallery from './components/ConceptArtGallery'

export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-black">
      <Hero />
      <ConceptArtGallery />

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 bg-cyber-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">PROJECTS</h2>
            <div className="w-24 h-px bg-cyber-white mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="cyber-card p-8 rounded-none group cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-cyber-white mr-3"></div>
                <h3 className="text-xl font-mono cyber-text">DIGITAL MUSIC</h3>
              </div>
              <p className="text-cyber-accent leading-relaxed">
                Experimental electronic music and sound design projects that push sonic boundaries.
              </p>
            </div>
            <div className="cyber-card p-8 rounded-none group cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-cyber-white mr-3"></div>
                <h3 className="text-xl font-mono cyber-text">HACKING</h3>
              </div>
              <p className="text-cyber-accent leading-relaxed">
                Security research and creative coding experiments exploring digital systems.
              </p>
            </div>
            <div className="cyber-card p-8 rounded-none group cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-cyber-white mr-3"></div>
                <h3 className="text-xl font-mono cyber-text">ART</h3>
              </div>
              <p className="text-cyber-accent leading-relaxed">
                Generative art and interactive installations merging technology with creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-cyber-black border-t border-cyber-gray">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">ABOUT</h2>
            <div className="w-24 h-px bg-cyber-white mx-auto"></div>
          </div>
          <div className="space-y-8 text-lg text-cyber-accent leading-relaxed">
            <p>
              V3XV0ID is a digital musician and hacker exploring the intersection of technology, art, and sound.
              Through experimental electronic music, creative coding, and security research, I push the boundaries
              of what's possible in the digital realm.
            </p>
            <p>
              My work combines technical expertise with artistic vision, creating unique experiences
              that challenge conventional thinking about music, technology, and security.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
} 