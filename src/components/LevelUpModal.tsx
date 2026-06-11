import { useEffect, useState } from 'react';
import { getLevelTitle } from '../utils/helpers';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>([]);

  useEffect(() => {
    setShow(true);
    // Generate confetti particles
    const colors = ['#6c5ce7', '#00cec9', '#ffd700', '#ff6b6b', '#a29bfe', '#fd7014'];
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Confetti */}
        {show && particles.map(p => (
          <div
            key={p.id}
            className="confetti-particle animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Content */}
        <div className="animate-bounceIn" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎉</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>
            Level Up!
          </h2>
          <div className="gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '8px' }}>
            {level}
          </div>
          <p style={{ color: 'var(--color-accent-secondary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>
            {getLevelTitle(level)}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Keep going, you're doing amazing!
          </p>
          <button className="btn btn-primary btn-lg" onClick={onClose} style={{ width: '100%' }}>
            Awesome! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
