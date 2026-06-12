import React, { useState, useEffect, useCallback } from 'react';
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

    dispatch({
      type: 'COMPLETE_LESSON',
      payload: { lessonId: lesson.id, xpReward: lesson.xp_reward },
    });

    setXpAmount(lesson.xp_reward);
    setShowXP(true);

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: generateId(),
        type: 'xp_gain',
        message: `+${lesson.xp_reward} XP for completing "${lesson.title}"`,
        value: lesson.xp_reward,
        timestamp: Date.now(),
      },
    });

    const newXP = state.user.xp + lesson.xp_reward;
    const newLevel = getLevelFromXP(newXP);
    if (newLevel > prevLevel) {
      setTimeout(() => {
        setLevelUpValue(newLevel);
        setShowLevelUp(true);
      }, 1600);
    }
  }, [lesson, status, completing, state.user.level, state.user.xp, dispatch]);

  useEffect(() => {
    if (lesson && status === 'not_started') {
      // Track as viewed when opening
    }
  }, [lesson, status]);

  if (!lesson || !module) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p className="empty-state-title">Lesson not found</p>
          <p className="empty-state-desc">This lesson may have been removed or doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/learn')} style={{ marginTop: '8px' }}>
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  // Markdown-like renderer
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];
    let listOrdered = false;

    const flushList = () => {
      if (listItems.length > 0) {
        if (listOrdered) {
          elements.push(
            <ol key={`ol-${elements.length}`}>
              {listItems.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`ul-${elements.length}`}>
              {listItems.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              ))}
            </ul>
          );
        }
        listItems = [];
      }
    };

    const formatInline = (text: string): string =>
      text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/❌/g, '<span style="color:#e74c3c">❌</span>')
        .replace(/✅/g, '<span style="color:#27ae60">✅</span>');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') { flushList(); continue; }
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(4)) }} />);
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(3)) }} />);
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />);
        continue;
      }
      if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(<blockquote key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />);
        continue;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listOrdered = false;
        listItems.push(trimmed.slice(2));
        continue;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        listOrdered = true;
        listItems.push(trimmed.replace(/^\d+\.\s/, ''));
        continue;
      }
      flushList();
      elements.push(<p key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />);
    }
    flushList();
    return elements;
  };

  const isCompleted = status === 'completed';

  return (
    <div className="page" style={{ paddingBottom: '130px' }}>
      {showXP && <XPPopup amount={xpAmount} onComplete={() => setShowXP(false)} />}
      {showLevelUp && <LevelUpModal level={levelUpValue} onClose={() => setShowLevelUp(false)} />}

      {/* ── Header ── */}
      <div className="page-header">
        <button className="page-back-btn" id="lesson-back-btn" onClick={() => navigate('/learn')}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {module.icon} {module.title}
          </p>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lesson.title}
          </h1>
        </div>
        {isCompleted && (
          <span className="badge badge-success" style={{ flexShrink: 0 }}>✅ Done</span>
        )}
      </div>

      {/* ── XP Reward Banner ── */}
      <div className="animate-fadeInUp" style={{
        background: isCompleted
          ? 'linear-gradient(135deg, rgba(39,174,96,0.12), rgba(39,174,96,0.06))'
          : 'linear-gradient(135deg, rgba(245,197,24,0.1), rgba(230,126,34,0.06))',
        border: `1px solid ${isCompleted ? 'rgba(39,174,96,0.25)' : 'rgba(245,197,24,0.2)'}`,
        borderRadius: '14px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>{isCompleted ? '🏅' : '⚡'}</span>
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {isCompleted ? 'Reward Earned' : 'Lesson Reward'}
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: isCompleted ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
              {isCompleted ? 'Completed!' : `Complete to earn XP`}
            </p>
          </div>
        </div>
        <span className={`badge ${isCompleted ? 'badge-success' : 'badge-xp'}`} style={{ fontSize: '0.85rem' }}>
          +{lesson.xp_reward} XP
        </span>
      </div>

      {/* ── Video Embed ── */}
      {lesson.video_url && (
        <div className="animate-fadeInUp delay-100" style={{
          borderRadius: '18px',
          overflow: 'hidden',
          marginBottom: '16px',
          border: '1px solid var(--color-border-gold)',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 1,
            background: 'linear-gradient(90deg, transparent, var(--color-accent-primary), transparent)',
          }} />
          <iframe
            src={lesson.video_url}
            style={{ width: '100%', aspectRatio: '16/9', border: 'none', display: 'block' }}
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}

      {/* ── Lesson Content ── */}
      <div
        className="lesson-content animate-fadeInUp delay-200"
        style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '18px',
          padding: '24px 20px',
          marginBottom: '16px',
        }}
      >
        {renderContent(lesson.content)}
      </div>

      {/* ── Complete Button (fixed bottom) ── */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        padding: '16px 16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--color-bg-primary) 65%, transparent)',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {isCompleted ? (
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
              className="btn btn-primary btn-lg animate-glow"
              id="complete-lesson-btn"
              onClick={handleComplete}
              disabled={completing}
              style={{ width: '100%', opacity: completing ? 0.8 : 1 }}
            >
              {completing ? (
                <>
                  <span className="animate-spin" style={{ display: 'inline-block' }}>⭐</span>
                  Marking Complete…
                </>
              ) : (
                '🎯 Mark as Complete'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
