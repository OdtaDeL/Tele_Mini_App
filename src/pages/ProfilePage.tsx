import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getXPForNextLevel, getLevelTitle, formatNumber } from '../utils/helpers';
import ProgressRing from '../components/ProgressRing';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, getCompletedLessonsCount, getCompletedModulesCount } = useApp();
  const { user } = state;
  const xpInfo = getXPForNextLevel(user.xp);

  const completedLessons = getCompletedLessonsCount();
  const completedModules = getCompletedModulesCount();

  const stats = [
    { label: 'Level', value: user.level, icon: '⚡', color: '#00cec9' },
    { label: 'Total XP', value: formatNumber(user.xp), icon: '💎', color: '#6c5ce7' },
    { label: 'Streak', value: `${user.streak}d`, icon: '🔥', color: '#fd7014' },
    { label: 'Lessons', value: completedLessons, icon: '📖', color: '#00b894' },
    { label: 'Modules', value: completedModules, icon: '📚', color: '#ffd700' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👤 Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(0, 206, 201, 0.1))',
        border: '1px solid rgba(108, 92, 231, 0.2)',
        borderRadius: '24px',
        padding: '28px 20px',
        textAlign: 'center',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-30px',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(0, 206, 201, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Avatar with ring */}
          <div style={{ display: 'inline-block', marginBottom: '12px' }}>
            <ProgressRing progress={xpInfo.progress} size={96} strokeWidth={4}>
              <div className="avatar" style={{ width: '76px', height: '76px', fontSize: '2rem' }}>
                {user.first_name[0]}
              </div>
            </ProgressRing>
          </div>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '2px' }}>
            {user.first_name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
            @{user.username}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-level">Lvl {user.level} · {getLevelTitle(user.level)}</span>
            <span className="badge badge-streak">🔥 {user.streak} day streak</span>
          </div>

          {/* XP to next level */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Level {user.level}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-secondary)' }}>
                Level {user.level + 1}
              </span>
            </div>
            <div className="progress-bar" style={{ height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${xpInfo.progress}%` }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {formatNumber(xpInfo.current)} / {formatNumber(xpInfo.next)} XP to next level
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="animate-fadeInUp delay-100" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '20px',
      }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '14px 8px' }}>
            <span style={{ fontSize: '1.3rem' }}>{stat.icon}</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color, marginTop: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className="animate-fadeInUp delay-200">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Account Info</h3>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {[
            { label: 'Telegram ID', value: user.telegram_id },
            { label: 'Username', value: `@${user.username}` },
            { label: 'Joined', value: new Date(user.created_at).toLocaleDateString() },
            { label: 'Role', value: user.is_admin ? 'Admin' : 'Member' },
          ].map((item, idx) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: idx < 3 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{item.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Button */}
      {user.is_admin && (
        <div className="animate-fadeInUp delay-400" style={{ marginTop: '24px' }}>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/admin')}
            style={{
              width: '100%',
              border: '1px solid rgba(108, 92, 231, 0.3)',
            }}
          >
            ⚙️ Admin Panel
          </button>
        </div>
      )}
    </div>
  );
}
