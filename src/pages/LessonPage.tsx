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

    // XP popup
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

    // Check for level up (need to calculate manually since dispatch is async)
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
    // Mark as in_progress when viewing
    if (lesson && status === 'not_started') {
      // We don't dispatch in_progress to keep it simple
    }
  }, [lesson, status]);

  if (!lesson || !module) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
          <p style={{ color: 'var(--color-text-muted)' }}>Lesson not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/learn')} style={{ marginTop: '16px' }}>
            Back to Learn
          </button>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering
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

    const formatInline = (text: string): string => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/❌/g, '<span style="color: #ff6b6b">❌</span>')
        .replace(/✅/g, '<span style="color: #00b894">✅</span>');
    };

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === '') {
        flushList();
        continue;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(4)) }} />
        );
        continue;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(3)) }} />
        );
        continue;
      }
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />
        );
        continue;
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        flushList();
        elements.push(
          <blockquote key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />
        );
        continue;
      }

      // List items
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

      // Paragraph
      flushList();
      elements.push(
        <p key={elements.length} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
    flushList();
    return elements;
  };

  return (
    <div className="page" style={{ paddingBottom: '120px' }}>
      {/* XP Popup */}
      {showXP && <XPPopup amount={xpAmount} onComplete={() => setShowXP(false)} />}

      {/* Level Up Modal */}
      {showLevelUp && <LevelUpModal level={levelUpValue} onClose={() => setShowLevelUp(false)} />}

      {/* Header */}
      <div className="page-header">
        <button className="page-back-btn" onClick={() => navigate('/learn')}>←</button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {module.icon} {module.title}
          </p>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{lesson.title}</h1>
        </div>
        {status === 'completed' && (
          <span className="badge badge-success">✅ Done</span>
        )}
      </div>

      {/* XP Reward Banner */}
      <div className="animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(0, 206, 201, 0.1))',
        border: '1px solid rgba(108, 92, 231, 0.2)',
        borderRadius: '14px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Lesson Reward
        </span>
        <span className="badge badge-xp" style={{ fontSize: '0.85rem' }}>
          ⚡ +{lesson.xp_reward} XP
        </span>
      </div>

      {/* Video Embed */}
      {lesson.video_url && (
        <div className="animate-fadeInUp delay-100" style={{
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '20px',
          border: '1px solid var(--color-border)',
        }}>
          <iframe
            src={lesson.video_url}
            style={{ width: '100%', aspectRatio: '16/9', border: 'none' }}
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}

      {/* Lesson Content */}
      <div className="lesson-content animate-fadeInUp delay-200" style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
      }}>
        {renderContent(lesson.content)}
      </div>

      {/* Complete Button */}
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '16px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--color-bg-primary) 60%, transparent)',
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {status === 'completed' ? (
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/learn')}
              style={{ width: '100%' }}
            >
              ✅ Completed — Back to Lessons
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg animate-glow"
              onClick={handleComplete}
              disabled={completing}
              style={{ width: '100%' }}
            >
              {completing ? '🎉 Completing...' : '🎯 Mark as Completed'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
