import React from 'react';
import { Link } from 'react-router-dom';

const FEED_POSTS = [
  {
    id: 1,
    type: 'affirmation',
    title: 'Morning Affirmation',
    body: 'Some men dream of queens. Others serve them. Today, ask yourself which one you are — and act accordingly.',
    author: 'The Golden Empress',
    timestamp: '2 hours ago',
    tier: 'All Tiers',
    likes: 47,
  },
  {
    id: 2,
    type: 'exclusive',
    title: 'Behind the Velvet Curtain',
    body: 'A glimpse of what awaits those who kneel. The throne room is lit with a thousand candles tonight — each one a tribute from a devoted soul.',
    author: 'The Golden Empress',
    timestamp: '5 hours ago',
    tier: 'Devotee+',
    likes: 89,
  },
  {
    id: 3,
    type: 'image',
    title: 'Gold Hour',
    body: 'When the light catches the crown just right. This is what royalty looks like.',
    author: 'The Golden Empress',
    timestamp: 'Yesterday',
    tier: 'All Tiers',
    likes: 124,
  },
  {
    id: 4,
    type: 'personal',
    title: 'To My Inner Circle',
    body: 'You have earned my attention. This week\'s personal message is being prepared — check your private feed tomorrow at midnight. I expect you there.',
    author: 'The Golden Empress',
    timestamp: 'Yesterday',
    tier: 'Inner Circle',
    likes: 34,
  },
  {
    id: 5,
    type: 'challenge',
    title: 'This Week\'s Challenge',
    body: 'Prove your devotion. Send a tribute before the week ends, and I may acknowledge you personally in my next post. Let\'s see who wants it most.',
    author: 'The Golden Empress',
    timestamp: '2 days ago',
    tier: 'All Tiers',
    likes: 56,
  },
  {
    id: 6,
    type: 'wisdom',
    title: 'Luxury Thinking',
    body: 'Luxury has a price — pay it. Abundance flows to those who understand that value and cost are not the same thing. You get what you have the courage to ask for.',
    author: 'The Golden Empress',
    timestamp: '3 days ago',
    tier: 'All Tiers',
    likes: 73,
  },
];

function PostBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    'All Tiers': 'bg-empress-700/30 text-empress-300 border-empress-700/50',
    'Devotee+': 'bg-empress-600/30 text-empress-200 border-empress-500/50',
    'Inner Circle': 'bg-empress-500/30 text-empress-200 border-empress-400/50',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${colors[tier] || colors['All Tiers']}`}>
      {tier}
    </span>
  );
}

export default function EmpressFeed() {
  return (
    <div className="pt-24 pb-16 px-6 text-cream-100">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-5xl mb-6">📜</p>
        <h1 className="font-display text-4xl md:text-5xl text-empress-400 mb-4">
          The Empress Feed
        </h1>
        <p className="text-cream-300/50 max-w-lg mx-auto">
          Daily dispatches from the throne. Affirmations. Challenges. Exclusive content.
          This is where the Empress speaks directly to her court.
        </p>
      </div>

      {/* Feed */}
      <div className="max-w-3xl mx-auto space-y-6">
        {FEED_POSTS.map((post) => (
          <article
            key={post.id}
            className="border border-empress-700/20 rounded-lg p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">👑</span>
                <div>
                  <p className="text-sm font-medium text-empress-300">{post.author}</p>
                  <p className="text-xs text-cream-300/30">{post.timestamp}</p>
                </div>
              </div>
              <PostBadge tier={post.tier} />
            </div>

            <h2 className="font-display text-lg text-empress-400 mb-2">{post.title}</h2>
            <p className="text-cream-300/60 leading-relaxed text-sm">{post.body}</p>

            {post.type === 'image' && (
              <div className="mt-4 h-48 bg-empress-700/10 rounded-lg flex items-center justify-center border border-empress-700/10">
                <div className="text-center">
                  <img
                    src="/empress/empress-champagne.png"
                    alt="Gold Hour"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-empress-700/10">
              <button className="flex items-center gap-1 text-cream-300/40 hover:text-empress-400 text-xs transition-colors">
                <span>♡</span> <span>{post.likes}</span>
              </button>
              <button className="text-cream-300/40 hover:text-empress-400 text-xs transition-colors">
                Reply
              </button>
              <button className="text-cream-300/40 hover:text-empress-400 text-xs transition-colors">
                Share
              </button>
              <span className="ml-auto text-xs text-cream-300/20">
                {post.type}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto text-center mt-16 p-8 border border-empress-700/20 rounded-lg bg-gradient-to-b from-empress-700/5 to-transparent">
        <p className="text-empress-400 font-display text-lg mb-2">Missing something?</p>
        <p className="text-cream-300/40 text-sm mb-6">
          Some posts are exclusive to higher tiers. Upgrade to unlock the full feed
          and receive personal messages from the Empress.
        </p>
        <Link
          to="/empress/tiers"
          className="inline-block bg-empress-600 hover:bg-empress-500 text-white px-8 py-3 rounded text-xs tracking-widest uppercase transition-all duration-300"
        >
          View Membership Tiers
        </Link>
      </div>
    </div>
  );
}