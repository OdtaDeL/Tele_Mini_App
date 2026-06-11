import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LearnPage() {
  const navigate = useNavigate();
  const { state, getModuleProgress, getLessonStatus } = useApp();
  const [expandedModule, setExpandedModule] = useState<string | null>(state.modules[0]?.id || null);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📚 Learning Path</h1>
      </div>

      {/* Module List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {state.modules.sort((a, b) => a.order - b.order).map((mod, idx) => {
          const progress = getModuleProgress(mod.id);
          const isExpanded = expandedModule === mod.id;
          const moduleLessons = state.lessons
            .filter(l => l.module_id === mod.id)
            .sort((a, b) => a.order - b.order);

          return (
            <div
              key={mod.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Module Header */}
              <div
                className="card-glow"
                onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                style={{
                  cursor: 'pointer',
                  borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
                  borderBottom: isExpanded ? '1px solid var(--color-border)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    fontSize: '2.2rem',
                    width: '52px',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-bg-elevated)',
                    borderRadius: '14px',
                  }}>
                    {mod.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                      Module {mod.order}
                    </p>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>
                      {mod.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ flex: 1, height: '6px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${progress}%`,
                            background: progress === 100
                              ? 'linear-gradient(90deg, #00b894, #00cec9)'
                              : undefined,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600, minWidth: '35px' }}>
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '1.2rem',
                    color: 'var(--color-text-muted)',
                    transition: 'transform 0.3s ease',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}>
                    ›
                  </span>
                </div>
              </div>

              {/* Lesson List */}
              {isExpanded && (
                <div style={{
                  background: 'var(--color-bg-card)',
                  borderRadius: '0 0 16px 16px',
                  border: '1px solid rgba(108, 92, 231, 0.3)',
                  borderTop: 'none',
                  overflow: 'hidden',
                }}>
                  {moduleLessons.map((lesson, lessonIdx) => {
                    const status = getLessonStatus(lesson.id);
                    const statusIcon = status === 'completed' ? '✅' : status === 'in_progress' ? '📖' : '📋';
                    const statusColor = status === 'completed'
                      ? 'var(--color-success)'
                      : status === 'in_progress'
                      ? 'var(--color-accent-secondary)'
                      : 'var(--color-text-muted)';

                    return (
                      <div
                        key={lesson.id}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${lessonIdx * 50}ms` }}
                      >
                        <div
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                            borderBottom: lessonIdx < moduleLessons.length - 1
                              ? '1px solid var(--color-border)'
                              : 'none',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card-hover)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ fontSize: '1.2rem' }}>{statusIcon}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                              {lesson.title}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: statusColor, marginTop: '2px' }}>
                              {status === 'completed' ? 'Completed' : `+${lesson.xp_reward} XP`}
                            </p>
                          </div>
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>›</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Learning Tips */}
      <div className="card animate-fadeInUp" style={{ marginTop: '20px', padding: '16px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          💡 <strong style={{ color: 'var(--color-text-primary)' }}>Pro Tip:</strong> Complete all lessons in a module to earn a <span className="gradient-text" style={{ fontWeight: 700 }}>+100 XP</span> module bonus!
        </p>
      </div>
    </div>
  );
}
