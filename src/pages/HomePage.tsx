import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getXPForNextLevel, getLevelTitle, formatNumber } from '../utils/helpers';
import ProgressRing from '../components/ProgressRing';

export default function HomePage() {
  const navigate = useNavigate();
  const { state, getCompletedLessonsCount, getCompletedModulesCount } = useApp();
  const { user } = state;
  const xpInfo = getXPForNextLevel(user.xp);
  const completedLessons = getCompletedLessonsCount();
  const totalLessons = state.lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const quickActions = [
    { label: 'Learn', icon: '📚', path: '/learn', color: '#6c5ce7' },
    { label: 'Rewards', icon: '🎁', path: '/rewards', color: '#00cec9' },
    { label: 'Ranking', icon: '🏆', path: '/leaderboard', color: '#ffd700' },
    { label: 'Profile', icon: '👤', path: '/profile', color: '#fd7014' },
  ];

  return (
    <div className="page">
      {/* Hero Card */}
      <div className="animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(0, 206, 201, 0.1))',
        border: '1px solid rgba(108, 92, 231, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          {/* Avatar with Progress Ring */}
          <ProgressRing progress={xpInfo.progress} size={72} strokeWidth={4}>
            <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
              {user.first_name[0]}
            </div>
          </ProgressRing>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
              Hey, {user.first_name}! 👋
            </h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-level">Lvl {user.level} · {getLevelTitle(user.level)}</span>
              <span className="badge badge-streak">🔥 {user.streak} day{user.streak !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Level {user.level} → Level {user.level + 1}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-secondary)', fontWeight: 600 }}>
              {formatNumber(xpInfo.current)} / {formatNumber(xpInfo.next)} XP
            </span>
          </div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div className="progress-bar-fill animate-progressBar" style={{ width: `${xpInfo.progress}%` }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <span>Total XP: {formatNumber(user.xp)}</span>
          <span>{Math.round(xpInfo.progress)}% to next level</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="animate-fadeInUp delay-100" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '20px',
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '14px 10px' }}>
          <div className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {formatNumber(user.xp)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Total XP</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>
            {completedLessons}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Lessons Done</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '14px 10px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent-fire)' }}>
            {getCompletedModulesCount()}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Modules</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="animate-fadeInUp delay-200" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Overall Progress</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-secondary)', fontWeight: 600 }}>
            {overallProgress}%
          </span>
        </div>
        <div className="progress-bar" style={{ height: '12px', borderRadius: '999px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${overallProgress}%`,
              background: overallProgress === 100
                ? 'linear-gradient(90deg, #00b894, #00cec9)'
                : undefined,
            }}
          />
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Quick Actions */}
      <div className="animate-fadeInUp delay-300">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              id={`quick-${action.label.toLowerCase()}`}
              className="card"
              onClick={() => navigate(action.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                border: `1px solid ${action.color}22`,
                background: `linear-gradient(135deg, ${action.color}10, transparent)`,
                textAlign: 'left',
              }}
            >
              <span style={{
                fontSize: '1.8rem',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${action.color}15`,
                borderRadius: '12px',
              }}>
                {action.icon}
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Continue Learning */}
      {completedLessons < totalLessons && (
        <div className="animate-fadeInUp delay-400" style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Continue Learning</h3>
          {state.modules.map((mod) => {
            const moduleLessons = state.lessons.filter(l => l.module_id === mod.id);
            const nextLesson = moduleLessons.find(l => {
              const progress = state.lessonProgress.find(p => p.lesson_id === l.id);
              return !progress || progress.status !== 'completed';
            });
            if (!nextLesson) return null;
            return (
              <div
                key={mod.id}
                className="card-glow"
                onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                style={{ cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '14px' }}
              >
                <span style={{ fontSize: '2rem' }}>{mod.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{mod.title}</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{nextLesson.title}</p>
                  <span className="badge badge-xp" style={{ marginTop: '4px' }}>+{nextLesson.xp_reward} XP</span>
                </div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>›</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
