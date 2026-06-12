import { useLocation, useNavigate } from 'react-router-dom';

const NAV = [
  { 
    path: '/', 
    label: 'Home', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )
  },
  { 
    path: '/learn', 
    label: 'Learn', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    )
  },
  { 
    path: '/profile', 
    label: 'Profile', 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/lesson/') || location.pathname.startsWith('/admin')) {
    return null;
  }

  const activeIndex = NAV.findIndex(item => item.path === location.pathname);

  return (
    <nav 
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '16px',
        right: '16px',
        maxWidth: '448px',
        margin: '0 auto',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        background: 'rgba(15, 15, 18, 0.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '22px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        zIndex: 100,
      }}
    >
      {/* Sliding Active Highlight Indicator */}
      {activeIndex !== -1 && (
        <div 
          style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            left: `calc(${activeIndex} * 33.333% + 6px)`,
            width: `calc(33.333% - 12px)`,
            background: 'rgba(201, 162, 39, 0.08)',
            border: '1px solid rgba(201, 162, 39, 0.15)',
            borderRadius: '16px',
            transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: 'none',
          }}
        />
      )}

      {NAV.map(({ path, label, icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            id={`nav-${label.toLowerCase()}`}
            className="active:scale-[0.93]"
            style={{
              flex: 1,
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: active ? 'var(--gold-bright)' : 'var(--text-3)',
              transition: 'color 0.3s ease, transform 0.15s ease',
              position: 'relative',
              zIndex: 10,
              gap: '4px',
            }}
            onClick={() => navigate(path)}
          >
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              {icon}
            </div>
            <span 
              style={{ 
                fontSize: '0.62rem', 
                fontWeight: active ? 700 : 500, 
                letterSpacing: '0.04em', 
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
