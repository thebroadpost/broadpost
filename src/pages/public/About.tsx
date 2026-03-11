import React from 'react';

export function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-10 text-center">
        About BROADPOST
      </h1>
      
      <div className="prose-custom">
        <p className="text-2xl text-gray-600 leading-relaxed font-medium mb-10 text-center">
          Every idea needs a medium. We believe that good ideas deserve to be found.
        </p>
        
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop" 
          alt="Team collaborating" 
          className="w-full h-80 object-cover rounded-2xl mb-12"
        />

        <p>
          BROADPOST is an open platform where readers find dynamic thinking, and where expert and undiscovered voices can share their writing on any topic. Our purpose is to spread these ideas and deepen understanding of the world.
        </p>

        <p>
          We're creating a new model for digital publishing. One that supports nuance, complexity, and vital storytelling without giving in to the incentives of advertising. It's an environment that's open to everyone but promotes substance and authenticity.
        </p>

        <h3>Our Mission</h3>
        <p>
          To empower voices from around the globe to connect, inform, and inspire without the noise of traditional media outlets. We focus on typography, whitespace, and the purest reading experience.
        </p>

        <h3>Join Us</h3>
        <p>
          Whether you are an established author or just starting to share your thoughts, BROADPOST provides the audience and the aesthetic. Write your first post today by clicking the 'Write' button in the navigation bar.
        </p>
      </div>
    </div>
  );
}
