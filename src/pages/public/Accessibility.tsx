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
          <p className="text-sm text-gray-500">Last updated: March 29, 2026</p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            BROADPOST is committed to providing a website that is accessible to the widest possible audience,
            regardless of technology or ability.
          </p>

          <h2>Our Commitment</h2>
          <p>
            We work to align with recognized accessibility standards and continuously improve readability,
            keyboard navigation, contrast, and semantic structure across our content and interfaces.
          </p>

          <h2>Accessibility Features</h2>
          <ul>
            <li>Responsive layouts that support desktop and mobile devices.</li>
            <li>Keyboard-accessible navigation and interactive controls.</li>
            <li>Text alternatives for meaningful non-text content where available.</li>
            <li>Consistent structure and headings to support assistive technologies.</li>
          </ul>

          <h2>Ongoing Improvements</h2>
          <p>
            Accessibility is an ongoing process. We regularly review our pages, templates, and components to
            identify and fix barriers.
          </p>

          <h2>Need Help?</h2>
          <p>
            If you encounter an accessibility issue, contact accessibility@thebroadpost.com with details of
            the page and problem so we can improve your experience.
          </p>
        </div>
      </section>
    </>
  );
}
