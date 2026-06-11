import { useState } from 'react';

interface RewardChestProps {
  day: number;
  xpReward: number;
  onClaim: () => void;
  claimed: boolean;
  isClaimable: boolean;
}

export default function RewardChest({ day, xpReward, onClaim, claimed, isClaimable }: RewardChestProps) {
  const [opening, setOpening] = useState(false);

  const handleClaim = () => {
    if (!isClaimable || claimed || opening) return;
    setOpening(true);
    setTimeout(() => {
      setOpening(false);
      onClaim();
    }, 800);
  };

  const isOpened = claimed;

  return (
    <div
      onClick={handleClaim}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '12px 8px',
        borderRadius: '14px',
        background: isOpened
          ? 'rgba(0, 184, 148, 0.1)'
          : day === 7
          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 170, 0, 0.1))'
          : 'var(--color-bg-card)',
        border: `1px solid ${
          isOpened ? 'rgba(0, 184, 148, 0.3)' : day === 7 ? 'rgba(255, 215, 0, 0.3)' : 'var(--color-border)'
        }`,
        cursor: isClaimable && !claimed && !opening ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        minWidth: '70px',
        opacity: isClaimable || isOpened ? 1 : 0.5,
      }}
    >
      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
        Day {day}
      </span>
      <span
        className={opening ? 'animate-chestOpen' : ''}
        style={{ fontSize: day === 7 ? '2rem' : '1.5rem' }}
      >
        {isOpened ? '✅' : day === 7 ? '👑' : '🎁'}
      </span>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        color: isOpened ? 'var(--color-success)' : day === 7 ? 'var(--color-accent-gold)' : 'var(--color-accent-secondary)',
      }}>
        {isOpened ? 'Claimed' : `+${xpReward} XP`}
      </span>
    </div>
  );
}
