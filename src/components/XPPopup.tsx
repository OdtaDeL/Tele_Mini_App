import { useEffect } from 'react';

interface XPPopupProps {
  amount: number;
  onComplete: () => void;
}

export default function XPPopup({ amount, onComplete }: XPPopupProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        animation: 'xpFloat 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        userSelect: 'none',
        textAlign: 'center',
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #f5c518, #d4a017)',
        borderRadius: '20px',
        padding: '10px 22px',
        boxShadow: '0 8px 32px rgba(213,160,23,0.5), 0 0 60px rgba(213,160,23,0.2)',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '1.3rem' }}>⚡</span>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 900,
          color: '#0a0802',
          letterSpacing: '-0.02em',
        }}>
          +{amount} XP
        </span>
      </div>
    </div>
  );
}
