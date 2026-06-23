const API_BASE = '/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('anchor_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth
export const api = {
  // Auth
  signup: (email: string, password: string, name?: string) =>
    request<{ user: User; token: string }>('/auth/signup', { method: 'POST', body: { email, password, name } }),

  signin: (email: string, password: string) =>
    request<{ user: User; token: string }>('/auth/signin', { method: 'POST', body: { email, password } }),

  getMe: () => request<{ user: User }>('/auth/me'),

  updateProfile: (name: string) =>
    request<{ success: boolean }>('/auth/profile', { method: 'PUT', body: { name } }),

  // Content
  getLessons: () => request<{ lessons: Lesson[] }>('/content/lessons'),

  getLesson: (slug: string) => request<{ lesson: Lesson }>(`/content/lessons/${slug}`),

  completeLesson: (slug: string) =>
    request<{ success: boolean }>(`/content/lessons/${slug}/complete`, { method: 'POST' }),

  getDailyChallenge: () => request<{ challenge: DailyChallenge | null }>('/content/daily-challenge'),

  completeChallenge: (id: string, reflection?: string) =>
    request<{ success: boolean }>(`/content/daily-challenge/${id}/complete`, { method: 'POST', body: { reflection } }),

  seedCurriculum: () => request<{ success: boolean; lessons_seeded: number }>('/content/seed', { method: 'POST' }),

  // Habits
  getHabits: () => request<{ habits: Habit[] }>('/habits'),

  createHabit: (title: string, description?: string, category?: string) =>
    request<{ habit: Habit }>('/habits', { method: 'POST', body: { title, description, category } }),

  logHabit: (id: string) =>
    request<{ success: boolean; streak: number }>(`/habits/${id}/log`, { method: 'POST' }),

  deleteHabit: (id: string) =>
    request<{ success: boolean }>(`/habits/${id}`, { method: 'DELETE' }),

  // Subscription
  getSubscriptionStatus: () => request<{ subscription_status: string; subscription_tier: string; subscription_end: string | null }>('/subscription/status'),

  createCheckout: (plan: 'monthly' | 'yearly') =>
    request<{ url?: string; sessionId?: string; success?: boolean }>('/subscription/create-checkout', { method: 'POST', body: { plan } }),

  cancelSubscription: () =>
    request<{ success: boolean }>('/subscription/cancel', { method: 'POST' }),

  // Health
  health: () => request<{ status: string; version: string }>('/api/health'),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  subscription_status: string;
  subscription_tier: string;
  created_at?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  content?: string;
  estimated_minutes: number;
  is_premium: boolean;
  order_index: number;
  progress?: {
    completed: number;
    completed_at: string | null;
  };
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  is_premium: boolean;
  completed?: boolean;
  reflection?: string | null;
  locked?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: string;
  streak: number;
  completed_today: boolean;
  created_at?: string;
}