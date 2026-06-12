import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateId, getLevelFromXP } from '../utils/helpers';
import XPPopup from '../components/XPPopup';
import LevelUpModal from '../components/LevelUpModal';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch, getLessonStatus } = useApp();

  const lesson = state.lessons.find(l => l.id === id);
  const module = lesson ? state.modules.find(m => m.id === lesson.module_id) : null;
  const status = lesson ? getLessonStatus(lesson.id) : 'not_started';

  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpValue, setLevelUpValue] = useState(0);
  const [completing, setCompleting] = useState(false);

  const handleComplete = useCallback(() => {
    if (!lesson || status === 'completed' || completing) return;
    setCompleting(true);

    const prevLevel = state.user.level;
    dispatch({ type: 'COMPLETE_LESSON', payload: { lessonId: lesson.id, xpReward: lesson.xp_reward } });
    setXpAmount(lesson.xp_reward);
    setShowXP(true);

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: generateId(),
        type: 'xp_gain',
        message: `+${lesson.xp_reward} XP for "${lesson.title}"`,
        value: lesson.xp_reward,
        timestamp: Date.now(),
      },
    });

    const newXP = state.user.xp + lesson.xp_reward;
    const newLevel = getLevelFromXP(newXP);
    if (newLevel > prevLevel) {
      setTimeout(() => { setLevelUpValue(newLevel); setShowLevelUp(true); }, 1800);
    }
  }, [lesson, status, completing, state.user.level, state.user.xp, dispatch]);

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
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </Tag>
      );
      listItems = [];
    };

    const formatInline = (t: string) =>
      t
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/❌/g, '<span style="color:#ef4444">❌</span>')
        .replace(/✅/g, '<span style="color:#22c55e">✅</span>');

    for (const line of lines) {
      const t = line.trim();
      if (!t) { flushList(); continue; }
      if (t.startsWith('### ')) { flushList(); elements.push(<h3 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(t.slice(4)) }} />); continue; }
      if (t.startsWith('## '))  { flushList(); elements.push(<h2 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(t.slice(3)) }} />); continue; }
      if (t.startsWith('# '))   { flushList(); elements.push(<h1 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(t.slice(2)) }} />); continue; }
      if (t.startsWith('> '))   { flushList(); elements.push(<blockquote key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(t.slice(2)) }} />); continue; }
      if (t.startsWith('- ') || t.startsWith('* ')) { listOrdered = false; listItems.push(t.slice(2)); continue; }
      if (/^\d+\.\s/.test(t))  { listOrdered = true; listItems.push(t.replace(/^\d+\.\s/, '')); continue; }
      flushList();
      elements.push(<p key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(t) }} />);
    }
    flushList();
    return elements;
  };

  const done = status === 'completed';

  return (
    <div className="page" style={{ paddingBottom: 120 }}>
      {showXP && <XPPopup amount={xpAmount} onComplete={() => setShowXP(false)} />}
      {showLevelUp && <LevelUpModal level={levelUpValue} onClose={() => setShowLevelUp(false)} />}

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
          <span className="badge-success" style={{ flexShrink: 0 }}>Done</span>
        )}
      </div>

      {/* ── XP banner ── */}
      <div
        className="a-fadeUp"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: done ? 'rgba(34,197,94,0.04)' : 'rgba(201,162,39,0.04)',
          border: `1px solid ${done ? 'rgba(34,197,94,0.15)' : 'var(--border-gold)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500 }}>
          {done ? 'Reward earned' : 'Complete to earn'}
        </p>
        <span className={done ? 'badge-success' : 'badge-gold'} style={{ fontSize: '0.8rem', fontWeight: 700 }}>
          +{lesson.xp_reward} XP
        </span>
      </div>

      {/* ── Video ── */}
      {lesson.video_url && (
        <div
          className="a-fadeUp d-1"
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
      <div
        className="lesson-content a-fadeUp d-2"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 18px',
        }}
      >
        {renderContent(lesson.content)}
      </div>

      {/* ── Fixed CTA ── */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        padding: '12px 16px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--bg-base) 70%, transparent)',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          {done ? (
            <button
              className="btn btn-secondary btn-lg"
              id="back-to-lessons-btn"
              onClick={() => navigate('/learn')}
              style={{ width: '100%' }}
            >
              ← Back to Lessons
            </button>
          ) : (
            <button
              className={`btn btn-primary btn-lg${completing ? '' : ' a-glow'}`}
              id="complete-lesson-btn"
              onClick={handleComplete}
              disabled={completing}
              style={{ width: '100%' }}
            >
              {completing
                ? <><span className="a-spin" style={{ display: 'inline-block', marginRight: 8 }}>◌</span>Saving…</>
                : 'Mark as Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
