import { useApp } from '../../context/AppContext';

export default function LeaderboardManager() {
  const { dispatch } = useApp();

  const handleReset = (type: 'weekly' | 'monthly') => {
    if (confirm(`Reset ${type} leaderboard rankings? This action cannot be undone.`)) {
      dispatch({ type: 'ADMIN_RESET_LEADERBOARD', payload: type });
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>Leaderboard Management</h3>

      <div className="admin-card" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weekly Rankings</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Reset weekly XP tracking for all users
            </p>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleReset('weekly')}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monthly Rankings</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Reset monthly XP tracking for all users
            </p>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleReset('monthly')}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px', padding: '16px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          ⚠️ <strong style={{ color: 'var(--color-warning)' }}>Note:</strong> In production, leaderboard resets would be handled by scheduled Supabase functions. These controls are for manual override only.
        </p>
      </div>
    </div>
  );
}
