import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, Lesson } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Lessons() {
  const { isPremium } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.getLessons()
      .then(d => setLessons(d.lessons))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(lessons.map(l => l.category))];
  const filtered = category === 'all' ? lessons : lessons.filter(l => l.category === category);
  const completedLessons = lessons.filter(l => l.progress?.completed).length;

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-buildmode-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-buildmode-900">Lessons</h1>
        <p className="text-gray-600 mt-1">{completedLessons}/{lessons.length} completed</p>
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-buildmode-500 rounded-full transition-all" style={{ width: `${lessons.length ? (completedLessons / lessons.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              category === c ? 'bg-buildmode-600 text-white' : 'bg-white text-gray-600 border border-buildmode-200 hover:bg-buildmode-50'
            }`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Lesson list */}
      <div className="space-y-3">
        {filtered.map(lesson => (
          <Link key={lesson.id} to={`/lessons/${lesson.slug}`} className="card block hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                  {lesson.is_premium && !isPremium && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{lesson.category}</span>
                  <span>{lesson.estimated_minutes} min</span>
                </div>
              </div>
              <div className="ml-4">
                {lesson.progress?.completed ? (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-buildmode-100 text-buildmode-700 text-sm">✓</span>
                ) : lesson.is_premium && !isPremium ? (
                  <span className="text-lg">🔒</span>
                ) : (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 text-sm">→</span>
                )}
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">No lessons found in this category.</p>
        )}
      </div>
    </div>
  );
}