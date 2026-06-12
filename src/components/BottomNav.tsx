import { useLocation, useNavigate } from 'react-router-dom';

const NAV = [
  { path: '/',        label: 'Home',    icon: '⌂' },
  { path: '/learn',   label: 'Learn',   icon: '≡' },
  { path: '/profile', label: 'Profile', icon: '◯' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname.startsWith('/lesson/') || location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {NAV.map(({ path, label, icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            id={`nav-${label.toLowerCase()}`}
            className={`nav-item${active ? ' nav-item-active' : ''}`}
            onClick={() => navigate(path)}
          >
            <span className="nav-icon" style={{ fontFamily: 'system-ui', fontWeight: active ? 700 : 400 }}>
              {icon}
            </span>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
