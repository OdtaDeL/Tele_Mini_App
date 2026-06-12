import { useEffect } from 'react';

interface XPPopupProps {
  amount: number;
  onComplete: () => void;
}

export default function XPPopup({ amount, onComplete }: XPPopupProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '28%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        animation: 'xpRise 2s cubic-bezier(0.16,1,0.3,1) forwards',
        userSelect: 'none',
      }}
    >
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-gold)',
        borderRadius: 99,
        padding: '8px 18px',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold-bright)', letterSpacing: '-0.02em' }}>
          +{amount} XP
        </span>
      </div>
    </div>
  );
}
