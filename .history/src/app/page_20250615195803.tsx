import Hero from './components/Hero'
import ConceptArtGallery from './components/ConceptArtGallery'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ConceptArtGallery />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-mono mb-12 text-center neon-text">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project cards will go here */}
            <div className="p-6 neon-border rounded-lg">
              <h3 className="text-xl font-mono mb-4">Digital Music</h3>
              <p className="text-gray-300">Experimental electronic music and sound design projects.</p>
            </div>
            <div className="p-6 neon-border rounded-lg">
              <h3 className="text-xl font-mono mb-4">Hacking</h3>
              <p className="text-gray-300">Security research and creative coding experiments.</p>
            </div>
            <div className="p-6 neon-border rounded-lg">
              <h3 className="text-xl font-mono mb-4">Art</h3>
              <p className="text-gray-300">Generative art and interactive installations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-darker-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-mono mb-12 text-center neon-text">About</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              V3XV0ID is a digital musician and hacker exploring the intersection of technology, art, and sound.
              Through experimental electronic music, creative coding, and security research, I push the boundaries
              of what's possible in the digital realm.
            </p>
            <p className="text-lg">
              My work combines technical expertise with artistic vision, creating unique experiences
              that challenge conventional thinking about music, technology, and security.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
} 