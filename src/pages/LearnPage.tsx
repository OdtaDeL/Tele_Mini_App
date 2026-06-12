import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Skeleton from '../components/ui/Skeleton';

export default function LearnPage() {
  const navigate = useNavigate();
  const { state, getModuleProgress, getLessonStatus } = useApp();
  
  const sortedModules = [...state.modules].sort((a, b) => a.order - b.order);
  const [expanded, setExpanded] = useState<string | null>(sortedModules[0]?.id || null);

  if (state.isLoading) {
    return (
      <div className="page page-top">
        {/* Header Skeleton */}
        <div style={{ marginBottom: 24 }}>
          <Skeleton width="80px" height="12px" style={{ marginBottom: 8 }} />
          <Skeleton width="180px" height="24px" />
        </div>

        {/* Module list Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((n) => (
            <div 
              key={n} 
              style={{ 
                background: 'var(--bg-elevated)', 
                border: '1px solid var(--border-mid)', 
                borderRadius: 14, 
                padding: '14px 16px' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Skeleton width="42px" height="42px" borderRadius="10px" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70px" height="10px" style={{ marginBottom: 6 }} />
                  <Skeleton width="60%" height="14px" style={{ marginBottom: 8 }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Skeleton style={{ flex: 1 }} height="4px" />
                    <Skeleton width="30px" height="10px" />
                  </div>
                </div>
                <Skeleton width="10px" height="18px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page page-top" style={{ paddingBottom: 112 }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }} className="a-fadeUp">
        <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>
          Curriculum
        </p>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--text-1)', lineHeight: 1.2 }}>
          Learning Path
        </h1>
      </div>

      {/* Module list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedModules.map((mod, idx) => {
          const progress = getModuleProgress(mod.id);
          const isOpen = expanded === mod.id;
          const complete = progress === 100;
          const lessons = state.lessons
            .filter(l => l.module_id === mod.id)
            .sort((a, b) => a.order - b.order);
          const doneCount = lessons.filter(l => getLessonStatus(l.id) === 'completed').length;

          return (
            <div
              key={mod.id}
              className="a-fadeUp"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Module header */}
              <div
                onClick={() => setExpanded(isOpen ? null : mod.id)}
                style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${isOpen ? 'var(--border-gold)' : 'var(--border-mid)'}`,
                  borderRadius: isOpen ? '14px 14px 0 0' : 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s',
                  borderBottom: isOpen ? '1px solid var(--border)' : undefined,
                }}
                onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Module icon box */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: complete ? 'rgba(34,197,94,0.08)' : 'var(--bg-overlay)',
                    border: `1px solid ${complete ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}>
                    {mod.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Module {mod.order}
                      </span>
                      {complete && (
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px',
                          background: 'rgba(34,197,94,0.1)', color: 'var(--green)',
                          borderRadius: 99, border: '1px solid rgba(34,197,94,0.18)',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>
                          Done
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 8, lineHeight: 1.3 }}>
                      {mod.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${progress}%`,
                            background: complete ? 'var(--green)' : undefined,
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: complete ? 'var(--green)' : 'var(--text-3)', minWidth: 36, textAlign: 'right' }}>
                        {doneCount}/{lessons.length}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    color: 'var(--text-4)',
                    fontSize: '1.1rem',
                    transition: 'transform 0.25s ease',
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    flexShrink: 0,
                  }}>
                    ›
                  </span>
                </div>
              </div>

              {/* Lessons */}
              {isOpen && (
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-gold)',
                  borderTop: 'none',
                  borderRadius: '0 0 14px 14px',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  {lessons.map((lesson, li) => {
                    const status = getLessonStatus(lesson.id);
                    const done = status === 'completed';

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/lesson/${lesson.id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          borderBottom: li < lessons.length - 1 ? '1px solid var(--border)' : 'none',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        {/* Number / check */}
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: done ? 'rgba(34,197,94,0.08)' : 'var(--bg-overlay)',
                          border: `1px solid ${done ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: done ? '0.8rem' : '0.7rem',
                          fontWeight: 700,
                          color: done ? 'var(--green)' : 'var(--text-3)',
                        }}>
                          {done ? '✓' : li + 1}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: done ? 'var(--text-2)' : 'var(--text-1)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {lesson.title}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: done ? 'var(--green)' : 'var(--text-3)', marginTop: 2 }}>
                            {done ? 'Completed' : ''}
                          </p>
                        </div>

                        <span style={{ color: 'var(--text-4)', fontSize: '0.9rem', flexShrink: 0 }}>›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
