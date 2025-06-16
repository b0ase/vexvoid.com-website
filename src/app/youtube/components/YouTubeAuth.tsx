'use client';

import { useState, useEffect } from 'react';

interface YouTubeAuthProps {
  onAuthChange?: (isAuthenticated: boolean) => void;
}

export default function YouTubeAuth({ onAuthChange }: YouTubeAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth success messages from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'YOUTUBE_AUTH_SUCCESS') {
        exchangeCodeForTokens(event.data.code);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const checkAuthStatus = () => {
    const tokens = localStorage.getItem('youtube_tokens');
    if (tokens) {
      setIsAuthenticated(true);
      // TODO: Validate tokens and get user info
      setUserInfo({ name: 'V3XV0ID Channel' }); // Placeholder
      if (onAuthChange) onAuthChange(true);
    }
  };

  const handleAuthenticate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get auth URL from our API
      const response = await fetch('/api/youtube/auth');
      const data = await response.json();

      console.log('Auth response:', data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.authUrl) {
        console.log('Opening auth URL:', data.authUrl);
        
        // Open in popup window
        const authWindow = window.open(
          data.authUrl,
          'youtube-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Check if popup was blocked
        if (!authWindow) {
          throw new Error('Popup blocked. Please allow popups and try again.');
        }

        // Monitor popup closure
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            setIsLoading(false);
          }
        }, 1000);
      } else {
        throw new Error('No auth URL received from server');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(`Authentication failed: ${error}`);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('youtube_tokens');
    setIsAuthenticated(false);
    setUserInfo(null);
    if (onAuthChange) onAuthChange(false);
  };

  const handleManualAuth = () => {
    const code = prompt('Enter the authorization code from Google:');
    if (code) {
      exchangeCodeForTokens(code);
    }
  };

  const exchangeCodeForTokens = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/youtube/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setUserInfo({ name: 'V3XV0ID Channel' });
        if (onAuthChange) onAuthChange(true);
      } else {
        throw new Error(data.error || 'Token exchange failed');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      setError(`Token exchange failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="border border-green-500/50 bg-green-500/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs cyber-text text-green-400">YOUTUBE AUTHENTICATED</div>
            <div className="text-xs text-green-300">
              ✓ Connected as: {userInfo?.name || 'V3XV0ID Channel'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-xs font-mono border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            LOGOUT
          </button>
        </div>
        
        <div className="text-xs text-green-300/80">
          🎬 Ready to upload videos to YouTube!
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/20 p-4 bg-black/50">
      <div className="text-xs cyber-text mb-3">YOUTUBE AUTHENTICATION</div>
      
      {error && (
        <div className="border border-red-500/50 bg-red-500/10 p-3 mb-4">
          <div className="text-xs text-red-400">❌ {error}</div>
        </div>
      )}
      
      <div className="space-y-3">
        <button
          onClick={handleAuthenticate}
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-3 px-4 text-sm font-mono hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE WITH YOUTUBE'}
        </button>
        
        <button
          onClick={handleManualAuth}
          disabled={isLoading}
          className="w-full bg-white/10 text-white py-2 px-4 text-xs font-mono border border-white/30 hover:bg-white/20 transition-colors"
        >
          MANUAL AUTH (ENTER CODE)
        </button>

        <button
          onClick={() => window.open('/api/debug', '_blank')}
          className="w-full bg-blue-600/50 text-white py-1 px-4 text-xs font-mono border border-blue-500/30 hover:bg-blue-600/70 transition-colors"
        >
          DEBUG: CHECK ENV VARS
        </button>
      </div>
      
      <div className="mt-4 text-xs text-white/60">
        <div className="mb-2">📋 Required for:</div>
        <div className="space-y-1 text-xs">
          <div>• Uploading videos to YouTube</div>
          <div>• Managing video metadata</div>
          <div>• Accessing channel analytics</div>
        </div>
      </div>
      
      <div className="mt-4 p-3 border border-blue-500/30 bg-blue-500/10">
        <div className="text-xs text-blue-400 mb-1">⚠️ SETUP REQUIRED</div>
        <div className="text-xs text-blue-300">
          Follow the YOUTUBE_SETUP.md guide to configure Google Cloud Console first.
        </div>
      </div>
    </div>
  );
} 