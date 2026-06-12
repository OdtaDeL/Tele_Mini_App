import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import LessonPage from './pages/LessonPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ModuleManager from './pages/admin/ModuleManager';
import LessonManager from './pages/admin/LessonManager';
import UserManager from './pages/admin/UserManager';

function AppContent() {
  const { state } = useApp();

  if (state.isCheckingMembership) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: 'var(--bg-base)',
        gap: 12,
      }}>
        <div style={{
          width: 24, height: 24,
          border: '2px solid var(--border-mid)',
          borderTopColor: 'var(--gold)',
          borderRadius: '50%',
        }} className="animate-spin" />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Verifying membership…</p>
      </div>
    );
  }

  if (!state.isMember) {
    const groupLink = import.meta.env.VITE_GROUP_LINK || 'https://t.me/your_group_username';
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: 'var(--bg-base)',
        padding: '32px 24px',
        textAlign: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', marginBottom: 4,
        }}>⊘</div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: 8 }}>
            Members Only
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', maxWidth: 260, lineHeight: 1.55 }}>
            This learning hub is exclusive to members of our Telegram group.
          </p>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: 8 }}
          onClick={() => {
            const tg = window.Telegram?.WebApp;
            if (tg) { (tg as any).openTelegramLink(groupLink); }
            else { window.open(groupLink, '_blank'); }
          }}
        >
          Join the Group
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="modules" element={<ModuleManager />} />
          <Route path="lessons" element={<LessonManager />} />
          <Route path="users" element={<UserManager />} />
        </Route>
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#08080a');
      tg.setBackgroundColor('#08080a');
      tg.enableClosingConfirmation();
    }
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
