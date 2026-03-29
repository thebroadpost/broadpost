import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | BROADPOST</title>
        <meta
          name="description"
          content="Review the terms that govern your use of BROADPOST services."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: March 29, 2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            These Terms of Service ("Terms") govern your use of BROADPOST websites, products, and services.
            By using our services, you agree to these Terms.
          </p>

          <h2>Eligibility and Accounts</h2>
          <p>
            You must be legally able to enter into a binding agreement to use our services. You are
            responsible for safeguarding your account credentials and for all activity under your account.
          </p>

          <h2>Acceptable Use</h2>
          <p>You agree not to misuse our services, including by:</p>
          <ul>
            <li>Violating applicable laws or regulations.</li>
            <li>Attempting unauthorized access to systems or data.</li>
            <li>Posting harmful, abusive, or deceptive content.</li>
            <li>Interfering with service reliability or security.</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            All content and materials provided by BROADPOST are owned by or licensed to BROADPOST and are
            protected by intellectual property laws. You may not reproduce or distribute content without
            permission except as allowed by law.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our services may link to third-party sites. We are not responsible for their content, policies,
            or practices.
          </p>

          <h2>Disclaimers and Liability</h2>
          <p>
            Services are provided on an "as is" and "as available" basis. To the maximum extent permitted by
            law, BROADPOST disclaims warranties and limits liability for indirect, incidental, or
            consequential damages.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use after changes become effective means
            you accept the revised Terms.
          </p>

          <h2>Contact</h2>
          <p>For legal inquiries, contact legal@thebroadpost.com.</p>
        </div>
      </section>
    </>
  );
}
