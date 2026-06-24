import React from 'react';
import { Link } from 'react-router-dom';

const STRIPE_LINKS = {
  admirer: 'https://buy.stripe.com/3cIeVd1bifZwe0v3NFfbq0p',
  devotee: 'https://buy.stripe.com/bJedR907e4gO8Gb97Zfbq0q',
  innerCircle: 'https://buy.stripe.com/7sY4gz07ecNkcWrfwnfbq0r',
  coffee: 'https://buy.stripe.com/14A14n07eeVsg8Dbg7fbq0f',
  champagne: 'https://buy.stripe.com/aFa6oHf289B8bSndoffbq0i',
};

export default function EmpressHome() {
  return (
    <div className="text-cream-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/empress/empress-throne-hero.png"
            alt="The Golden Empress on her throne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0806]/90 via-[#0a0806]/70 to-[#0a0806]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-transparent to-[#0a0806]/30" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-empress-400 mb-4 tracking-tight text-shadow-lg">
              The Golden<br />Empress
            </h1>
            <p className="text-xl md:text-2xl text-cream-300/80 font-light tracking-widest uppercase mb-8">
              You may kneel
            </p>
            <p className="text-base md:text-lg text-cream-300/60 max-w-xl mx-auto mb-12 leading-relaxed">
              She commands from a throne of gold and shadow. Her world is gilded, her standards absolute.
              Join an exclusive circle of devotees who understand that true luxury is earned — not bought.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={STRIPE_LINKS.innerCircle}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-empress-600 hover:bg-empress-500 text-white px-8 py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 shadow-lg shadow-empress-600/20"
              >
                Join the Inner Circle
              </a>
              <Link
                to="/empress/tiers"
                className="border border-empress-600/50 hover:border-empress-500 text-empress-300 px-8 py-4 rounded text-sm tracking-widest uppercase transition-all duration-300"
              >
                View Tiers
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-empress-400/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-empress-400/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* About / Portrait Section */}
      <section className="py-24 px-6 bg-[#0a0806]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/empress/empress-portrait-close.png"
              alt="The Golden Empress portrait"
              className="w-full h-auto rounded-lg shadow-2xl shadow-empress-700/20"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-empress-500/20 rounded-lg -z-10" />
          </div>
          <div>
            <p className="text-empress-500 text-sm tracking-[0.3em] uppercase mb-4">Her Presence</p>
            <h2 className="font-display text-3xl md:text-4xl text-empress-400 mb-6">
              Crowned in Fire. Bathed in Gold.
            </h2>
            <p className="text-cream-300/50 leading-relaxed mb-6">
              Crimson hair. Sapphire eyes. A smile that promises nothing and demands everything.
              She moves through shadows of velvet and gold — untouchable, unforgettable,
              undeniable.
            </p>
            <p className="text-cream-300/40 leading-relaxed">
              Every queen deserves a court. Every throne deserves devotion. Enter her realm
              — where tribute becomes privilege, and admiration becomes purpose.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/empress/gallery"
                className="text-empress-400 hover:text-empress-300 text-sm tracking-widest uppercase transition-colors"
              >
                View Gallery →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ethos Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-empress-500 text-sm tracking-[0.3em] uppercase mb-4">The Philosophy</p>
            <h2 className="font-display text-3xl md:text-4xl text-empress-400 mb-6">
              Luxury Has a Price — Pay It.
            </h2>
            <p className="text-cream-300/50 leading-relaxed max-w-2xl mx-auto">
              In a world of the ordinary, The Golden Empress stands apart. Every moment in her presence
              is a privilege earned through devotion. This is not for everyone — only for those who
              understand the value of exclusivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-8 border border-empress-700/20 rounded-lg bg-white/[0.02]">
              <p className="text-3xl mb-4">✨</p>
              <h3 className="font-display text-empress-400 text-lg mb-3">Exclusive Access</h3>
              <p className="text-cream-300/40 text-sm leading-relaxed">
                A curated experience for the select few who recognize true royalty.
              </p>
            </div>
            <div className="text-center p-8 border border-empress-700/20 rounded-lg bg-white/[0.02]">
              <p className="text-3xl mb-4">💎</p>
              <h3 className="font-display text-empress-400 text-lg mb-3">Luxury Content</h3>
              <p className="text-cream-300/40 text-sm leading-relaxed">
                Daily affirmations, exclusive galleries, and personalized attention from the Empress herself.
              </p>
            </div>
            <div className="text-center p-8 border border-empress-700/20 rounded-lg bg-white/[0.02]">
              <p className="text-3xl mb-4">👑</p>
              <h3 className="font-display text-empress-400 text-lg mb-3">Royal Treatment</h3>
              <p className="text-cream-300/40 text-sm leading-relaxed">
                From personalized messages to custom content — earn the Empress's attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tribute CTA Section with Image */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/empress/empress-tribute-card.png"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0806]/95 via-[#0a0806]/80 to-[#0a0806]/95" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-empress-500 text-sm tracking-[0.3em] uppercase mb-4">Show Your Devotion</p>
          <h2 className="font-display text-3xl md:text-4xl text-empress-400 mb-4">
            Send a Tribute
          </h2>
          <p className="text-cream-300/50 mb-10 max-w-lg mx-auto">
            Actions speak louder than words. Show the Empress she has your attention.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={STRIPE_LINKS.coffee}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 border border-empress-700/30 text-cream-200 px-6 py-3 rounded text-sm tracking-wider transition-all duration-300"
            >
              ☕ Coffee — $25
            </a>
            <a
              href={STRIPE_LINKS.champagne}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 border border-empress-700/30 text-cream-200 px-6 py-3 rounded text-sm tracking-wider transition-all duration-300"
            >
              🥂 Champagne — $500
            </a>
            <Link
              to="/empress/tribute"
              className="bg-empress-600/20 hover:bg-empress-600/30 border border-empress-500/50 text-empress-300 px-6 py-3 rounded text-sm tracking-wider transition-all duration-300"
            >
              All Tribute Options →
            </Link>
          </div>
        </div>
      </section>

      {/* Tiers Preview */}
      <section className="py-24 px-6 bg-[#0a0806]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-empress-500 text-sm tracking-[0.3em] uppercase mb-4">Membership</p>
            <h2 className="font-display text-3xl md:text-4xl text-empress-400 mb-4">
              Choose Your Path
            </h2>
            <p className="text-cream-300/50 max-w-xl mx-auto">
              Each tier brings you closer to the Empress. The question is — how devoted are you?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Admirer */}
            <div className="border border-empress-700/20 rounded-lg overflow-hidden bg-white/[0.02] flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src="/empress/empress-admirer-tier.png"
                  alt="Admirer tier"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-display text-xl text-empress-400 mb-1">Admirer</h3>
                <p className="text-2xl font-bold text-cream-100 mb-2">$9.99<small className="text-cream-300/40 text-sm font-normal">/mo</small></p>
                <p className="text-cream-300/40 text-sm mb-6">Step into her world. Watch from the shadows.</p>
                <ul className="space-y-3 text-sm text-cream-300/60 mb-8 flex-1">
                  <li className="flex items-start gap-2">✓ Daily posts & updates</li>
                  <li className="flex items-start gap-2">✓ AI-generated luxury gallery</li>
                  <li className="flex items-start gap-2">✓ Confidence & abundance content</li>
                  <li className="flex items-start gap-2">✓ Weekly affirmations</li>
                  <li className="flex items-start gap-2">✓ Community feed access</li>
                </ul>
                <a
                  href={STRIPE_LINKS.admirer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-empress-600/50 hover:border-empress-500 text-empress-300 px-6 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Subscribe
                </a>
              </div>
            </div>

            {/* Devotee */}
            <div className="border border-empress-500/30 rounded-lg overflow-hidden bg-gradient-to-b from-empress-700/5 to-transparent flex flex-col relative">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-empress-600 text-white text-xs px-4 py-1 rounded-full tracking-widest uppercase z-10">
                Most Popular
              </div>
              <div className="h-48 overflow-hidden">
                <img
                  src="/empress/empress-devotee-tier.png"
                  alt="Devotee tier"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-display text-xl text-empress-400 mb-1">Devotee</h3>
                <p className="text-2xl font-bold text-cream-100 mb-2">$29.99<small className="text-cream-300/40 text-sm font-normal">/mo</small></p>
                <p className="text-cream-300/40 text-sm mb-6">Closer. Warmer. More exclusive.</p>
                <ul className="space-y-3 text-sm text-cream-300/60 mb-8 flex-1">
                  <li className="flex items-start gap-2">✓ Everything in Admirer</li>
                  <li className="flex items-start gap-2">✓ Exclusive photo sets</li>
                  <li className="flex items-start gap-2">✓ Exclusive short videos</li>
                  <li className="flex items-start gap-2">✓ Weekly personalized text</li>
                  <li className="flex items-start gap-2">✓ Priority message responses</li>
                </ul>
                <a
                  href={STRIPE_LINKS.devotee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-empress-600 hover:bg-empress-500 text-white px-6 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-empress-600/20"
                >
                  Subscribe
                </a>
              </div>
            </div>

            {/* Inner Circle */}
            <div className="border border-empress-700/20 rounded-lg overflow-hidden bg-white/[0.02] flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src="/empress/empress-inner-circle-tier.png"
                  alt="Inner Circle tier"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="font-display text-xl text-empress-400 mb-1">Inner Circle</h3>
                <p className="text-2xl font-bold text-cream-100 mb-2">$99<small className="text-cream-300/40 text-sm font-normal">/mo</small></p>
                <p className="text-cream-300/40 text-sm mb-6">The throne room door opens for you.</p>
                <ul className="space-y-3 text-sm text-cream-300/60 mb-8 flex-1">
                  <li className="flex items-start gap-2">✓ Everything in Devotee</li>
                  <li className="flex items-start gap-2">✓ Weekly personalized video</li>
                  <li className="flex items-start gap-2">✓ Weekly private chat access</li>
                  <li className="flex items-start gap-2">✓ Custom affirmation recordings</li>
                  <li className="flex items-start gap-2">✓ Priority content access</li>
                </ul>
                <a
                  href={STRIPE_LINKS.innerCircle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center border border-empress-600/50 hover:border-empress-500 text-empress-300 px-6 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
                >
                  Subscribe
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/empress/tiers"
              className="inline-block border border-empress-600/30 hover:border-empress-500 text-empress-300 px-8 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
            >
              Full Tier Comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-t from-[#0a0806] to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-5xl mb-6">👑</p>
          <h2 className="font-display text-3xl md:text-4xl text-empress-400 mb-4">
            Your Empress Awaits
          </h2>
          <p className="text-cream-300/50 mb-8 max-w-md mx-auto">
            The throne room is open. The question is not whether you're worthy — it's whether
            you're ready to prove it.
          </p>
          <a
            href={STRIPE_LINKS.innerCircle}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-empress-600 hover:bg-empress-500 text-white px-10 py-4 rounded text-sm tracking-widest uppercase transition-all duration-300 shadow-lg shadow-empress-600/20"
          >
            Begin Your Journey
          </a>
        </div>
      </section>
    </div>
  );
}