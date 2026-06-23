import React, { useEffect, useState } from 'react';
import { api, DailyChallenge } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DailyChallenge() {
  const { isPremium } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDailyChallenge()
      .then(d => {
        setChallenge(d.challenge);
        setCompleted(!!d.challenge?.completed);
        setReflection(d.challenge?.reflection || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async () => {
    if (!challenge) return;
    try {
      await api.completeChallenge(challenge.id, reflection);
      setCompleted(true);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anchor-600"></div></div>;

  if (!challenge) {
    return (
      <div className="card text-center py-12">
        <span className="text-4xl">📅</span>
        <h2 className="text-xl font-semibold text-gray-800 mt-3">No Challenge Today</h2>
        <p className="text-gray-500 mt-2">Check back tomorrow for a new challenge.</p>
      </div>
    );
  }

  if (challenge.locked) {
    return (
      <div className="card text-center py-12">
        <span className="text-4xl">🔒</span>
        <h2 className="text-xl font-semibold text-gray-800 mt-3">Premium Challenge</h2>
        <p className="text-gray-500 mt-2">Upgrade to access premium daily challenges.</p>
        <Link to="/pricing" className="btn-primary mt-4 inline-block">View Plans</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-2 text-sm text-anchor-600 mb-2">
          <span>⭐ Daily Challenge</span>
          <span>·</span>
          <span>{challenge.category}</span>
        </div>
        <h1 className="text-2xl font-bold text-anchor-900">{challenge.title}</h1>
        <p className="text-gray-600 mt-3 leading-relaxed">{challenge.description}</p>
      </div>

      {/* Reflection */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-2">Your Reflection</h2>
        <textarea
          className="input-field min-h-[120px] resize-y"
          placeholder="How did this challenge go? What did you learn?"
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          disabled={completed}
        />
      </div>

      {completed ? (
        <div className="card text-center">
          <span className="text-4xl">🎉</span>
          <p className="text-anchor-600 font-semibold mt-2">Challenge completed!</p>
        </div>
      ) : (
        <button onClick={handleComplete} className="btn-primary w-full py-3 text-lg">
          Complete Challenge
        </button>
      )}
    </div>
  );
}