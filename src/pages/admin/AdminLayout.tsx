import { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const adminTabs = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/modules', label: 'Modules', icon: '📚' },
  { path: '/admin/lessons', label: 'Lessons', icon: '📖' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthorizing(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isAuthorizing) {
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-base, #08080a)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          fontFamily: 'var(--font-mono, monospace)',
        }}
      >
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          {/* Outer Rotating Scan Ring */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              border: '2px solid rgba(201, 162, 39, 0.15)',
              borderTopColor: 'var(--gold-bright, #e8bc3c)',
              borderRadius: '50%',
              animation: 'spinCw 1.2s linear infinite',
            }} 
          />
          {/* Inner Gear Symbol */}
          <div 
            style={{
              position: 'absolute',
              inset: '20px',
              background: 'rgba(201, 162, 39, 0.05)',
              border: '1px dashed rgba(201, 162, 39, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: 'var(--gold, #c9a227)',
            }}
          >
            ⚙
          </div>
        </div>
        
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              letterSpacing: '0.2em', 
              color: 'var(--gold-bright, #e8bc3c)',
              textTransform: 'uppercase',
              margin: 0
            }}
          >
            SECURE ACCESS
          </p>
          <p 
            style={{ 
              fontSize: '0.62rem', 
              color: 'var(--text-3, #52545e)', 
              letterSpacing: '0.05em',
              margin: 0
            }}
          >
            AUTHORIZING ADMIN MODE...
          </p>
        </div>
      </div>
    );
  }

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
                border: isActive ? '1px solid var(--border-gold)' : '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: isActive ? 700 : 500,
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                background: isActive ? 'var(--gold)' : 'var(--bg-surface)',
                color: isActive ? 'var(--gold-fg)' : 'var(--text-2)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Suspense 
        fallback={
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '0.8rem', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
            Loading component...
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
