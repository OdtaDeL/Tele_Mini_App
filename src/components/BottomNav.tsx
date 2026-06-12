import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠', activeIcon: '🏠' },
  { path: '/learn', label: 'Learn', icon: '📚', activeIcon: '📚' },
  { path: '/profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/lesson/') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            id={`nav-${item.label.toLowerCase()}`}
            className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span
              className="nav-icon"
              style={isActive ? { transform: 'scale(1.12)' } : undefined}
            >
              {item.icon}
            </span>
            <span style={{
              fontWeight: isActive ? 700 : 500,
              transition: 'all 0.2s ease',
              letterSpacing: isActive ? '0.02em' : '0.01em',
            }}>
              {item.label}
            </span>
            {/* Active indicator dot */}
            {isActive && (
              <span style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'var(--color-accent-secondary)',
                boxShadow: '0 0 6px var(--glow-gold)',
                marginTop: '-2px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
