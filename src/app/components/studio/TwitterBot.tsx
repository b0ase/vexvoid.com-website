'use client';
import { useState, useEffect } from 'react';

interface TwitterBotProps {
  className?: string;
}

export default function TwitterBot({ className = '' }: TwitterBotProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posting, setPosting] = useState(false);
  const [lastPost, setLastPost] = useState<any>(null);
  const [customText, setCustomText] = useState('');
  const [autoPost, setAutoPost] = useState(false);

  useEffect(() => {
    // Check if Twitter is connected
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('twitter') === 'connected') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = () => {
    window.location.href = '/api/twitter/auth';
  };

  const handlePost = async (type: string = 'custom') => {
    setPosting(true);
    try {
      let response;
      if (type === 'custom' && customText) {
        response = await fetch('/api/twitter/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: customText })
        });
      } else {
        response = await fetch(`/api/twitter/post?type=${type}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setLastPost(result);
        setCustomText('');
      } else {
        alert('Failed to post: ' + result.error);
      }
    } catch (error) {
      alert('Error posting to Twitter');
    }
    setPosting(false);
  };

  const startAutoPost = async () => {
    setAutoPost(true);
    // Set up interval for auto-posting (every 4 hours)
    const interval = setInterval(() => {
      const postTypes = ['video', 'concept', 'latest'];
      const randomType = postTypes[Math.floor(Math.random() * postTypes.length)];
      handlePost(randomType);
    }, 4 * 60 * 60 * 1000); // 4 hours

    return () => clearInterval(interval);
  };

  return (
    <div className={`bg-gray-900 border border-purple-500/30 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🐦</span>
          V3XV0ID Twitter Bot
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isAuthenticated 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isAuthenticated ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Connect your Twitter account to start auto-posting V3XV0ID content</p>
          <button
            onClick={handleAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Connect Twitter
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Manual Post */}
          <div className="border border-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Manual Post</h4>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your V3XV0ID message..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handlePost('custom')}
                disabled={posting || !customText}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {posting ? 'Posting...' : 'Post Text'}
              </button>
              <button
                onClick={() => handlePost('video')}
                disabled={posting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Post Latest Video
              </button>
              <button
                onClick={() => handlePost('concept')}
                disabled={posting}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Post Concept Art
              </button>
            </div>
          </div>

          {/* Auto Post */}
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold text-white">Auto Post</h4>
              <button
                onClick={startAutoPost}
                disabled={autoPost}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoPost 
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {autoPost ? 'Auto-posting Active' : 'Start Auto-post'}
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Automatically posts V3XV0ID content every 4 hours with random content from your generated videos and concept art.
            </p>
          </div>

          {/* Last Post */}
          {lastPost && (
            <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
              <h4 className="text-lg font-semibold text-green-400 mb-2">Last Post</h4>
              <p className="text-gray-300 text-sm mb-2">{lastPost.text}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tweet ID: {lastPost.tweetId}</span>
                <span>{new Date(lastPost.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 