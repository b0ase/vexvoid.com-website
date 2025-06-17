export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold lo-fi-text mb-4">Terms of Service</h1>
          <p className="text-white/70 lo-fi-text">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-8 text-white/90">
          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the V3XV0ID website and services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">2. Description of Service</h2>
            <p className="mb-4">
              V3XV0ID is a digital art and music platform that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Digital art galleries and concept collections</li>
              <li>Music streaming and generation tools</li>
              <li>Video content creation and sharing</li>
              <li>Social media integration and automated posting</li>
              <li>Creative studio tools and AI-powered content generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">3. User Accounts and Authentication</h2>
            <p className="mb-4">
              When you connect third-party services (such as Twitter, YouTube, or Google accounts) to V3XV0ID:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You grant us permission to access and use your account according to the specified scope</li>
              <li>You remain responsible for all activity that occurs under your connected accounts</li>
              <li>You may revoke access at any time through your account settings</li>
              <li>We will only use your data as described in our Privacy Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">4. Content and Intellectual Property</h2>
            <p className="mb-4">
              All content on V3XV0ID, including music, artwork, videos, and text, is owned by V3XV0ID or licensed to us. Users may:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>View and enjoy content for personal use</li>
              <li>Share content through provided social features</li>
              <li>Not redistribute, modify, or commercialize our content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">5. Automated Posting and Social Media</h2>
            <p className="mb-4">
              Our Twitter bot and social media features:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Will only post content you explicitly authorize</li>
              <li>May include V3XV0ID branding and hashtags</li>
              <li>Can be disabled at any time through your dashboard</li>
              <li>Respect all platform terms of service and rate limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">6. Prohibited Uses</h2>
            <p className="mb-4">You may not use our service to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Spam or harass other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use our content for commercial purposes without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">7. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">8. Limitation of Liability</h2>
            <p className="mb-4">
              V3XV0ID shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective upon posting to this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold lo-fi-text mb-4 text-cyan-400">10. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us through our website or social media channels.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-white/50 text-sm text-center lo-fi-text">
            V3XV0ID - Echoes in the Digital Underground
          </p>
        </div>
      </div>
    </div>
  );
} 