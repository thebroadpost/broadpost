import { Helmet } from 'react-helmet-async';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact | BROADPOST</title>
        <meta
          name="description"
          content="Contact The Broad Post for editorial inquiries, legal notices, and formal correspondence."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Contact</h1>
          <p className="text-gray-700">
            All formal correspondence, editorial inquiries, legal notices, and communications directed to
            The Broad Post shall be submitted via the following contact details.
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            Website: <a href="https://thebroadpost.com" target="_blank" rel="noreferrer">thebroadpost.com</a>
            <br />
            Email: <a href="mailto:thebroadpost01@gmail.com">thebroadpost01@gmail.com</a>
          </p>

          <p>
            The Broad Post endeavours to respond to all formal communications within a reasonable timeframe.
          </p>
        </div>
      </section>
    </>
  );
}
