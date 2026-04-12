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
          <p className="text-sm text-gray-500">Effective Date: April 7, 2025</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            This Privacy Policy ("Policy") governs the collection, processing, storage, and use of personal
            data by The Broad Post ("we," "us," or "our"), accessible at thebroadpost.com. By accessing or
            using the Website, you acknowledge that you have read, understood, and consent to the practices
            described in this Policy.
          </p>

          <h2>1. Introduction</h2>
          <p>
            This Policy applies to personal data collected through your use of the Website and related
            communications with The Broad Post.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide Voluntarily</h3>
          <p>
            This includes your name, email address, and any other personal information you submit when
            contacting us, subscribing to our newsletter, or otherwise communicating with us.
          </p>

          <h3>2.2 Automatically Collected Data</h3>
          <p>
            When you visit our Website, certain data may be collected automatically, including but not
            limited to your IP address, browser type and version, operating system, referring URLs, pages
            viewed, and time spent on the Website. This data is collected through standard server logs and
            third-party analytics services.
          </p>

          <h3>2.3 Cookies and Tracking Technologies</h3>
          <p>
            We use cookies and similar technologies to enhance functionality and gather usage data. Please
            refer to our Cookie Policy for further details.
          </p>

          <h2>3. Purpose of Data Processing</h2>
          <p>Personal data collected by The Broad Post is processed for the following purposes:</p>
          <ul>
            <li>(a) To operate, maintain, and improve the Website and its content;</li>
            <li>(b) To respond to inquiries and communications;</li>
            <li>(c) To deliver newsletters or updates to users who have expressly opted in;</li>
            <li>(d) To monitor and analyse Website traffic and usage patterns;</li>
            <li>(e) To comply with applicable legal obligations.</li>
          </ul>

          <h2>4. Disclosure of Personal Data</h2>
          <p>
            The Broad Post does not sell, rent, or trade personal data to third parties. We may disclose
            personal data to trusted third-party service providers who assist in the operation of the
            Website, subject to confidentiality obligations. We may also disclose personal data where
            required by law, court order, or governmental authority.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            Personal data is retained only for as long as necessary to fulfil the purposes for which it was
            collected, or as required by applicable law. Upon expiry of the applicable retention period,
            data will be securely deleted or anonymised.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            Subject to applicable law, you may have the right to: (a) access the personal data we hold about
            you; (b) request correction of inaccurate or incomplete data; (c) request deletion of your
            personal data; (d) withdraw consent to data processing at any time; and (e) lodge a complaint
            with a relevant data protection authority.
          </p>
          <p>
            To exercise any of the above rights, please submit a written request to
            <a href="mailto:thebroadpost01@gmail.com"> thebroadpost01@gmail.com</a>.
          </p>

          <h2>7. Data Security</h2>
          <p>
            We implement reasonable technical and organisational measures to protect personal data against
            unauthorised access, disclosure, alteration, or destruction. However, no method of transmission
            over the internet or electronic storage is entirely secure, and we cannot guarantee absolute
            security.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            The Website may contain links to third-party websites. This Policy does not apply to such
            third-party sites. The Broad Post bears no responsibility for the privacy practices or content of
            external websites, and we encourage users to review the privacy policies of any third-party sites
            they visit.
          </p>

          <h2>9. Amendments</h2>
          <p>
            We reserve the right to amend this Policy at any time. Any changes will be reflected by updating
            the Effective Date above. Continued use of the Website following the publication of amendments
            constitutes acceptance of the revised Policy.
          </p>

          <h2>10. Contact</h2>
          <p>
            For any questions or concerns regarding this Privacy Policy, please contact us at
            <a href="mailto:thebroadpost01@gmail.com"> thebroadpost01@gmail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
