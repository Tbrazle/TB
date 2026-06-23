import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, Lesson } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LessonView() {
  const { slug } = useParams<{ slug: string }>();
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.getLesson(slug)
      .then(d => {
        setLesson(d.lesson);
        setCompleted(!!d.lesson.progress?.completed);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleComplete = async () => {
    if (!slug) return;
    try {
      await api.completeLesson(slug);
      setCompleted(true);
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anchor-600"></div></div>;
  if (error) return <div className="card text-red-600">{error}</div>;
  if (!lesson) return <div className="card text-gray-500">Lesson not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/lessons" className="text-sm text-anchor-600 hover:underline inline-flex items-center gap-1">
        ← Back to lessons
      </Link>

      <div className="card">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>{lesson.category}</span>
          <span>·</span>
          <span>{lesson.estimated_minutes} min</span>
          {lesson.is_premium && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">Premium</span>}
        </div>
        <h1 className="text-2xl font-bold text-anchor-900">{lesson.title}</h1>
        <p className="text-gray-600 mt-2">{lesson.description}</p>

        {/* Locked premium overlay */}
        {lesson.is_premium && !isPremium && (
          <div className="mt-6 p-6 bg-amber-50 rounded-xl text-center">
            <span className="text-4xl">🔒</span>
            <h3 className="font-semibold text-gray-800 mt-3">Premium Lesson</h3>
            <p className="text-sm text-gray-600 mt-1">Subscribe to unlock this lesson and more.</p>
            <Link to="/pricing" className="btn-primary mt-4 inline-block">View Plans</Link>
          </div>
        )}

        {/* Lesson content */}
        {(!lesson.is_premium || isPremium) && (
          <div className="mt-6 prose prose-sm max-w-none">
            {lesson.content ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{lesson.content}</div>
            ) : (
              <p className="text-gray-500 italic">Full lesson content coming soon.</p>
            )}
          </div>
        )}

        {/* Mark complete */}
        {(!lesson.is_premium || isPremium) && (
          <div className="mt-6 pt-6 border-t border-anchor-100">
            {completed ? (
              <div className="text-center">
                <span className="text-anchor-600 font-medium flex items-center justify-center gap-2">
                  ✓ Completed
                </span>
              </div>
            ) : (
              <button onClick={handleComplete} className="btn-primary w-full">
                Mark as Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}