import React from 'react';

const TRIBUTES = [
  { label: 'Coffee', amount: '$25', emoji: '☕', link: 'https://buy.stripe.com/14A14n07eeVsg8Dbg7fbq0f', description: 'A small token to start your day in her thoughts.' },
  { label: 'Luxury', amount: '$50', emoji: '✨', link: 'https://buy.stripe.com/fZu8wPcU03cK9Kfckbfbq0g', description: 'Acknowledgment of her奢华 influence in your life.' },
  { label: "Queen's Choice", amount: '$200', emoji: '👑', link: 'https://buy.stripe.com/fZu7sL2fm00y8Gb2JBfbq0h', description: 'Leave it to the Empress to decide what she deserves.' },
  { label: 'Champagne', amount: '$500', emoji: '🥂', link: 'https://buy.stripe.com/aFa6oHf289B8bSndoffbq0i', description: 'Toast to her magnificence with a proper tribute.' },
  { label: 'Spoil Me', amount: '$1,000', emoji: '💎', link: 'https://buy.stripe.com/5kQbJ17zGfZw9Kf97Zfbq0j', description: 'For those who understand that royalty demands the finest.' },
];

const CUSTOM_CONTENT = [
  { label: 'Custom Voice Note', amount: '$50+', emoji: '🎤', link: 'https://buy.stripe.com/14AaEX8DK7t08Gb2JBfbq0k', description: 'A personalized voice note from the Empress, just for you.' },
  { label: 'Custom Video Message', amount: '$100+', emoji: '🎬', link: 'https://buy.stripe.com/cNidR99HO7t03lRgArfbq0l', description: 'See and hear the Empress deliver your专属 message.' },
  { label: 'Custom Photo Set', amount: '$150+', emoji: '📸', link: 'https://buy.stripe.com/14AdR9g6c8x43lR4RJfbq0m', description: 'A curated set of luxury photos tailored to your taste.' },
  { label: 'Luxury Motivation Package', amount: '$200+', emoji: '🔥', link: 'https://buy.stripe.com/3cI8wPcU05kSf4z4RJfbq0n', description: 'Get motivated by the Empress herself with a complete luxury package.' },
  { label: 'VIP Monthly Package', amount: '$550+', emoji: '💫', link: 'https://buy.stripe.com/8x23cv07e14C09Fac3fbq0o', description: 'The ultimate experience — full month of curated VIP treatment.' },
];

export default function EmpressTribute() {
  return (
    <div className="pt-24 pb-16 px-6 text-cream-100">
      {/* Tributes Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <p className="text-5xl mb-6">👑</p>
        <h1 className="font-display text-4xl md:text-5xl text-empress-400 mb-4">
          Send a Tribute
        </h1>
        <p className="text-cream-300/50 max-w-lg mx-auto mb-4">
          Actions speak louder than words. Choose your tribute and show the Empress
          that you understand her worth.
        </p>
        <p className="text-cream-300/30 text-sm italic">
          "Luxury has a price — pay it."
        </p>
      </div>

      {/* Tribute Buttons */}
      <div className="max-w-3xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-4">
          {TRIBUTES.map((tribute) => (
            <a
              key={tribute.label}
              href={tribute.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 border border-empress-700/20 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] hover:border-empress-500/50 transition-all duration-300"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {tribute.emoji}
              </span>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-empress-300">{tribute.label}</h3>
                  <span className="text-empress-400 font-bold">{tribute.amount}</span>
                </div>
                <p className="text-cream-300/40 text-sm mt-1">{tribute.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Custom Content Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-empress-500 text-sm tracking-[0.3em] uppercase mb-4">Inner Circle</p>
          <h2 className="font-display text-3xl md:text-4xl text-empress-400 mb-4">
            Custom Content
          </h2>
          <p className="text-cream-300/50 max-w-lg mx-auto">
            For those who have earned the right to request the Empress's personal touch.
            Inner Circle members and approved subscribers only.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {CUSTOM_CONTENT.map((item) => (
            <a
              key={item.label}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 border border-empress-700/20 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] hover:border-empress-500/50 transition-all duration-300"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                {item.emoji}
              </span>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-empress-300">{item.label}</h3>
                  <span className="text-empress-400 font-bold">{item.amount}</span>
                </div>
                <p className="text-cream-300/40 text-sm mt-1">{item.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12 p-8 border border-empress-700/20 rounded-lg bg-gradient-to-b from-empress-700/5 to-transparent">
          <p className="text-empress-400 font-display text-lg mb-2">Not an Inner Circle member yet?</p>
          <p className="text-cream-300/40 text-sm mb-6">
            Custom content is reserved for those who have proven their devotion.
            Upgrade to Inner Circle to unlock personalized experiences.
          </p>
          <a
            href="https://buy.stripe.com/7sY4gz07ecNkcWrfwnfbq0r"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-empress-600 hover:bg-empress-500 text-white px-8 py-3 rounded text-sm tracking-widest uppercase transition-all duration-300"
          >
            Join Inner Circle — $99/mo
          </a>
        </div>
      </div>
    </div>
  );
}