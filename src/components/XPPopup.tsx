import { useEffect, useState } from 'react';

interface XPPopupProps {
  amount: number;
  onComplete?: () => void;
}

export default function XPPopup({ amount, onComplete }: XPPopupProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        pointerEvents: 'none',
      }}
    >
      <div className="animate-xpFloat" style={{
        fontSize: '2rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #6c5ce7, #00cec9)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: 'none',
        filter: 'drop-shadow(0 0 20px rgba(108, 92, 231, 0.5))',
      }}>
        +{amount} XP
      </div>
    </div>
  );
}
