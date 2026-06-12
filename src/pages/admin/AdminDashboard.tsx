import { useApp } from '../../context/AppContext';
import { formatNumber } from '../../utils/helpers';

export default function AdminDashboard() {
  const { state, getCompletedLessonsCount } = useApp();

  const totalUsers = state.leaderboardUsers.length + 1;
  const activeUsers = state.leaderboardUsers.filter(u => !u.is_banned).length + 1;
  const totalXPDistributed = state.leaderboardUsers.reduce((sum, u) => sum + u.xp, 0) + state.user.xp;
  const lessonsCompleted = getCompletedLessonsCount();

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: '#6c5ce7' },
    { label: 'Active Users', value: activeUsers, icon: '🟢', color: '#00b894' },
    { label: 'Lessons Done', value: lessonsCompleted, icon: '📖', color: '#00cec9' },
    { label: 'XP Distributed', value: formatNumber(totalXPDistributed), icon: '💎', color: '#ffd700' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            <div className="admin-stat-value" style={{ marginTop: '8px' }}>{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="admin-card" style={{ marginTop: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>📋 Quick Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Modules</span>
            <span style={{ fontWeight: 600 }}>{state.modules.length}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Lessons</span>
            <span style={{ fontWeight: 600 }}>{state.lessons.length}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Banned Users</span>
            <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
              {state.leaderboardUsers.filter(u => u.is_banned).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
