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
          <p className="text-sm text-gray-500">Effective Date: April 7, 2025</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            This Cookie Policy explains how The Broad Post ("we," "us," or "our") uses cookies and similar
            tracking technologies on our website located at thebroadpost.com ("Website"). This Policy should
            be read in conjunction with our Privacy Policy.
          </p>

          <h2>1. Introduction</h2>
          <p>
            This Policy describes the purpose and categories of cookies used across the Website.
          </p>

          <h2>2. What Are Cookies</h2>
          <p>
            Cookies are small text files placed on your device by a website server. They are widely used to
            enable websites to function correctly, to improve efficiency, and to provide analytical
            information to website operators. Cookies may be "session cookies" (which expire when you close
            your browser) or "persistent cookies" (which remain on your device for a defined period or until
            manually deleted).
          </p>

          <h2>3. Categories of Cookies We Use</h2>
          <h3>3.1 Strictly Necessary Cookies</h3>
          <p>
            These cookies are essential to the operation of the Website and cannot be disabled. They enable
            core functionality such as page navigation and security. The Website cannot function properly
            without these cookies.
          </p>

          <h3>3.2 Analytics and Performance Cookies</h3>
          <p>
            We use third-party analytics services, including Google Analytics, to collect aggregated and
            anonymised data about how users interact with the Website. This information assists us in
            improving the Website's performance and content. These services may set their own cookies and are
            subject to their respective privacy policies.
          </p>

          <h3>3.3 Functional Cookies</h3>
          <p>
            These cookies allow the Website to remember choices you have made - such as display preferences -
            in order to provide a more personalised experience. Disabling these cookies may affect certain
            features of the Website.
          </p>

          <h2>4. Third-Party Cookies</h2>
          <p>
            Certain content or functionality embedded within the Website, including social media integrations
            and analytics tools, may be provided by third parties who set their own cookies on your device.
            The Broad Post does not control these third-party cookies. Please refer to the relevant
            third-party privacy and cookie policies for further information.
          </p>

          <h2>5. Managing Cookies</h2>
          <p>
            You may manage, restrict, or delete cookies at any time through your browser settings. Most
            browsers allow you to refuse cookies, accept cookies from specific websites, or receive
            notification before a cookie is placed. Please note that restricting certain cookies may impair
            the functionality of the Website. For guidance on managing cookies in commonly used browsers,
            please refer to the help documentation provided by your browser provider.
          </p>

          <h2>6. Amendments</h2>
          <p>
            We reserve the right to update this Cookie Policy at any time. Any amendments will be reflected
            by updating the Effective Date above. Continued use of the Website following the publication of
            any changes constitutes your acceptance of the revised Policy.
          </p>

          <h2>7. Contact</h2>
          <p>
            If you have any questions regarding our use of cookies, please contact us at
            <a href="mailto:thebroadpost01@gmail.com"> thebroadpost01@gmail.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
