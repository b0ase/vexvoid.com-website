export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold lo-fi-text mb-4">Privacy Policy</h1>
          <p className="text-white/70 lo-fi-text">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-white/90">
          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">1. Information We Collect</h2>
            <p className="mb-4">
              V3XV0ID collects information to provide and improve our services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> When you connect social media accounts (Twitter, YouTube, Google), we store access tokens and basic profile information</li>
              <li><strong>Usage Data:</strong> We collect information about how you use our website, including pages visited and features used</li>
              <li><strong>Content Data:</strong> Information about content you create, share, or interact with on our platform</li>
              <li><strong>Technical Information:</strong> Browser type, IP address, device information, and cookies for site functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Enable social media integrations and automated posting</li>
              <li>Improve our content generation and recommendation algorithms</li>
              <li>Communicate with you about updates and new features</li>
              <li>Ensure security and prevent misuse of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">3. Third-Party Services</h2>
            <p className="mb-4">
              V3XV0ID integrates with several third-party services. When you connect these accounts, you authorize us to:
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h4 className="font-bold text-white mb-2">🐦 Twitter/X Integration:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Read your profile information</li>
                  <li>Post tweets and media on your behalf</li>
                  <li>Access your follower and following lists (if enabled)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-2">🎬 YouTube Integration:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Upload videos to your channel</li>
                  <li>Read your channel information and statistics</li>
                  <li>Manage video metadata and descriptions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-2">🎵 Music Services:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Generate music through Suno AI</li>
                  <li>Access your music preferences and history</li>
                  <li>Create and manage playlists</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">4. Data Storage and Security</h2>
            <p className="mb-4">We take data security seriously:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All access tokens are encrypted and stored securely</li>
              <li>We use HTTPS for all data transmission</li>
              <li>Session data is stored in secure, httpOnly cookies</li>
              <li>We regularly update our security practices</li>
              <li>Media files are stored in secure cloud storage (Supabase)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">5. Automated Posting and Content Sharing</h2>
            <p className="mb-4">
              Our Twitter bot and automated features:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Only post content you explicitly authorize</li>
              <li>Can be controlled and disabled through your dashboard</li>
              <li>Include V3XV0ID branding and appropriate hashtags</li>
              <li>Respect platform rate limits and terms of service</li>
              <li>Allow you to review and approve content before posting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">6. Cookies and Local Storage</h2>
            <p className="mb-4">We use cookies and local storage for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Authentication and session management</li>
              <li>Storing user preferences and settings</li>
              <li>Analytics and performance monitoring</li>
              <li>Enabling social media integrations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">7. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell your personal information. We may share data only:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and prevent misuse</li>
              <li>With service providers who help us operate our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">8. Your Rights and Controls</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access and review your personal information</li>
              <li>Disconnect social media accounts at any time</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of automated posting features</li>
              <li>Request data portability or deletion</li>
              <li>Update your preferences and settings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">9. Data Retention</h2>
            <p className="mb-4">
              We retain your data only as long as necessary to provide our services. When you disconnect an account or delete your data, we remove it from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">10. International Users</h2>
            <p className="mb-4">
              V3XV0ID operates globally. By using our service, you consent to the transfer and processing of your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">11. Children's Privacy</h2>
            <p className="mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">12. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">13. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or how we handle your data, please contact us through our website or social media channels.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/50 text-sm text-center lo-fi-text">
            V3XV0ID - Protecting Your Digital Privacy in the Underground
          </p>
        </div>
      </div>
    </div>
  );
} 