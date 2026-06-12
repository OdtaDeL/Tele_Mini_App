import { useEffect, useState } from 'react';
import { getLevelTitle } from '../utils/helpers';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    setShow(true);
    const colors = ['#f5c518', '#d4a017', '#e67e22', '#ffd700', '#ffb300', '#fff3b0'];
    const newParticles = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.6,
      size: 5 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Gold shimmer top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #f5c518, #d4a017, #f5c518, transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
        }} />

        {/* Confetti particles */}
        {show && particles.map(p => (
          <div
            key={p.id}
            className="confetti-particle animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: p.id % 3 === 0 ? '50%' : '2px',
            }}
          />
        ))}

        {/* Ambient glow behind level number */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '150px', height: '150px',
          background: 'radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Content */}
        <div className="animate-bounceIn" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '8px', lineHeight: 1 }}>🎉</div>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.15em', color: 'var(--color-text-muted)', marginBottom: '6px',
          }}>
            Level Up!
          </p>
          <div
            className="gradient-text-bright"
            style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, marginBottom: '4px', letterSpacing: '-0.03em' }}
          >
            {level}
          </div>
          <p style={{
            color: 'var(--color-accent-secondary)', fontWeight: 700,
            fontSize: '1.15rem', marginBottom: '6px',
          }}>
            {getLevelTitle(level)}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.5 }}>
            You're on fire! Keep pushing forward.
          </p>
          <button
            className="btn btn-primary btn-lg"
            id="level-up-close-btn"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Awesome! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
