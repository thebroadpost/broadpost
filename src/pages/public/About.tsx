import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../../components/ui/Badge';

const editorialPrinciples = [
  {
    title: 'Clarity Over Noise',
    description:
      'We translate market and policy complexity into reporting that leaders can act on quickly.',
  },
  {
    title: 'Proof Before Opinion',
    description:
      'Every analysis starts with data, source verification, and context that survives scrutiny.',
  },
  {
    title: 'Global, Not Generic',
    description:
      'Our coverage connects local events to global capital, technology, and geopolitical shifts.',
  },
];

const coverageDesks = [
  {
    name: 'Business & Economy',
    summary: 'Corporate strategy, macro trends, monetary policy, and private market movements.',
  },
  {
    name: 'Tech & Innovation',
    summary: 'AI, enterprise software, semiconductors, and the infrastructure shaping tomorrow.',
  },
  {
    name: 'Politics & Policy',
    summary: 'Regulation, elections, and decisions that redefine risk for industries and nations.',
  },
  {
    name: 'Culture & Lifestyle',
    summary: 'Consumer behavior, creator economies, and the social currents influencing demand.',
  },
];

const newsroomMilestones = [
  {
    year: '2021',
    detail: 'BROADPOST began as an editorial experiment focused on high-conviction analysis.',
  },
  {
    year: '2023',
    detail: 'Expanded into a multi-desk newsroom with dedicated business and innovation coverage.',
  },
  {
    year: '2025',
    detail: 'Launched reader accounts, curated alerts, and personalized reading experiences.',
  },
  {
    year: '2026',
    detail: 'Scaled a daily publishing rhythm built for executives, operators, and informed citizens.',
  },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | BROADPOST</title>
        <meta
          name="description"
          content="Learn how BROADPOST delivers sharp insight, rigorous analysis, and trusted opinion across business, technology, policy, and culture."
        />
      </Helmet>

      <div className="relative overflow-hidden bg-background">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-gray-100 to-transparent" aria-hidden="true" />
        <div className="absolute right-0 top-24 h-52 w-52 rounded-full bg-accent-blue/10 blur-3xl" aria-hidden="true" />
        <div className="absolute left-10 top-56 h-40 w-40 rounded-full bg-accent-red/10 blur-3xl" aria-hidden="true" />

        <section className="relative max-w-[1200px] mx-auto px-4 lg:px-6 pt-20 pb-14">
          <div className="max-w-3xl">
            <Badge variant="red" className="mb-6">About BROADPOST</Badge>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary leading-[0.95] tracking-tight mb-6">
              Reporting Built
              <br />
              for Decision Makers
            </h1>
            <p className="font-sans text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
              BROADPOST is where deep reporting meets strategic clarity. We cover the stories behind the
              headlines and explain what they mean for business leaders, investors, and globally minded readers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {editorialPrinciples.map((principle) => (
              <article
                key={principle.title}
                className="group border border-border bg-white/90 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">{principle.title}</h2>
                <p className="font-sans text-sm text-gray-700 leading-relaxed">{principle.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative max-w-[1200px] mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 bg-primary text-white p-8 md:p-10">
              <p className="font-sans uppercase tracking-[0.2em] text-[11px] text-gray-300 mb-4">Mission</p>
              <p className="font-serif text-3xl md:text-4xl leading-tight">
                To equip leaders and curious readers with insight they can trust, use, and act on.
              </p>
              <p className="font-sans text-sm leading-relaxed text-gray-300 mt-6">
                We do this through deeply sourced reporting, disciplined analysis, and opinion that is
                transparent about assumptions.
              </p>
            </div>

            <div className="lg:col-span-3 border border-border bg-white p-8 md:p-10">
              <p className="font-sans uppercase tracking-[0.2em] text-[11px] text-accent-blue mb-4">What We Cover</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {coverageDesks.map((desk) => (
                  <article key={desk.name} className="border-l-2 border-primary/70 pl-4">
                    <h3 className="font-serif text-2xl font-bold text-primary mb-2">{desk.name}</h3>
                    <p className="font-sans text-sm text-gray-700 leading-relaxed">{desk.summary}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100/70 border-y border-border mt-12">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-14">
            <div className="flex items-center justify-between gap-4 border-b border-primary/30 pb-4 mb-10">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">Newsroom Timeline</h2>
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-accent-blue">Built With Intention</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsroomMilestones.map((milestone) => (
                <article key={milestone.year} className="bg-white border border-border p-6 md:p-7">
                  <p className="font-sans text-xs font-bold tracking-[0.16em] uppercase text-accent-red mb-3">
                    {milestone.year}
                  </p>
                  <p className="font-serif text-2xl text-primary leading-snug">{milestone.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 lg:px-6 py-16 md:py-20">
          <div className="border-2 border-primary p-8 md:p-12 lg:p-14 bg-white relative overflow-hidden">
            <div className="absolute inset-y-0 right-0 w-2 bg-accent-red" aria-hidden="true" />
            <p className="font-sans uppercase tracking-[0.22em] text-[11px] text-accent-blue mb-5">Editorial Note</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight max-w-4xl text-primary">
              We are not trying to be the loudest publication. We are building the one you return to when the stakes are real.
            </h2>
            <p className="font-sans text-base md:text-lg text-gray-700 leading-relaxed mt-7 max-w-3xl">
              If you care about signal over hype, BROADPOST was made for you. Thank you for reading,
              challenging us, and helping shape the next chapter of independent digital journalism.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
