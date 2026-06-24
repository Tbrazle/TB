import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Lessons from './pages/Lessons';
import LessonView from './pages/LessonView';
import Habits from './pages/Habits';
import DailyChallenge from './pages/DailyChallenge';
import Account from './pages/Account';
import Pricing from './pages/Pricing';

// Empress imports
import EmpressLayout from './pages/empress/EmpressLayout';
import EmpressHome from './pages/empress/EmpressHome';
import EmpressTiers from './pages/empress/EmpressTiers';
import EmpressTribute from './pages/empress/EmpressTribute';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-buildmode-600"></div></div>;
  if (!user) return <Navigate to="/signin" />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-buildmode-600"></div></div>;
  if (user) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/pricing" element={<PublicRoute><Pricing /></PublicRoute>} />

        {/* The Golden Empress public pages */}
        <Route element={<EmpressLayout />}>
          <Route path="/empress" element={<EmpressHome />} />
          <Route path="/empress/tiers" element={<EmpressTiers />} />
          <Route path="/empress/tribute" element={<EmpressTribute />} />
        </Route>

        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:slug" element={<LessonView />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/account" element={<Account />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}