import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { state, getCompletedLessonsCount, getCompletedModulesCount } = useApp();
  const { user } = state;

  const completedLessons = getCompletedLessonsCount();
  const totalLessons = state.lessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Next lesson to continue
  const nextLesson = (() => {
    for (const mod of [...state.modules].sort((a, b) => a.order - b.order)) {
      const lessons = state.lessons
        .filter(l => l.module_id === mod.id)
        .sort((a, b) => a.order - b.order);
      const next = lessons.find(l => {
        const p = state.lessonProgress.find(p => p.lesson_id === l.id);
        return !p || p.status !== 'completed';
      });
      if (next) return { lesson: next, module: mod };
    }
    return null;
  })();

  return (
    <div className="page page-top">

      {/* ── Greeting ── */}
      <div className="a-fadeUp" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>
          Academy Hub
        </p>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.15, color: 'var(--text-1)' }}>
          Hey, {user.first_name}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: 4 }}>
          {overallProgress === 100
            ? 'You\'ve completed the entire course.'
            : `${completedLessons} of ${totalLessons} lessons completed`}
        </p>
      </div>

      {/* ── Progress card ── */}
      <div
        className="a-fadeUp d-1"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-mid)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          marginBottom: 12,
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.3rem', color: 'var(--gold-fg)',
          }}>
            {user.first_name[0]}
          </div>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 2 }}>
              {user.first_name}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
              @{user.username}
            </p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="gold-text" style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {overallProgress}%
            </div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginTop: 2 }}>
              complete
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar progress-bar-thick" style={{ borderRadius: 4, marginBottom: 8 }}>
          <div
            className="progress-bar-fill a-progress"
            style={{
              width: `${overallProgress}%`,
              borderRadius: 4,
              background: overallProgress === 100 ? 'var(--green)' : undefined,
            }}
          />
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>
          {completedLessons}/{totalLessons} lessons · {getCompletedModulesCount()}/{state.modules.length} modules
        </p>
      </div>

      {/* ── Stats row ── */}
      <div
        className="a-fadeUp d-2"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}
      >
        {[
          { val: completedLessons, label: 'Lessons Done' },
          { val: getCompletedModulesCount(), label: 'Modules Done' },
        ].map(s => (
          <div
            key={s.label}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.05em', color: 'var(--text-1)', lineHeight: 1 }}>
              {s.val}
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginTop: 6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Continue learning ── */}
      {nextLesson && (
        <div className="a-fadeUp d-3" style={{ marginBottom: 24 }}>
          <p className="section-label">Continue learning</p>

          <div
            onClick={() => navigate(`/lesson/${nextLesson.lesson.id}`)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: 'rgba(201,162,39,0.08)',
              border: '1px solid rgba(201,162,39,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>
              {nextLesson.module.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                {nextLesson.module.title}
              </p>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextLesson.lesson.title}
              </p>
            </div>
            <span style={{ color: 'var(--text-4)', fontSize: '1rem', flexShrink: 0 }}>›</span>
          </div>
        </div>
      )}

      {/* Completed */}
      {overallProgress === 100 && totalLessons > 0 && (
        <div className="a-fadeUp d-3" style={{
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 16px',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          <p className="gold-text" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>
            Course Complete
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>
            All {totalLessons} lessons mastered
          </p>
        </div>
      )}

      {/* ── Navigate ── */}
      <div className="a-fadeUp d-4">
        <p className="section-label">Navigate</p>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Learning Path', sub: `${totalLessons} lessons`, path: '/learn' },
            { label: 'My Profile',    sub: `Joined ${new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`, path: '/profile' },
          ].map((item, i) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="row"
              style={{ borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>{item.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>{item.sub}</p>
              </div>
              <span style={{ color: 'var(--text-4)', fontSize: '1rem' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
