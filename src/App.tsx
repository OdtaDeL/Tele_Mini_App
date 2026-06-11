import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
      </BrowserRouter>
    </AppProvider>
  );
}
