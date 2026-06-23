import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, DailyChallenge, Lesson, Habit } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, isPremium } = useAuth();
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    api.getDailyChallenge().then(d => setChallenge(d.challenge)).catch(() => {});
    api.getLessons().then(d => setRecentLessons(d.lessons.slice(0, 3))).catch(() => {});
    api.getHabits().then(d => setHabits(d.habits)).catch(() => {});
  }, []);

  const todayHabits = habits.filter(h => !h.completed_today);
  const completedCount = habits.filter(h => h.completed_today).length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card">
        <h1 className="text-2xl font-bold text-anchor-900">
          Hey{user?.name ? `, ${user.name}` : ' there'} 👋
        </h1>
        <p className="text-gray-600 mt-1">Let's build better habits today.</p>
      </div>

      {/* Daily Challenge prompt */}
      {challenge && !challenge.completed && (
        <Link to="/daily-challenge" className="block card bg-gradient-to-r from-anchor-600 to-anchor-700 text-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-anchor-100 text-sm font-medium">Today's Challenge</p>
              <h2 className="text-lg font-semibold mt-1">{challenge.title}</h2>
            </div>
            <span className="text-3xl">⭐</span>
          </div>
        </Link>
      )}

      {/* Habits summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Today's Habits</h2>
          <Link to="/habits" className="text-sm text-anchor-600 hover:text-anchor-800">Manage</Link>
        </div>
        {habits.length === 0 ? (
          <p className="text-gray-500 text-sm">No habits yet. <Link to="/habits" className="text-anchor-600 underline">Add one</Link></p>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-1">
              {Array.from({ length: habits.length }).map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < completedCount ? 'bg-anchor-500' : 'bg-gray-200'}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">{completedCount}/{habits.length} habits done</p>
          </div>
        )}
      </div>

      {/* Recent lessons */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Continue Learning</h2>
          <Link to="/lessons" className="text-sm text-anchor-600 hover:text-anchor-800">View all</Link>
        </div>
        <div className="space-y-3">
          {recentLessons.length === 0 ? (
            <p className="text-gray-500 text-sm">No lessons yet.</p>
          ) : (
            recentLessons.map(lesson => (
              <Link key={lesson.id} to={`/lessons/${lesson.slug}`} className="block p-3 rounded-xl bg-anchor-50 hover:bg-anchor-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.category} · {lesson.estimated_minutes} min</p>
                  </div>
                  {lesson.is_premium && !isPremium && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium</span>
                  )}
                  {lesson.progress?.completed ? (
                    <span className="text-anchor-600">✓</span>
                  ) : (
                    <span className="text-gray-400">→</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Premium upsell */}
      {!isPremium && (
        <Link to="/pricing" className="block card border-2 border-anchor-200 bg-gradient-to-br from-white to-anchor-50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌟</span>
            <div>
              <h3 className="font-semibold text-anchor-800">Go Premium</h3>
              <p className="text-sm text-gray-600">Unlock all lessons, challenges, and advanced tracking.</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}