import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/helpers';

// Simple "lesson complete" toast — no XP, no levels
function CompletedToast({ onDone }: { onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        animation: 'xpRise 2.2s cubic-bezier(0.16,1,0.3,1) forwards',
        userSelect: 'none',
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-elevated)',
        border: '1px solid rgba(34,197,94,0.25)',
        borderRadius: 99,
        padding: '8px 18px',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--green)', letterSpacing: '-0.01em' }}>
          Lesson completed
        </span>
      </div>
    </div>
  );
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch, getLessonStatus } = useApp();

  const lesson = state.lessons.find(l => l.id === id);
  const module = lesson ? state.modules.find(m => m.id === lesson.module_id) : null;
  const status = lesson ? getLessonStatus(lesson.id) : 'not_started';

  const [showToast, setShowToast] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handleComplete = useCallback(() => {
    if (!lesson || status === 'completed' || completing) return;
    setCompleting(true);

    dispatch({
      type: 'COMPLETE_LESSON',
      payload: { lessonId: lesson.id },
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: generateId(),
        type: 'lesson_complete',
        message: `Completed "${lesson.title}"`,
        timestamp: Date.now(),
      },
    });

    setShowToast(true);
  }, [lesson, status, completing, dispatch]);

  if (!lesson || !module) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-3)', marginBottom: 16 }}>Lesson not found</p>
          <button className="btn btn-secondary" onClick={() => navigate('/learn')}>Back to Learn</button>
        </div>
      </div>
    );
  }

  // Markdown renderer
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];
    let listOrdered = false;

    const flushList = () => {
      if (!listItems.length) return;
      const Tag = listOrdered ? 'ol' : 'ul';
      elements.push(
        <Tag key={`list-${elements.length}`}>
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: fmt(item) }} />
          ))}
        </Tag>
      );
      listItems = [];
    };

    const fmt = (t: string) =>
      t
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/❌/g, '<span style="color:#ef4444">❌</span>')
        .replace(/✅/g, '<span style="color:#22c55e">✅</span>');

    for (const line of lines) {
      const t = line.trim();
      if (!t) { flushList(); continue; }
      if (t.startsWith('### ')) { flushList(); elements.push(<h3 key={elements.length} dangerouslySetInnerHTML={{ __html: fmt(t.slice(4)) }} />); continue; }
      if (t.startsWith('## '))  { flushList(); elements.push(<h2 key={elements.length} dangerouslySetInnerHTML={{ __html: fmt(t.slice(3)) }} />); continue; }
      if (t.startsWith('# '))   { flushList(); elements.push(<h1 key={elements.length} dangerouslySetInnerHTML={{ __html: fmt(t.slice(2)) }} />); continue; }
      if (t.startsWith('> '))   { flushList(); elements.push(<blockquote key={elements.length} dangerouslySetInnerHTML={{ __html: fmt(t.slice(2)) }} />); continue; }
      if (t.startsWith('- ') || t.startsWith('* ')) { listOrdered = false; listItems.push(t.slice(2)); continue; }
      if (/^\d+\.\s/.test(t))  { listOrdered = true; listItems.push(t.replace(/^\d+\.\s/, '')); continue; }
      flushList();
      elements.push(<p key={elements.length} dangerouslySetInnerHTML={{ __html: fmt(t) }} />);
    }
    flushList();
    return elements;
  };

  const done = status === 'completed';

  // Find prev/next lesson
  const moduleLessons = state.lessons
    .filter(l => l.module_id === module.id)
    .sort((a, b) => a.order - b.order);
  const currentIdx = moduleLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = moduleLessons[currentIdx + 1];

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {showToast && <CompletedToast onDone={() => setShowToast(false)} />}

      {/* ── Header ── */}
      <div className="page-header">
        <button className="page-back-btn" id="lesson-back-btn" onClick={() => navigate('/learn')}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 3 }}>
            {module.title}
          </p>
          <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lesson.title}
          </h1>
        </div>
        {done && (
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px',
            background: 'rgba(34,197,94,0.1)', color: 'var(--green)',
            borderRadius: 99, border: '1px solid rgba(34,197,94,0.2)',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            Completed
          </span>
        )}
      </div>

      {/* ── Lesson position ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: '8px 0',
      }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 500 }}>
          Lesson {currentIdx + 1} of {moduleLessons.length}
        </span>
        <div style={{ flex: 1, height: 2, background: 'var(--border)', borderRadius: 1 }}>
          <div style={{
            height: '100%', borderRadius: 1,
            background: 'var(--gold)',
            width: `${((currentIdx + 1) / moduleLessons.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* ── Video ── */}
      {lesson.video_url && (
        <div
          className="a-fadeUp"
          style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: 16,
            border: '1px solid var(--border-mid)',
            background: '#000',
          }}
        >
          <iframe
            src={lesson.video_url}
            style={{ width: '100%', aspectRatio: '16/9', border: 'none', display: 'block' }}
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}

      {/* ── Content ── */}
      {lesson.content.trim() && (
        <div
          className="lesson-content a-fadeUp d-1"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 18px',
            marginBottom: 16,
          }}
        >
          {renderContent(lesson.content)}
        </div>
      )}

      {/* ── Fixed CTA ── */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--bg-base) 70%, transparent)',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', gap: 8 }}>
          {done ? (
            nextLesson ? (
              <button
                className="btn btn-primary btn-lg"
                id="next-lesson-btn"
                onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                style={{ flex: 1 }}
              >
                Next Lesson →
              </button>
            ) : (
              <button
                className="btn btn-secondary btn-lg"
                id="back-to-lessons-btn"
                onClick={() => navigate('/learn')}
                style={{ flex: 1 }}
              >
                ← Back to Lessons
              </button>
            )
          ) : (
            <>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => navigate('/learn')}
                style={{ flexShrink: 0 }}
              >
                ←
              </button>
              <button
                className="btn btn-primary btn-lg"
                id="complete-lesson-btn"
                onClick={handleComplete}
                disabled={completing}
                style={{ flex: 1 }}
              >
                {completing
                  ? <><span className="a-spin" style={{ display: 'inline-block', marginRight: 8 }}>◌</span>Saving…</>
                  : 'Mark as Complete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
