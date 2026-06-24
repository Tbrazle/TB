import React from 'react';
import { Link } from 'react-router-dom';

const GALLERY_IMAGES = [
  {
    src: '/empress/empress-throne-hero.png',
    title: 'Upon the Golden Throne',
    description: 'The Empress in her element — gilded room, velvet, marble, candlelight.',
    size: 'large',
  },
  {
    src: '/empress/empress-portrait-close.png',
    title: 'Crimson & Sapphire',
    description: 'A close encounter with the Empress — red hair, blue eyes, black silk.',
    size: 'small',
  },
  {
    src: '/empress/empress-champagne.png',
    title: 'Champagne Ceremony',
    description: 'An elegant evening captured in marble and candlelight.',
    size: 'small',
  },
  {
    src: '/empress/empress-admirer-tier.png',
    title: 'From a Distance',
    description: 'The Empress, aloof and mysterious — for those who admire from afar.',
    size: 'small',
  },
  {
    src: '/empress/empress-devotee-tier.png',
    title: 'The Velvet Chair',
    description: 'Warm but commanding — a gaze that demands your devotion.',
    size: 'small',
  },
  {
    src: '/empress/empress-inner-circle-tier.png',
    title: 'The Marble Table',
    description: 'An intimate moment — champagne, candlelight, and a knowing smile.',
    size: 'small',
  },
  {
    src: '/empress/empress-tribute-card.png',
    title: 'Gold & Purple',
    description: 'Holding court in purple silk, a golden ornament in hand.',
    size: 'large',
  },
];

export default function EmpressGallery() {
  return (
    <div className="pt-24 pb-16 px-6 text-cream-100">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <p className="text-5xl mb-6">🖼️</p>
        <h1 className="font-display text-4xl md:text-5xl text-empress-400 mb-4">
          The Empress Gallery
        </h1>
        <p className="text-cream-300/50 max-w-xl mx-auto">
          Step into her world. Each image is a window into the realm of The Golden Empress
          — curated exclusively for those with refined taste.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {GALLERY_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-lg border border-empress-700/20 bg-[#0a0806] ${
                image.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className="relative w-full h-full min-h-[300px]">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-display text-lg text-empress-400 mb-1">{image.title}</h3>
                  <p className="text-cream-300/60 text-sm">{image.description}</p>
                </div>
                {/* Always-visible mobile caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden bg-gradient-to-t from-[#0a0806]/80 to-transparent">
                  <h3 className="font-display text-base text-empress-400">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto text-center mt-20 p-10 border border-empress-700/20 rounded-lg bg-gradient-to-b from-empress-700/5 to-transparent">
        <p className="text-empress-400 font-display text-lg mb-2">Want access to the full collection?</p>
        <p className="text-cream-300/40 text-sm mb-6">
          Exclusive photosets and videos are unlocked at the Devotee tier and above.
          The Inner Circle receives weekly curated content drops.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/empress/tiers"
            className="bg-empress-600 hover:bg-empress-500 text-white px-8 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
          >
            Upgrade Now
          </Link>
          <Link
            to="/empress/feed"
            className="border border-empress-600/50 hover:border-empress-500 text-empress-300 px-8 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
          >
            View Feed
          </Link>
        </div>
      </div>
    </div>
  );
}