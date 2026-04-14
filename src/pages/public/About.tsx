import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | The Broad Post</title>
        <meta
          name="description"
          content="Learn about The Broad Post, what we cover, and how to get in touch with our team."
        />
      </Helmet>

      <section className="max-w-4xl mx-auto px-4 py-16 md:py-20">
        <header className="mb-10 border-b border-border pb-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">About Us</h1>
          <p className="text-gray-700">
            Welcome to The Broad Post.
          </p>
        </header>

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p>
            We started this platform with a simple idea - to create a space where people can quickly
            understand what is happening around the world without going through complicated or boring
            content.
          </p>

          <p>
            In today&apos;s fast-moving digital world, there is too much information and not enough clarity.
            At The Broad Post, we try to fix that by sharing news, tech updates, and trending stories in a
            way that is easy to read, relevant, and actually useful.
          </p>

          <h2>What We Do</h2>
          <p>
            At The Broad Post, we cover a wide range of topics to keep you informed and updated, including:
          </p>
          <ul>
            <li>Technology and innovation</li>
            <li>Artificial Intelligence and future tech</li>
            <li>World news and global affairs</li>
            <li>Business, startups, and entrepreneurship</li>
            <li>Finance and market trends</li>
            <li>Social media and internet culture</li>
            <li>Viral and trending stories</li>
            <li>Gadgets, apps, and digital tools</li>
            <li>Science and emerging discoveries</li>
            <li>Lifestyle and modern digital living</li>
          </ul>

          <p>
            We do not just report what is happening - we focus on breaking it down in a simple way and
            adding context, so you understand why it matters.
          </p>

          <h2>Who We Are</h2>
          <p>
            The Broad Post is run by Vansh Gupta and Akash Rawat.
          </p>
          <p>
            We are building this platform with a focus on consistency, learning, and improving every day.
            Like any growing project, we are constantly working on making our content better, more
            reliable, and more valuable for our readers.
          </p>

          <h2>Our Approach</h2>
          <p>We believe:</p>
          <ul>
            <li>Content should be clear, not confusing</li>
            <li>Information should be useful, not just fast</li>
            <li>Readers should leave with understanding, not questions</li>
          </ul>
          <p>
            That is what we aim for with every post.
          </p>

          <h2>Get in Touch</h2>
          <p>
            If you have feedback, suggestions, or just want to connect, feel free to reach out.
          </p>
          <p>
            Email: <a href="mailto:thebroadpost01@gmail.com">thebroadpost01@gmail.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
