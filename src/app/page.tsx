import Hero from './components/Hero'
import ConceptArtGallery from './components/ConceptArtGallery'
import MusicPlayer from './components/MusicPlayer'

export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-black">
      <Hero />
      
      {/* Music Section */}
      <MusicPlayer />

      {/* Visual Art Section */}
      <ConceptArtGallery />

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 bg-cyber-black border-t border-cyber-gray">
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
                Experimental electronic music and sound design projects that push sonic boundaries through innovative synthesis and production techniques.
              </p>
            </div>
            <div className="cyber-card p-8 rounded-none group cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-cyber-white mr-3"></div>
                <h3 className="text-xl font-mono cyber-text">SECURITY RESEARCH</h3>
              </div>
              <p className="text-cyber-accent leading-relaxed">
                Creative coding experiments and security research exploring the intersection of technology and digital systems architecture.
              </p>
            </div>
            <div className="cyber-card p-8 rounded-none group cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-cyber-white mr-3"></div>
                <h3 className="text-xl font-mono cyber-text">VISUAL ART</h3>
              </div>
              <p className="text-cyber-accent leading-relaxed">
                Generative art and interactive installations merging algorithmic creativity with human expression in digital spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-cyber-dark border-t border-cyber-gray">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-mono mb-4 cyber-text font-bold">ABOUT</h2>
            <div className="w-24 h-px bg-cyber-white mx-auto"></div>
          </div>
          <div className="space-y-8 text-lg text-cyber-accent leading-relaxed">
            <p>
              V3XV0ID operates at the nexus of music, technology, and digital art. Through experimental electronic 
              compositions, security research, and generative visual work, I explore the liminal spaces where 
              human creativity intersects with machine logic.
            </p>
            <p>
              Each project represents an investigation into digital mediums—from the manipulation of sound waves 
              to the architecture of secure systems, from algorithmic art generation to the aesthetic philosophy 
              of cyber culture. The work challenges conventional boundaries between artist and technologist, 
              creator and researcher.
            </p>
            <p>
              This is exploration through code, sound, and visual form—a continuous dialogue between the organic 
              and the digital, the secure and the experimental, the known and the void.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
} 