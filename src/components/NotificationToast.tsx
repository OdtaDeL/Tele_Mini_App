import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function NotificationToast() {
  const { state, dispatch } = useApp();
  const { notifications } = state;

  // Filter for achievement notifications
  const achievementNotifications = notifications.filter(n => n.type === 'achievement');

  useEffect(() => {
    if (achievementNotifications.length > 0) {
      const latest = achievementNotifications[achievementNotifications.length - 1];
      const timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: latest.id });
      }, 5000); // Auto dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [achievementNotifications, dispatch]);

  if (achievementNotifications.length === 0) return null;

  const latest = achievementNotifications[achievementNotifications.length - 1];
  
  // Clean up clean message (e.g. remove "Achievement unlocked: ")
  const achievementTitle = latest.message.replace('Achievement unlocked: ', '').replace('!', '');

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: '90%',
        maxWidth: '380px',
      }}
    >
      <div
        className="animate-bounceIn"
        style={{
          background: 'linear-gradient(135deg, rgba(253, 112, 20, 0.25), rgba(255, 215, 0, 0.15))',
          backgroundColor: '#131926',
          border: '2px solid rgba(255, 215, 0, 0.45)',
          borderRadius: '18px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          position: 'relative',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            boxShadow: 'inset 0 0 15px rgba(255, 215, 0, 0.15)',
            pointerEvents: 'none',
          }}
        />

        {/* Achievement Icon */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ffd700, #fd7014)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
            flexShrink: 0,
          }}
        >
          🏆
        </div>

        {/* Text Details */}
        <div style={{ flex: 1, paddingRight: '8px' }}>
          <h4
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              color: '#ffd700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
            }}
          >
            🏆 Thành Tích Mới!
          </h4>
          <p
            style={{
              margin: '3px 0 0 0',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            {achievementTitle}
          </p>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'rgba(255, 255, 255, 0.55)',
              display: 'block',
              marginTop: '2px',
            }}
          >
            Đã mở khóa phần thưởng thành tích
          </span>
        </div>

        {/* XP Reward Badge */}
        {latest.value && (
          <div
            style={{
              background: 'rgba(0, 184, 148, 0.15)',
              border: '1px solid rgba(0, 184, 148, 0.35)',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#00b894',
              boxShadow: '0 0 8px rgba(0, 184, 148, 0.15)',
              flexShrink: 0,
            }}
          >
            +{latest.value} XP
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: latest.id })}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '2px 4px',
            lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ×
        </button>
      </div>
    </div>
  );
}
