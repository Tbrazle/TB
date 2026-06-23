import React, { useEffect, useState } from 'react';
import { api, Habit } from '../api';

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('general');

  const loadHabits = () => {
    api.getHabits().then(d => setHabits(d.habits)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadHabits(); }, []);

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.createHabit(newTitle.trim(), '', newCategory);
      setNewTitle('');
      loadHabits();
    } catch (err) { console.error(err); }
  };

  const toggleHabit = async (id: string) => {
    try {
      await api.logHabit(id);
      loadHabits();
    } catch (err) { console.error(err); }
  };

  const deleteHabit = async (id: string) => {
    try {
      await api.deleteHabit(id);
      loadHabits();
    } catch (err) { console.error(err); }
  };

  const completedToday = habits.filter(h => h.completed_today).length;
  const categories = ['general', 'health', 'mindset', 'relationships', 'finance', 'career'];

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anchor-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-anchor-900">Habits</h1>
        <p className="text-gray-600 mt-1">{completedToday}/{habits.length} done today</p>
      </div>

      {/* Add habit */}
      <form onSubmit={addHabit} className="card">
        <div className="flex gap-2">
          <input type="text" className="input-field flex-1" placeholder="New habit..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <select className="input-field w-32" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="btn-primary whitespace-nowrap">Add</button>
        </div>
      </form>

      {/* Habit list */}
      <div className="space-y-2">
        {habits.map(habit => (
          <div key={habit.id} className="card flex items-center gap-3 py-3">
            <button onClick={() => toggleHabit(habit.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                habit.completed_today ? 'bg-anchor-500 border-anchor-500 text-white' : 'border-gray-300 hover:border-anchor-400'
              }`}
            >
              {habit.completed_today && <span className="text-xs">✓</span>}
            </button>
            <div className="flex-1">
              <span className={`font-medium ${habit.completed_today ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {habit.title}
              </span>
              <span className="text-xs text-gray-400 ml-2">🔥 {habit.streak} day streak</span>
            </div>
            <span className="text-xs text-gray-400 capitalize">{habit.category}</span>
            <button onClick={() => deleteHabit(habit.id)} className="text-gray-300 hover:text-red-500 transition-colors">✕</button>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="card text-center py-8">
            <span className="text-4xl">✅</span>
            <p className="text-gray-500 mt-2">No habits yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}