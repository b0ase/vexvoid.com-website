// import Hero from './components/Hero'
// import ConceptArtGallery from './components/ConceptArtGallery'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        CSS Test Page
      </h1>
      <div className="bg-blue-500 p-4 rounded-lg mb-4">
        <p className="text-white">If this box is blue, Tailwind is working!</p>
      </div>
      <div className="test-neon text-2xl mb-4">
        If this text is neon green, custom CSS is working!
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500 p-4 text-white rounded">Box 1</div>
        <div className="bg-purple-500 p-4 text-white rounded">Box 2</div>
      </div>
    </main>
  )
} 