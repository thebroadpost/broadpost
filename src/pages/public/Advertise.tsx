import { Helmet } from 'react-helmet-async';
import { ArrowRight, BarChart3, Mail, Megaphone, ShieldCheck, Sparkles, Target } from 'lucide-react';

const placementOptions = [
  {
    title: 'Sponsored content',
    description: 'Thoughtfully branded articles that fit the voice of the publication and support your campaign goals.',
  },
  {
    title: 'Display advertising',
    description: 'Premium visibility across the site for launches, awareness campaigns, and ongoing brand presence.',
  },
  {
    title: 'Collaborations',
    description: 'Flexible partnerships for product launches, editorial features, newsletter placements, and custom activations.',
  },
];

const partnershipHighlights = [
  {
    icon: Target,
    title: 'Right-sized audience fit',
    description: 'Reach readers interested in business, technology, markets, opinion, and practical digital change.',
  },
  {
    icon: ShieldCheck,
    title: 'Editorial integrity',
    description: 'We separate advertising opportunities from newsroom judgment so campaigns are reviewed with clarity.',
  },
  {
    icon: BarChart3,
    title: 'Clear collaboration flow',
    description: 'A simple process from first email to campaign confirmation, with timelines and deliverables defined early.',
  },
];

const processSteps = [
  'Share your brand, objective, and preferred placement through email.',
  'We review the fit, timing, and available partnership options.',
  'If aligned, we confirm scope, creative needs, and launch dates.',
];

export default function Advertise() {
  return (
    <>
      <Helmet>
        <title>Advertise | BROADPOST</title>
        <meta
          name="description"
          content="Partner with BROADPOST for advertisements, sponsored content, and brand collaborations. Connect at thebroadpost01@gmail.com."
        />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent-blue/30 blur-3xl" />
          <div className="absolute left-0 top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <Megaphone className="h-4 w-4" />
                Media partnerships and advertising
              </div>
              <h1 className="mt-6 font-serif text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Advertise with a publication built for attention and trust.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">
                BROADPOST works with brands, founders, agencies, and organizations that want thoughtful placement
                alongside editorial content readers actually spend time with.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:thebroadpost01@gmail.com?subject=Advertising%20Inquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-primary transition-colors hover:bg-white/90"
                >
                  <Mail className="h-4 w-4" />
                  Start a partnership
                </a>
                <a
                  href="#placements"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
                >
                  View options
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">Direct contact</p>
                <p className="mt-2 text-lg font-medium">
                  For advertisements and collaborations connect at{' '}
                  <a href="mailto:thebroadpost01@gmail.com" className="underline decoration-white/40 underline-offset-4 hover:text-white">
                    thebroadpost01@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {partnershipHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/75">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="placements" className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-sm font-medium text-primary dark:bg-white/10 dark:text-white">
              <Sparkles className="h-4 w-4" />
              Why partner with BROADPOST
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary md:text-5xl dark:text-white">
              A clean, editorial environment for brand visibility.
            </h2>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
              We keep the collaboration process straightforward. If your brand fits the audience and the timing,
              we can shape a placement that feels relevant rather than disruptive.
            </p>
          </div>

          <div className="grid gap-4">
            {placementOptions.map((option) => (
              <article key={option.title} className="rounded-3xl border border-border bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-800">
                <h3 className="text-2xl font-bold text-primary dark:text-white">{option.title}</h3>
                <p className="mt-3 text-base leading-7 text-gray-700 dark:text-gray-300">{option.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800/60 border-y border-border dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step} className="rounded-3xl border border-border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  {index + 1}
                </div>
                <p className="mt-4 text-lg leading-8 text-gray-700 dark:text-gray-300">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="rounded-[2rem] border border-primary/10 bg-primary text-white p-8 md:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-accent-blue blur-3xl" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold md:text-5xl">Ready to discuss a placement?</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
                Send us your campaign details and we will reply with the next step. We welcome direct inquiries
                from brands, agencies, and collaborators looking for a tailored opportunity.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:thebroadpost01@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-primary transition-colors hover:bg-white/90"
              >
                <Mail className="h-4 w-4" />
                thebroadpost01@gmail.com
              </a>
              <div className="text-sm text-white/70">
                Include your brand name, timeline, budget range, and preferred placement type.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
