import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/daily-challenge', label: 'Challenge', icon: '⭐' },
  { path: '/lessons', label: 'Lessons', icon: '📚' },
  { path: '/habits', label: 'Habits', icon: '✅' },
  { path: '/account', label: 'Account', icon: '👤' },
];

export default function Layout() {
  const location = useLocation();
  const { user, signout } = useAuth();

  return (
    <div className="min-h-screen bg-buildmode-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-buildmode-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <span className="font-semibold text-buildmode-800 text-lg">Build Mode</span>
          </Link>
          <div className="flex items-center gap-3">
            {user?.subscription_status !== 'active' && (
              <Link to="/pricing" className="text-sm text-buildmode-600 hover:text-buildmode-800 font-medium">
                Upgrade
              </Link>
            )}
            <button onClick={signout} className="text-sm text-gray-500 hover:text-gray-700">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-buildmode-100 z-40">
        <div className="max-w-4xl mx-auto px-2 flex justify-around">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 text-xs rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'text-buildmode-700 font-semibold'
                  : 'text-gray-500 hover:text-buildmode-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}