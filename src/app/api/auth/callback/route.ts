import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    // Handle OAuth error
    return new NextResponse(`
      <html>
        <body style="font-family: monospace; background: black; color: white; padding: 20px;">
          <h2>❌ Authentication Failed</h2>
          <p>Error: ${error}</p>
          <p>You can close this window and try again.</p>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (code) {
    // Success - store the code and close window
    return new NextResponse(`
      <html>
        <body style="font-family: monospace; background: black; color: white; padding: 20px;">
          <h2>✅ Authentication Successful</h2>
          <p>Authorization code received. Processing...</p>
          <p>This window will close automatically.</p>
          <button onclick="window.close()" style="background: #dc2626; color: white; border: none; padding: 10px 20px; margin-top: 10px; font-family: monospace; cursor: pointer;">
            Close Window
          </button>
          <script>
            // Store the code in localStorage and close window
            if (window.opener) {
              window.opener.postMessage({
                type: 'YOUTUBE_AUTH_SUCCESS',
                code: '${code}'
              }, '*');
              // Try to close immediately after sending message
              setTimeout(() => {
                try {
                  window.close();
                } catch (e) {
                  console.log('Could not close window automatically');
                }
              }, 1000);
            } else {
              // If no opener, try to close anyway
              setTimeout(() => {
                try {
                  window.close();
                } catch (e) {
                  console.log('Could not close window automatically');
                }
              }, 2000);
            }
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // No code or error - something went wrong
  return new NextResponse(`
    <html>
      <body style="font-family: monospace; background: black; color: white; padding: 20px;">
        <h2>⚠️ Authentication Incomplete</h2>
        <p>No authorization code received.</p>
        <p>You can close this window and try again.</p>
        <script>
          setTimeout(() => window.close(), 3000);
        </script>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' },
  });
} 