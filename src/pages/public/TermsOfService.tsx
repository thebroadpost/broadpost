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
          <p className="text-sm text-gray-500">Effective Date: April 7, 2025</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and
            The Broad Post ("we," "us," or "our"), governing your access to and use of the website located at
            thebroadpost.com ("Website"). By accessing or using the Website, you agree to be bound by these
            Terms. If you do not agree, you must discontinue use of the Website immediately.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            Use of the Website signifies your acceptance of these Terms and all applicable laws.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            By using this Website, you represent and warrant that you are at least 13 years of age and
            possess the legal capacity to enter into this agreement. If you are accessing the Website on
            behalf of an organisation, you represent that you have the authority to bind that organisation to
            these Terms.
          </p>

          <h2>3. Permitted Use</h2>
          <p>The Website is provided for lawful, personal, and non-commercial use only. Users agree not to:</p>
          <ul>
            <li>(a) Use the Website in any manner that violates applicable local, national, or international laws or regulations;</li>
            <li>(b) Reproduce, duplicate, copy, distribute, or commercially exploit any content from the Website without prior written consent;</li>
            <li>(c) Attempt to gain unauthorised access to any part of the Website or its underlying infrastructure;</li>
            <li>(d) Transmit any unsolicited or unauthorised advertising or promotional material;</li>
            <li>(e) Engage in any conduct that restricts or inhibits any other person's use or enjoyment of the Website.</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>
            All content published on the Website - including but not limited to articles, graphics, logos,
            layout, and code - is the exclusive property of The Broad Post or its respective licensors and is
            protected by applicable intellectual property laws. Nothing in these Terms shall be construed as
            conferring any licence or right to use any content without the prior written permission of The
            Broad Post. Users may share individual articles with proper attribution and a direct hyperlink to
            the original publication. Full reproduction of content without written authorisation is strictly
            prohibited.
          </p>

          <h2>5. User Submissions</h2>
          <p>
            By submitting any content to The Broad Post - including tips, correspondence, or commentary - you
            grant us a non-exclusive, royalty-free, worldwide licence to use, edit, reproduce, and publish
            such content in any medium. You represent and warrant that any submitted content is original to
            you and does not infringe the intellectual property or other rights of any third party.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The Website and all content therein are provided on an "as is" and "as available" basis without
            warranties of any kind, express or implied. The Broad Post makes no representations or warranties
            regarding the accuracy, completeness, or reliability of any content published on the Website.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, The Broad Post, its editors, contributors, and
            affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive
            damages arising out of or in connection with your use of or inability to use the Website or its
            content.
          </p>

          <h2>8. Third-Party Links</h2>
          <p>
            The Website may contain hyperlinks to third-party websites for informational purposes only. The
            Broad Post does not endorse, control, or assume responsibility for the content, privacy practices,
            or availability of such external sites.
          </p>

          <h2>9. Modifications</h2>
          <p>
            The Broad Post reserves the right to modify these Terms at any time at its sole discretion.
            Updated Terms will be published on this page with a revised Effective Date. Continued use of the
            Website following any modification constitutes acceptance of the revised Terms.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable law. Any disputes
            arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts
            in the applicable jurisdiction.
          </p>

          <h2>11. Contact</h2>
          <p>
            For any questions relating to these Terms of Service, please contact us at
            <a href="mailto:thebroadpost01@gmail.com"> thebroadpost01@gmail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
