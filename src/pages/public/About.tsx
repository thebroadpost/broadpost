import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../../components/ui/Badge';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | BROADPOST</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="red" className="mb-6">The Publication</Badge>
          <h1 className="font-serif font-bold text-5xl md:text-7xl text-primary leading-tight mb-8">
            Inside BROADPOST
          </h1>
          <p className="font-sans text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            "Insight. Analysis. Opinion." The premier digital destination for deep analysis, breaking business news, and unparalleled editorial insight.
          </p>
        </div>

        <div className="prose prose-lg max-w-none font-sans text-gray-700 leading-loose mb-20 space-y-6">
          <p className="text-2xl font-serif text-primary mb-8 font-medium">
            Founded with the belief that a premium perspective is necessary in today's noisy media landscape, BROADPOST delivers rigorous analysis that stands above the fray.
          </p>

          <p>
            Our journalists and contributors span the globe, offering on-the-ground reporting combined with high-level strategic analysis. We don't just report the news; we explain what it means for markets, businesses, and global economies.
          </p>
          <p>
            Whether it's deep dives into tech sector disruption, exclusive interviews with fortune 500 CEOs, or trenchant geopolitical commentary, our editorial standards remain uncompromising.
          </p>
        </div>

        <hr className="border-t-2 border-primary mb-16" />

        <div className="mb-20">
          <h2 className="font-serif font-bold text-4xl text-primary mb-12 text-center">Our Mission</h2>
          <div className="bg-gray-100 p-12 text-center border border-border">
            <p className="font-serif text-2xl italic text-primary max-w-2xl mx-auto leading-relaxed">
              "To equip the world's leaders, innovators, and thinkers with the unparalleled insight necessary to navigate an increasingly complex global economy."
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-serif font-bold text-4xl text-primary mb-12 text-center">Editorial Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Editor 1 */}
            <div className="group text-center">
              <div className="w-48 h-48 mx-auto grayscale group-hover:grayscale-0 transition-all duration-500 rounded-full overflow-hidden mb-6 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" alt="Editor" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-primary mb-2">James Vance</h3>
              <p className="font-sans font-bold uppercase text-xs tracking-widest text-accent-blue mb-4">Editor-in-Chief</p>
              <p className="text-sm text-gray-500 px-4">Former Bureau Chief for global finance, bringing three decades of market analysis.</p>
            </div>
            
            {/* Editor 2 */}
            <div className="group text-center">
              <div className="w-48 h-48 mx-auto grayscale group-hover:grayscale-0 transition-all duration-500 rounded-full overflow-hidden mb-6 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Editor" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-primary mb-2">Sarah Chen</h3>
              <p className="font-sans font-bold uppercase text-xs tracking-widest text-accent-blue mb-4">Managing Editor, Tech</p>
              <p className="text-sm text-gray-500 px-4">Award-winning tech reporter focusing on AI and enterprise software disruption.</p>
            </div>

            {/* Editor 3 */}
            <div className="group text-center lg:col-span-1 md:col-span-2 md:w-1/2 lg:w-full mx-auto">
              <div className="w-48 h-48 mx-auto grayscale group-hover:grayscale-0 transition-all duration-500 rounded-full overflow-hidden mb-6 bg-gray-200">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80" alt="Editor" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-primary mb-2">Michael Sterling</h3>
              <p className="font-sans font-bold uppercase text-xs tracking-widest text-accent-blue mb-4">Senior Editor, Markets</p>
              <p className="text-sm text-gray-500 px-4">Leading voice on global equities and macro-economic trends.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
