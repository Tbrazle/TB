import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { path: '/empress', label: 'Home' },
  { path: '/empress/tiers', label: 'Membership' },
  { path: '/empress/tribute', label: 'Tribute' },
];

export default function EmpressLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0806] text-cream-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0806]/95 backdrop-blur-sm border-b border-empress-700/30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/empress" className="flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <span className="font-display text-xl tracking-wider text-empress-300 font-bold">
              The Golden Empress
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-empress-400'
                    : 'text-cream-300/60 hover:text-empress-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://buy.stripe.com/7sY4gz07ecNkcWrfwnfbq0r"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-empress-600 hover:bg-empress-500 text-white px-5 py-2 rounded text-xs tracking-widest uppercase transition-all duration-300"
            >
              Join Now
            </a>
          </div>
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-empress-400'
                    : 'text-cream-300/60 hover:text-empress-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0806] border-t border-empress-700/20 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-3xl mb-4">👑</p>
          <p className="font-display text-lg text-empress-400 mb-2">The Golden Empress</p>
          <p className="text-cream-300/40 text-sm tracking-wider">
            Luxury has a price — pay it.
          </p>
          <div className="mt-6 flex justify-center gap-6">
            <Link to="/empress" className="text-cream-300/40 hover:text-empress-400 text-xs tracking-widest uppercase transition-colors">
              Home
            </Link>
            <Link to="/empress/tiers" className="text-cream-300/40 hover:text-empress-400 text-xs tracking-widest uppercase transition-colors">
              Membership
            </Link>
            <Link to="/empress/tribute" className="text-cream-300/40 hover:text-empress-400 text-xs tracking-widest uppercase transition-colors">
              Tribute
            </Link>
          </div>
          <p className="mt-8 text-cream-300/20 text-xs">
            &copy; {new Date().getFullYear()} The Golden Empress. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}