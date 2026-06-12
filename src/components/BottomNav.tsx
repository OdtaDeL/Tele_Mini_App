import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/learn', label: 'Learn', icon: '📚' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide bottom nav on lesson detail pages and admin pages
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
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
