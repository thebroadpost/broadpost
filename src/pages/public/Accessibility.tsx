import { Helmet } from 'react-helmet-async';

export default function Accessibility() {
  return (
    <>
      <Helmet>
        <title>Accessibility | BROADPOST</title>
        <meta
          name="description"
          content="Learn about BROADPOST's commitment to making our content accessible to everyone."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Accessibility</h1>
          <p className="text-sm text-gray-500">Last Reviewed: April 7, 2025</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            The Broad Post is committed to ensuring that its website, thebroadpost.com, is accessible to all
            users, including individuals with disabilities. We strive to meet internationally recognised
            accessibility standards to the greatest extent reasonably practicable.
          </p>

          <h2>1. Commitment to Accessibility</h2>
          <p>
            Accessibility is a core part of how we design and maintain our public content and interfaces.
          </p>

          <h2>2. Applicable Standards</h2>
          <p>
            The Broad Post aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA,
            as published by the World Wide Web Consortium (W3C). These guidelines set out four core
            principles for web accessibility: that content must be Perceivable, Operable, Understandable, and
            Robust.
          </p>

          <h2>3. Measures Taken</h2>
          <p>In pursuit of our accessibility commitment, we have implemented or are working to implement:</p>
          <ul>
            <li>(a) Use of semantic HTML structure with appropriate heading hierarchy to facilitate navigation by assistive technologies;</li>
            <li>(b) Provision of descriptive alternative text for non-decorative images;</li>
            <li>(c) Maintenance of adequate colour contrast ratios between text and background elements in accordance with WCAG 2.1 Level AA requirements;</li>
            <li>(d) Ensuring all interactive elements - including navigation menus, links, and form controls - are accessible via keyboard without requiring the use of a mouse;</li>
            <li>(e) Responsive design to support accessibility across a range of devices and screen sizes.</li>
          </ul>

          <h2>4. Known Limitations</h2>
          <p>
            While we make every reasonable effort to ensure accessibility across the Website, certain areas
            may not yet fully conform to the standards set out above. We are actively working to identify and
            remediate any such limitations. We do not warrant that all content will be accessible at all
            times, but we are committed to continuous improvement.
          </p>

          <h2>5. Feedback and Contact</h2>
          <p>
            If you experience any difficulty accessing content on the Website, or if you identify any
            accessibility barrier, we encourage you to notify us so that we may take appropriate remedial
            action. Please submit accessibility-related feedback to:
          </p>
          <p>
            Email: <a href="mailto:thebroadpost01@gmail.com">thebroadpost01@gmail.com</a>
            <br />
            Subject Line: Accessibility Feedback
          </p>
          <p>
            We will endeavour to acknowledge all accessibility-related communications promptly and to provide
            an appropriate response or resolution within a reasonable timeframe.
          </p>

          <h2>6. Enforcement</h2>
          <p>
            If you are not satisfied with our response to an accessibility complaint, you may have the right
            to escalate the matter to the relevant national regulatory authority or ombudsman responsible for
            digital accessibility in your jurisdiction.
          </p>
        </div>
      </section>
    </>
  );
}
