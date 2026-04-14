import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | The Broad Post</title>
        <meta
          name="description"
          content="Learn how The Broad Post collects, uses, stores, and protects your information."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Effective Date: April 14, 2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            At The Broad Post, your privacy matters to us. This Privacy Policy explains what information we
            collect, how we use it, and the choices you have when using our website.
          </p>

          <p>
            By accessing or using our website, you agree to the terms outlined in this policy.
          </p>

          <h2>Information We Collect</h2>
          <h3>Information You Provide</h3>
          <p>
            When you contact us or interact with the site, you may voluntarily share your name, email
            address, and any message or details you include.
          </p>

          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, certain data may be collected automatically, such as your IP
            address, browser type and device information, pages visited and time spent on the site, and
            referring URLs.
          </p>

          <h3>Cookies and Tracking Technologies</h3>
          <p>
            We use cookies and similar technologies to enhance your browsing experience and understand how
            our site is used.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to operate and maintain our website, improve content, layout,
            and user experience, respond to inquiries and communicate with users, monitor and analyze
            website performance, and prevent misuse and ensure security.
          </p>

          <p>
            We do not sell, trade, or rent your personal information to others.
          </p>

          <h2>Cookies Policy</h2>
          <p>
            Cookies are small data files stored on your device. We use cookies to support the features
            below.
          </p>
          <ul>
            <li>Remember user preferences</li>
            <li>Analyze traffic and usage patterns</li>
            <li>Support advertising and analytics tools</li>
          </ul>
          <p>
            You can choose to disable cookies through your browser settings. However, some parts of the
            website may not function properly.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party services that collect, monitor, and analyze user data. These may include
            Google Analytics for traffic analysis and advertising partners such as Google AdSense.
          </p>

          <p>
            These third parties have their own privacy policies governing how they use information.
          </p>

          <h2>Advertising and Google AdSense</h2>
          <p>
            We may display advertisements provided by third-party vendors, including Google AdSense. Google
            uses cookies, such as the DoubleClick cookie, to serve ads based on a user&apos;s prior visits to
            this and other websites. This allows ads to be more relevant to users.
          </p>

          <p>
            You can opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer">
              Google Ads Settings
            </a>
            . For more information on how Google manages data, visit{' '}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">
              Google&apos;s advertising policies
            </a>
            .
          </p>

          <h2>Data Protection</h2>
          <p>
            We take appropriate measures to protect your information from unauthorized access, alteration,
            or disclosure. However, no online platform can guarantee complete security.
          </p>

          <h2>External Links</h2>
          <p>
            Our website may contain links to other websites. We are not responsible for the privacy
            practices or content of external sites. We encourage users to review their privacy policies.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            The Broad Post does not knowingly collect personal information from children under the age of
            13. If such information is identified, we will take steps to remove it promptly.
          </p>

          <h2>Your Consent</h2>
          <p>
            By using our website, you consent to this Privacy Policy and agree to its terms.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be reflected on this page
            with an updated date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, you can contact
            us at <a href="mailto:thebroadpost01@gmail.com">thebroadpost01@gmail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
