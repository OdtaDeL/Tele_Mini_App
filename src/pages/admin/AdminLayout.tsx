import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const adminTabs = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/modules', label: 'Modules', icon: '📚' },
  { path: '/admin/lessons', label: 'Lessons', icon: '📖' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/leaderboard', label: 'Rankings', icon: '🏆' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="page" style={{ paddingBottom: '20px' }}>
      {/* Header */}
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate('/profile')}>←</button>
        <h1 className="page-title">⚙️ Admin Panel</h1>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '4px',
        marginBottom: '20px',
        scrollbarWidth: 'none',
      }}>
        {adminTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                background: isActive ? 'var(--color-accent-primary)' : 'var(--color-bg-card)',
                color: isActive ? 'white' : 'var(--color-text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
}
