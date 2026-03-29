import { Helmet } from 'react-helmet-async';

export default function CookiePolicy() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | BROADPOST</title>
        <meta
          name="description"
          content="Understand how BROADPOST uses cookies and similar technologies."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Cookie Policy</h1>
          <p className="text-sm text-gray-500">Last updated: March 29, 2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            This Cookie Policy explains how BROADPOST uses cookies, pixels, and similar technologies to
            recognize you and improve your experience.
          </p>

          <h2>What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help websites
            remember your preferences and understand how users interact with pages.
          </p>

          <h2>Types of Cookies We Use</h2>
          <ul>
            <li><strong>Essential cookies:</strong> Required for core site functionality and security.</li>
            <li><strong>Performance cookies:</strong> Help us measure usage and improve site speed and reliability.</li>
            <li><strong>Functional cookies:</strong> Remember settings like language or interface preferences.</li>
            <li><strong>Marketing cookies:</strong> Support campaign measurement and ad relevance where enabled.</li>
          </ul>

          <h2>Managing Cookie Preferences</h2>
          <p>
            Most browsers let you control cookies through settings. You may block or delete cookies, but some
            website features may not function properly if essential cookies are disabled.
          </p>

          <h2>Third-Party Technologies</h2>
          <p>
            We may use trusted third-party services for analytics, performance monitoring, or advertising.
            Those services may set cookies in accordance with their own policies.
          </p>

          <h2>Contact</h2>
          <p>For cookie-related questions, contact privacy@thebroadpost.com.</p>
        </div>
      </section>
    </>
  );
}
