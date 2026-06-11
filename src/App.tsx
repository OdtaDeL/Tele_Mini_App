import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import LessonPage from './pages/LessonPage';
import RewardsPage from './pages/RewardsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ModuleManager from './pages/admin/ModuleManager';
import LessonManager from './pages/admin/LessonManager';
import UserManager from './pages/admin/UserManager';
import LeaderboardManager from './pages/admin/LeaderboardManager';
import NotificationToast from './components/NotificationToast';

function AppContent() {
  const { state } = useApp();

  if (state.isCheckingMembership) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0e1a',
        color: '#fff',
        gap: '16px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTop: '3px solid var(--color-accent-primary, #6c5ce7)',
          borderRadius: '50%',
        }} className="animate-spin"></div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #a0aec0)' }}>
          Verifying group membership...
        </p>
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
        minHeight: '100vh',
        background: '#0a0e1a',
        color: '#fff',
        gap: '20px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 10px rgba(108, 92, 231, 0.3))' }}>🔒</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Access Restricted</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary, #cbd5e0)', maxWidth: '280px', lineHeight: '1.5', margin: 0 }}>
          This Academy Learning Hub is exclusive to members of our Telegram Group. Please join the group to unlock access.
        </p>
        <button
          className="btn btn-primary"
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'linear-gradient(135deg, var(--color-accent-primary, #6c5ce7), var(--color-accent-secondary, #00cec9))',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)'
          }}
          onClick={() => {
            const tg = window.Telegram?.WebApp;
            if (tg) {
              (tg as any).openTelegramLink(groupLink);
            } else {
              window.open(groupLink, '_blank');
            }
          }}
        >
          Join Telegram Group
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NotificationToast />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/rewards" element={<RewardsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="modules" element={<ModuleManager />} />
          <Route path="lessons" element={<LessonManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="leaderboard" element={<LeaderboardManager />} />
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
      tg.ready();                    // Báo Telegram app đã load xong
      tg.expand();                   // Mở full screen
      tg.setHeaderColor('#0a0e1a'); // Dark header
      tg.setBackgroundColor('#0a0e1a');
      tg.enableClosingConfirmation(); // Hỏi trước khi đóng
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
