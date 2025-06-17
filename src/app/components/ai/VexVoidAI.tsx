'use client';

import { useState } from 'react';

interface AIResponse {
  success: boolean;
  content?: string;
  analysis?: string;
  error?: string;
  timestamp?: string;
}

export default function VexVoidAI() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate' | 'enhance'>('analyze');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  
  // Image Analysis State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState<'aesthetic' | 'style' | 'cinematic'>('aesthetic');
  
  // Content Generation State
  const [contentType, setContentType] = useState<'video_title' | 'video_description' | 'scene_description' | 'lore' | 'audio_description'>('video_title');
  const [context, setContext] = useState('');
  const [aesthetic, setAesthetic] = useState<'graffiti_culture' | 'train_yards' | 'neon_noir' | 'urban_decay' | 'ninja_jazz'>('graffiti_culture');
  const [tone, setTone] = useState<'underground' | 'cinematic' | 'technical' | 'narrative'>('underground');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const analyzeGraffiti = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/ai/analyze-graffiti', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64Data,
            imageType: selectedImage.type,
            analysisType
          })
        });

        const data = await response.json();
        setResult(data);
        setLoading(false);
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Analysis error:', error);
      setResult({ success: false, error: 'Failed to analyze image' });
      setLoading(false);
    }
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          context,
          aesthetic,
          tone,
          length
        })
      });

      const data = await response.json();
      setResult(data);
      setLoading(false);
    } catch (error) {
      console.error('Generation error:', error);
      setResult({ success: false, error: 'Failed to generate content' });
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-400">VEX VOID AI Studio</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`px-4 py-2 rounded ${activeTab === 'analyze' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          🎨 Analyze Graffiti
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 rounded ${activeTab === 'generate' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          📝 Generate Content
        </button>
        <button
          onClick={() => setActiveTab('enhance')}
          className={`px-4 py-2 rounded ${activeTab === 'enhance' ? 'bg-green-600' : 'bg-gray-700'}`}
        >
          🎬 Enhance Videos
        </button>
      </div>

      {/* Graffiti Analysis Tab */}
      {activeTab === 'analyze' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Analyze Your Graffiti Collection</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Upload Graffiti Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Analysis Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as any)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="aesthetic">VEX VOID Aesthetic Analysis</option>
              <option value="style">Graffiti Style Analysis</option>
              <option value="cinematic">Cinematic Video Analysis</option>
            </select>
          </div>

          <button
            onClick={analyzeGraffiti}
            disabled={!selectedImage || loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>
      )}

      {/* Content Generation Tab */}
      {activeTab === 'generate' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Generate VEX VOID Content</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="video_title">Video Titles</option>
              <option value="video_description">Video Description</option>
              <option value="scene_description">Scene Description (for Veo)</option>
              <option value="lore">VEX VOID Lore</option>
              <option value="audio_description">Audio/Sound Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Context/Prompt</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe what you want to create content for..."
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Aesthetic</label>
              <select
                value={aesthetic}
                onChange={(e) => setAesthetic(e.target.value as any)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
              >
                <option value="graffiti_culture">Graffiti Culture</option>
                <option value="train_yards">Train Yards</option>
                <option value="neon_noir">Neon Noir</option>
                <option value="urban_decay">Urban Decay</option>
                <option value="ninja_jazz">Ninja Jazz</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
              >
                <option value="underground">Underground</option>
                <option value="cinematic">Cinematic</option>
                <option value="technical">Technical</option>
                <option value="narrative">Narrative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          <button
            onClick={generateContent}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      )}

      {/* Enhance Videos Tab */}
      {activeTab === 'enhance' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Enhance Video Production</h3>
          <p className="text-gray-400">
            Coming soon: AI-powered video enhancement, automatic tagging, and scene optimization.
          </p>
          
          <div className="bg-gray-800 p-4 rounded">
            <h4 className="font-semibold mb-2">Planned Features:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Automatic video title generation from content</li>
              <li>• Scene-by-scene aesthetic analysis</li>
              <li>• Sound effect recommendations</li>
              <li>• Color grading suggestions</li>
              <li>• VEX VOID aesthetic scoring</li>
            </ul>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h4 className="font-semibold mb-2">AI Results:</h4>
          {result.success ? (
            <div className="text-sm">
              <pre className="whitespace-pre-wrap text-gray-300">
                {result.analysis || result.content}
              </pre>
              {result.timestamp && (
                <p className="text-xs text-gray-500 mt-2">
                  Generated: {new Date(result.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <p className="text-red-400">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
} 