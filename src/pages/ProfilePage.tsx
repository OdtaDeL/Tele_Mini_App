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
    { label: 'Total XP', value: formatNumber(user.xp), icon: '💎', color: 'var(--color-accent-secondary)' },
    { label: 'Streak', value: `${user.streak}d`, icon: '🔥', color: 'var(--color-accent-fire)' },
    { label: 'Lessons', value: completedLessons, icon: '📖', color: 'var(--color-success)' },
    { label: 'Modules', value: completedModules, icon: '📚', color: '#a29bfe' },
  ];

  const accountInfo = [
    { label: 'Telegram ID', value: String(user.telegram_id) },
    { label: 'Username', value: `@${user.username}` },
    { label: 'Joined', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
    { label: 'Role', value: user.is_admin ? '⚙️ Admin' : '👤 Member' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <p className="section-label" style={{ marginBottom: '2px' }}>Your account</p>
          <h1 className="page-title">Profile</h1>
        </div>
      </div>

      {/* ── Profile Hero ── */}
      <div
        className="card-premium animate-fadeInUp"
        style={{ marginBottom: '16px', textAlign: 'center' }}
      >
        {/* Decorative glows */}
        <div style={{
          position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          {/* Avatar ring */}
          <div style={{ display: 'inline-block', marginBottom: '14px' }}>
            <ProgressRing progress={xpInfo.progress} size={100} strokeWidth={4}>
              <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '2.2rem' }}>
                {user.first_name[0]}
              </div>
            </ProgressRing>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '3px', letterSpacing: '-0.01em' }}>
            {user.first_name}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            @{user.username}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span className="badge badge-level">Lv.{user.level} · {getLevelTitle(user.level)}</span>
            {user.streak > 0 && (
              <span className="badge badge-streak">🔥 {user.streak} day streak</span>
            )}
          </div>

          {/* XP progress */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Level {user.level} → {user.level + 1}
              </span>
              <span className="gradient-text" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                {formatNumber(xpInfo.current)} / {formatNumber(xpInfo.next)} XP
              </span>
            </div>
            <div className="progress-bar" style={{ height: '8px' }}>
              <div className="progress-bar-fill" style={{ width: `${xpInfo.progress}%` }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '5px', textAlign: 'center' }}>
              {Math.round(xpInfo.progress)}% toward next level
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div
        className="animate-fadeInUp delay-100"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
          marginBottom: '20px',
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="stat-chip" style={{ padding: '12px 6px' }}>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{stat.icon}</span>
            <span className="stat-chip-value" style={{ color: stat.color, fontSize: '1.05rem' }}>
              {stat.value}
            </span>
            <span className="stat-chip-label" style={{ fontSize: '0.6rem' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Account Info ── */}
      <div className="animate-fadeInUp delay-200" style={{ marginBottom: '16px' }}>
        <p className="section-label">Account Details</p>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {accountInfo.map((item) => (
            <div key={item.label} className="info-row">
              <span className="info-row-label">{item.label}</span>
              <span className="info-row-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Learning Summary ── */}
      <div className="animate-fadeInUp delay-300" style={{ marginBottom: '16px' }}>
        <p className="section-label">Learning Summary</p>
        <div className="card-glow">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Lessons Completed', value: completedLessons, total: state.lessons.length, color: 'var(--color-success)' },
              { label: 'Modules Completed', value: completedModules, total: state.modules.length, color: 'var(--color-accent-secondary)' },
            ].map((item) => {
              const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color }}>
                      {item.value}/{item.total}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: '6px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Admin Button ── */}
      {user.is_admin && (
        <div className="animate-fadeInUp delay-400">
          <button
            className="btn btn-secondary btn-lg"
            id="admin-panel-btn"
            onClick={() => navigate('/admin')}
            style={{ width: '100%', borderColor: 'rgba(213,160,23,0.25)' }}
          >
            ⚙️ Admin Panel
          </button>
        </div>
      )}
    </div>
  );
}
