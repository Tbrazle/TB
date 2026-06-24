import React from 'react';
import { Link } from 'react-router-dom';

const STRIPE_LINKS = {
  admirer: 'https://buy.stripe.com/3cIeVd1bifZwe0v3NFfbq0p',
  devotee: 'https://buy.stripe.com/bJedR907e4gO8Gb97Zfbq0q',
  innerCircle: 'https://buy.stripe.com/7sY4gz07ecNkcWrfwnfbq0r',
};

const TIERS = [
  {
    id: 'admirer',
    name: 'Admirer',
    price: '$9.99',
    emoji: '👁️',
    description: 'For those who wish to observe from afar.',
    featured: false,
    features: [
      { text: 'Daily posts and updates', included: true },
      { text: 'AI-generated luxury photo gallery', included: true },
      { text: 'Confidence and abundance content', included: true },
      { text: 'Weekly affirmations', included: true },
      { text: 'Community feed access', included: true },
      { text: 'Exclusive photo sets', included: false },
      { text: 'Exclusive short videos', included: false },
      { text: 'Weekly personalized text', included: false },
      { text: 'Priority message responses', included: false },
      { text: 'Weekly personalized video', included: false },
      { text: 'Weekly private chat access', included: false },
      { text: 'Custom affirmation recordings', included: false },
      { text: 'Priority content access', included: false },
    ],
    stripeLink: STRIPE_LINKS.admirer,
  },
  {
    id: 'devotee',
    name: 'Devotee',
    price: '$29.99',
    emoji: '🔥',
    description: 'For those ready to step closer to the throne.',
    featured: true,
    features: [
      { text: 'Daily posts and updates', included: true },
      { text: 'AI-generated luxury photo gallery', included: true },
      { text: 'Confidence and abundance content', included: true },
      { text: 'Weekly affirmations', included: true },
      { text: 'Community feed access', included: true },
      { text: 'Exclusive photo sets', included: true },
      { text: 'Exclusive short videos', included: true },
      { text: 'Weekly personalized text', included: true },
      { text: 'Priority message responses', included: true },
      { text: 'Weekly personalized video', included: false },
      { text: 'Weekly private chat access', included: false },
      { text: 'Custom affirmation recordings', included: false },
      { text: 'Priority content access', included: false },
    ],
    stripeLink: STRIPE_LINKS.devotee,
  },
  {
    id: 'inner-circle',
    name: 'Inner Circle',
    price: '$99',
    emoji: '👑',
    description: 'For those worthy of the Empress\'s personal attention.',
    featured: false,
    features: [
      { text: 'Daily posts and updates', included: true },
      { text: 'AI-generated luxury photo gallery', included: true },
      { text: 'Confidence and abundance content', included: true },
      { text: 'Weekly affirmations', included: true },
      { text: 'Community feed access', included: true },
      { text: 'Exclusive photo sets', included: true },
      { text: 'Exclusive short videos', included: true },
      { text: 'Weekly personalized text', included: true },
      { text: 'Priority message responses', included: true },
      { text: 'Weekly personalized video', included: true },
      { text: 'Weekly private chat access', included: true },
      { text: 'Custom affirmation recordings', included: true },
      { text: 'Priority content access', included: true },
    ],
    stripeLink: STRIPE_LINKS.innerCircle,
  },
];

function FeatureRow({ text, included }: { text: string; included: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${included ? 'text-cream-300/70' : 'text-cream-300/20'}`}>
      <span className={included ? 'text-empress-400' : 'text-cream-300/20'}>
        {included ? '✓' : '—'}
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}

export default function EmpressTiers() {
  return (
    <div className="pt-24 pb-16 px-6 text-cream-100">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <p className="text-5xl mb-6">👑</p>
        <h1 className="font-display text-4xl md:text-5xl text-empress-400 mb-4">
          Choose Your Path
        </h1>
        <p className="text-cream-300/50 max-w-xl mx-auto">
          Every tier brings you closer to the Empress. The higher your devotion,
          the more of her world opens to you. Choose wisely — your place in her court
          reflects your ambition.
        </p>
      </div>

      {/* Tiers */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-lg p-8 flex flex-col relative ${
              tier.featured
                ? 'border border-empress-500/40 bg-gradient-to-b from-empress-700/10 to-transparent'
                : 'border border-empress-700/20 bg-white/[0.02]'
            }`}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-empress-600 text-white text-xs px-4 py-1 rounded-full tracking-widest uppercase whitespace-nowrap">
                Most Popular
              </div>
            )}
            <p className="text-3xl mb-4">{tier.emoji}</p>
            <h2 className="font-display text-2xl text-empress-400 mb-1">{tier.name}</h2>
            <p className="text-3xl font-bold text-cream-100 mb-1">{tier.price}<small className="text-cream-300/40 text-sm font-normal">/mo</small></p>
            <p className="text-cream-300/40 text-sm mb-8">{tier.description}</p>

            <div className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, i) => (
                <FeatureRow key={i} text={feature.text} included={feature.included} />
              ))}
            </div>

            <a
              href={tier.stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center py-3 rounded text-xs tracking-widest uppercase transition-all duration-300 ${
                tier.featured
                  ? 'bg-empress-600 hover:bg-empress-500 text-white shadow-lg shadow-empress-600/20'
                  : 'border border-empress-600/50 hover:border-empress-500 text-empress-300'
              }`}
            >
              Subscribe — {tier.price}/mo
            </a>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-2xl mx-auto text-center mt-20 p-10 border border-empress-700/20 rounded-lg bg-gradient-to-b from-empress-700/5 to-transparent">
        <p className="text-empress-400 font-display text-lg mb-2">Not sure which tier is right for you?</p>
        <p className="text-cream-300/40 text-sm mb-6">
          Start as an Admirer and work your way up. The Empress rewards ambition and devotion.
          Or send a tribute to show your intent before committing.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/empress/tribute"
            className="border border-empress-600/50 hover:border-empress-500 text-empress-300 px-6 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
          >
            Send a Tribute
          </Link>
          <a
            href={STRIPE_LINKS.admirer}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-empress-600/30 hover:bg-empress-600/40 border border-empress-500/30 text-empress-200 px-6 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
          >
            Start as Admirer
          </a>
        </div>
      </div>
    </div>
  );
}