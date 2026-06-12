import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { state, getCompletedLessonsCount } = useApp();

  const totalUsers = state.leaderboardUsers.length + 1;
  const activeUsers = state.leaderboardUsers.filter(u => !u.is_banned).length + 1;
  const lessonsCompleted = getCompletedLessonsCount();

  const stats = [
    { label: 'Total Users',  value: totalUsers },
    { label: 'Active Users', value: activeUsers },
    { label: 'Lessons',      value: state.lessons.length },
    { label: 'My Progress',  value: `${lessonsCompleted}/${state.lessons.length}` },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: 16 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="admin-card" style={{ textAlign: 'center' }}>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="admin-card">
        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Overview
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Modules',      value: state.modules.length },
            { label: 'Total Lessons', value: state.lessons.length },
            { label: 'Banned Users', value: state.leaderboardUsers.filter(u => u.is_banned).length, danger: true },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-3)' }}>{item.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.danger ? 'var(--red)' : 'var(--text-1)' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
