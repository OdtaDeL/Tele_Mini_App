import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LearnPage() {
  const navigate = useNavigate();
  const { state, getModuleProgress, getLessonStatus } = useApp();
  const [expandedModule, setExpandedModule] = useState<string | null>(state.modules[0]?.id || null);

  const sortedModules = [...state.modules].sort((a, b) => a.order - b.order);

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div style={{ flex: 1 }}>
          <p className="section-label" style={{ marginBottom: '2px' }}>Your curriculum</p>
          <h1 className="page-title">📚 Learning Path</h1>
        </div>
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-gold)',
          borderRadius: '12px',
          padding: '8px 12px',
          textAlign: 'center',
        }}>
          <p className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>
            {state.modules.length}
          </p>
          <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>
            {state.modules.length === 1 ? 'Module' : 'Modules'}
          </p>
        </div>
      </div>

      {/* Module List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedModules.map((mod, idx) => {
          const progress = getModuleProgress(mod.id);
          const isExpanded = expandedModule === mod.id;
          const isComplete = progress === 100;
          const moduleLessons = state.lessons
            .filter(l => l.module_id === mod.id)
            .sort((a, b) => a.order - b.order);
          const completedCount = moduleLessons.filter(l => getLessonStatus(l.id) === 'completed').length;

          return (
            <div
              key={mod.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Module Header */}
              <div
                onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                style={{
                  background: isComplete
                    ? 'linear-gradient(135deg, rgba(39,174,96,0.1), rgba(39,174,96,0.05))'
                    : 'var(--color-bg-card)',
                  border: `1px solid ${isComplete ? 'rgba(39,174,96,0.3)' : 'var(--color-border-gold)'}`,
                  borderRadius: isExpanded ? '18px 18px 0 0' : '18px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isExpanded ? '0 0 24px rgba(213,160,23,0.08)' : 'none',
                }}
              >
                {/* Top line accent when expanded */}
                {isExpanded && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, transparent, var(--color-accent-primary), transparent)',
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Module icon */}
                  <div style={{
                    width: '54px', height: '54px', borderRadius: '15px', flexShrink: 0,
                    background: isComplete
                      ? 'rgba(39,174,96,0.15)'
                      : 'linear-gradient(135deg, rgba(245,197,24,0.12), rgba(230,126,34,0.06))',
                    border: `1px solid ${isComplete ? 'rgba(39,174,96,0.25)' : 'rgba(245,197,24,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem',
                  }}>
                    {isComplete ? '✅' : mod.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Module {mod.order}
                    </p>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                      {mod.title}
                    </h3>

                    {/* Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar" style={{ flex: 1, height: '5px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${progress}%`,
                            background: isComplete
                              ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                              : undefined,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isComplete ? 'var(--color-success)' : 'var(--color-accent-secondary)', minWidth: '36px', textAlign: 'right' }}>
                        {completedCount}/{moduleLessons.length}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <span style={{
                    fontSize: '1rem', color: 'var(--color-text-muted)',
                    transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}>
                    ›
                  </span>
                </div>
              </div>

              {/* Lesson List */}
              {isExpanded && (
                <div style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-gold)',
                  borderTop: 'none',
                  borderRadius: '0 0 18px 18px',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease-out',
                }}>
                  {moduleLessons.map((lesson, lessonIdx) => {
                    const status = getLessonStatus(lesson.id);
                    const isCompleted = status === 'completed';
                    const isInProgress = status === 'in_progress';

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        className="list-row"
                        style={{
                          borderBottom: lessonIdx < moduleLessons.length - 1
                            ? '1px solid var(--color-border)'
                            : 'none',
                        }}
                      >
                        {/* Status icon */}
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                          background: isCompleted
                            ? 'rgba(39,174,96,0.12)'
                            : isInProgress
                            ? 'rgba(245,197,24,0.1)'
                            : 'var(--color-bg-elevated)',
                          border: `1px solid ${isCompleted ? 'rgba(39,174,96,0.25)' : isInProgress ? 'rgba(245,197,24,0.2)' : 'var(--color-border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.95rem',
                        }}>
                          {isCompleted ? '✅' : isInProgress ? '📖' : `${lessonIdx + 1}`}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontWeight: 600, fontSize: '0.88rem',
                            color: isCompleted ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {lesson.title}
                          </p>
                          <p style={{
                            fontSize: '0.72rem', marginTop: '3px',
                            color: isCompleted ? 'var(--color-success)' : 'var(--color-text-muted)',
                            fontWeight: 600,
                          }}>
                            {isCompleted ? '✓ Completed' : `+${lesson.xp_reward} XP`}
                          </p>
                        </div>

                        <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', flexShrink: 0 }}>›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pro Tip */}
      <div className="card animate-fadeInUp" style={{ marginTop: '20px', borderColor: 'var(--color-border-gold)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--color-text-primary)' }}>Pro Tip:</strong>{' '}
            Complete all lessons in a module to unlock{' '}
            <span className="gradient-text" style={{ fontWeight: 700 }}>bonus XP rewards</span>!
          </p>
        </div>
      </div>
    </div>
  );
}
