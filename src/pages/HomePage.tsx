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

  const stats = [
    {
      value: formatNumber(user.xp),
      label: 'Total XP',
      icon: '💎',
      color: 'var(--color-accent-secondary)',
    },
    {
      value: completedLessons,
      label: 'Lessons',
      icon: '📖',
      color: 'var(--color-success)',
    },
    {
      value: getCompletedModulesCount(),
      label: 'Modules',
      icon: '🏆',
      color: 'var(--color-accent-fire)',
    },
  ];

  return (
    <div className="page">

      {/* ── Hero Card ── */}
      <div
        className="card-premium animate-fadeInUp"
        style={{ marginBottom: '16px' }}
      >
        {/* Ambient glow orbs */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-30px',
          width: '140px', height: '140px',
          background: 'radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '10px',
          width: '100px', height: '100px',
          background: 'radial-gradient(circle, rgba(230,126,34,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          {/* Avatar with progress ring */}
          <ProgressRing progress={xpInfo.progress} size={76} strokeWidth={4}>
            <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.6rem' }}>
              {user.first_name[0]}
            </div>
          </ProgressRing>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Welcome back
            </p>
            <h1 style={{
              fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px',
              letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              {user.first_name} 👋
            </h1>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-level">Lv.{user.level} · {getLevelTitle(user.level)}</span>
              {user.streak > 0 && (
                <span className="badge badge-streak">🔥 {user.streak}d streak</span>
              )}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Level {user.level} → {user.level + 1}
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700 }} className="gradient-text">
              {formatNumber(xpInfo.current)} / {formatNumber(xpInfo.next)} XP
            </span>
          </div>
          <div className="progress-bar" style={{ height: '10px' }}>
            <div className="progress-bar-fill animate-progressBar" style={{ width: `${xpInfo.progress}%` }} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px', textAlign: 'right' }}>
            {Math.round(xpInfo.progress)}% to next level
          </p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div
        className="animate-fadeInUp delay-100"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}
      >
        {stats.map((s) => (
          <div key={s.label} className="stat-chip">
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{s.icon}</span>
            <span className="stat-chip-value" style={{ color: s.color }}>{s.value}</span>
            <span className="stat-chip-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Overall Progress ── */}
      <div className="card-glow animate-fadeInUp delay-200" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '2px' }}>Course Progress</p>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Supply & Demand Method</h3>
          </div>
          <span style={{
            fontSize: '1.4rem', fontWeight: 900,
            lineHeight: 1,
          }} className="gradient-text">{overallProgress}%</span>
        </div>
        <div className="progress-bar" style={{ height: '8px', marginBottom: '8px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${overallProgress}%`,
              background: overallProgress === 100
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : undefined,
            }}
          />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="animate-fadeInUp delay-300" style={{ marginBottom: '20px' }}>
        <p className="section-label">Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { label: 'Start Learning', icon: '📚', path: '/learn', color: '#f5c518', desc: 'Continue your path' },
            { label: 'My Profile', icon: '👤', path: '/profile', color: '#e67e22', desc: 'View your progress' },
          ].map((action) => (
            <button
              key={action.label}
              id={`quick-${action.label.toLowerCase().replace(/\s/g,'-')}`}
              onClick={() => navigate(action.path)}
              style={{
                background: `linear-gradient(135deg, ${action.color}12, ${action.color}05)`,
                border: `1px solid ${action.color}25`,
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${action.color}50`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${action.color}20`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${action.color}25`;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <span style={{
                fontSize: '1.6rem',
                width: '42px', height: '42px',
                background: `${action.color}15`,
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {action.icon}
              </span>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                  {action.label}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Continue Learning ── */}
      {completedLessons < totalLessons && (
        <div className="animate-fadeInUp delay-400">
          <p className="section-label">Continue Where You Left Off</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {state.modules.map((mod) => {
              const moduleLessons = state.lessons.filter(l => l.module_id === mod.id);
              const nextLesson = moduleLessons.find(l => {
                const progress = state.lessonProgress.find(p => p.lesson_id === l.id);
                return !progress || progress.status !== 'completed';
              });
              if (!nextLesson) return null;
              const lessonNumber = moduleLessons.findIndex(l => l.id === nextLesson.id) + 1;
              return (
                <div
                  key={mod.id}
                  className="card-glow"
                  onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
                >
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', flexShrink: 0,
                  }}>
                    {mod.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {mod.title} · Lesson {lessonNumber}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {nextLesson.title}
                    </p>
                    <span className="badge badge-xp" style={{ marginTop: '4px' }}>+{nextLesson.xp_reward} XP</span>
                  </div>
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--color-accent-gradient-start), var(--color-accent-gradient-end))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', color: '#0a0802', fontWeight: 700, flexShrink: 0,
                  }}>›</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed state */}
      {completedLessons === totalLessons && totalLessons > 0 && (
        <div className="animate-fadeInUp delay-400 card-premium" style={{ textAlign: 'center', padding: '28px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏆</div>
          <h3 className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
            Course Complete!
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            You've mastered all {totalLessons} lessons. Incredible work!
          </p>
        </div>
      )}
    </div>
  );
}
