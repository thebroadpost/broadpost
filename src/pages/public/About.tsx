import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | BROADPOST</title>
        <meta
          name="description"
          content="Learn about The Broad Post, our editorial mission, and contact details."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">About Us</h1>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <h2>1. Company Overview</h2>
          <p>
            The Broad Post is an independent digital media publication operating under the domain
            thebroadpost.com. The publication is dedicated to the production and dissemination of news,
            editorial commentary, and informational content across a range of subjects including but not
            limited to current events, politics, culture, technology, and society.
          </p>

          <h2>2. Editorial Mission</h2>
          <p>
            The Broad Post is committed to delivering accurate, impartial, and well-researched content in
            accordance with accepted standards of responsible journalism. The publication operates
            independently and is not affiliated with any political party, governmental body, or commercial
            interest that may compromise its editorial integrity.
          </p>

          <h2>3. Contact Information</h2>
          <p>
            All formal correspondence, editorial inquiries, legal notices, and communications directed to
            The Broad Post shall be submitted via the following contact details:
          </p>
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
