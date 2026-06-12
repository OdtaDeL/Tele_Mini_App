import { useEffect, useState } from 'react';
import { getLevelTitle } from '../utils/helpers';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#c9a227', '#e8bc3c', '#a07a10', '#f0d060', '#8a6c15', '#d4a030'];
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 60,
        color: colors[i % colors.length],
        delay: Math.random() * 0.5,
      }))
    );
  }, []);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Confetti */}
        {particles.map(p => (
          <div
            key={p.id}
            className="confetti-particle animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Top hairline */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'var(--gold)',
          opacity: 0.5,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }} className="animate-bounceIn">
          {/* Label */}
          <p style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12,
          }}>
            Level Up
          </p>

          {/* Big level number */}
          <div className="gold-text" style={{
            fontSize: '5.5rem', fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 1,
            marginBottom: 8,
          }}>
            {level}
          </div>

          {/* Title */}
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>
            {getLevelTitle(level)}
          </p>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', marginBottom: 28, lineHeight: 1.5 }}>
            You're making serious progress.
          </p>

          <button
            className="btn btn-primary btn-lg"
            id="level-up-close-btn"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
