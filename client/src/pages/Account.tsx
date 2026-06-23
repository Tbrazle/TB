import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user, signout } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getSubscriptionStatus().then(setSubscription).catch(() => {});
  }, []);

  const saveName = async () => {
    try {
      await api.updateProfile(name);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { console.error(err); }
  };

  const cancelSub = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      await api.cancelSubscription();
      setSubscription({ subscription_status: 'cancelled', subscription_tier: 'free', subscription_end: null });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-buildmode-900">Account</h1>
      </div>

      {/* Profile */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input type="email" className="input-field bg-gray-50" value={user?.email || ''} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Name</label>
            <div className="flex gap-2">
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} />
              <button onClick={saveName} className="btn-primary whitespace-nowrap">{saved ? 'Saved!' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">Subscription</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              Status: <span className={`font-medium ${subscription?.subscription_status === 'active' ? 'text-buildmode-600' : 'text-gray-500'}`}>
                {subscription?.subscription_status || 'free'}
              </span>
            </p>
            {subscription?.subscription_tier && subscription.subscription_tier !== 'free' && (
              <p className="text-sm text-gray-500 mt-1">Plan: {subscription.subscription_tier}</p>
            )}
          </div>
          {subscription?.subscription_status === 'active' ? (
            <button onClick={cancelSub} className="text-sm text-red-500 hover:underline">Cancel</button>
          ) : (
            <Link to="/pricing" className="btn-primary text-sm">Upgrade</Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-buildmode-700">--</div>
            <div className="text-xs text-gray-500">Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-buildmode-700">--</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-buildmode-700">--</div>
            <div className="text-xs text-gray-500">Habits</div>
          </div>
        </div>
      </div>

      <button onClick={signout} className="w-full py-2.5 text-gray-500 hover:text-red-600 text-sm transition-colors">
        Sign out
      </button>
    </div>
  );
}