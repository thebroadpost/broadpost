import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | BROADPOST</title>
        <meta
          name="description"
          content="Learn how BROADPOST collects, uses, and protects your personal information."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: March 29, 2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            BROADPOST Media LLC ("BROADPOST", "we", "us", or "our") values your privacy. This policy
            explains what data we collect, how we use it, and the choices you have.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect information you provide directly, including your name, email address, profile
            information, newsletter preferences, and messages you send through our services.
          </p>
          <p>
            We also collect limited technical data such as IP address, browser type, device details, pages
            visited, and interaction events for analytics, security, and performance monitoring.
          </p>

          <h2>How We Use Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Operate, maintain, and improve our website and services.</li>
            <li>Personalize your reading experience and account settings.</li>
            <li>Send newsletters, updates, and service-related communications.</li>
            <li>Detect fraud, abuse, and security incidents.</li>
            <li>Comply with legal obligations and enforce our terms.</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share information with trusted vendors that help
            us deliver hosting, analytics, email, and related services under contractual safeguards.
          </p>

          <h2>Data Retention</h2>
          <p>
            We keep personal information only as long as needed for the purposes described in this policy,
            unless a longer period is required by law.
          </p>

          <h2>Your Rights and Choices</h2>
          <p>
            Depending on your location, you may have rights to access, correct, delete, or limit the use of
            your personal information. You can also unsubscribe from marketing emails at any time.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy questions, requests, or complaints, contact us at privacy@thebroadpost.com.
          </p>
        </div>
      </section>
    </>
  );
}
