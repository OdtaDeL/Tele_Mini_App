import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateId, DAILY_REWARD_XP } from '../utils/helpers';
import RewardChest from '../components/RewardChest';
import XPPopup from '../components/XPPopup';

export default function RewardsPage() {
  const { state, dispatch, hasClaimedToday, getDailyRewardDay, checkAndGrantAchievements } = useApp();
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);

  const claimed = hasClaimedToday();
  const currentDay = getDailyRewardDay();

  const handleClaimDaily = () => {
    if (claimed) return;

    dispatch({ type: 'CLAIM_DAILY_REWARD' });

    const nextDay = (currentDay % 7) + 1;
    const xp = DAILY_REWARD_XP[nextDay - 1] || 10;
    setXpAmount(xp);
    setShowXP(true);

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: generateId(),
        type: 'reward',
        message: `Daily reward claimed: +${xp} XP!`,
        value: xp,
        timestamp: Date.now(),
      },
    });

    setTimeout(() => checkAndGrantAchievements(), 500);
  };

  // Achievements
  const earnedIds = new Set(
    state.userAchievements
      .filter(ua => ua.user_id === state.user.id)
      .map(ua => ua.achievement_id)
  );

  return (
    <div className="page">
      {showXP && <XPPopup amount={xpAmount} onComplete={() => setShowXP(false)} />}

      <div className="page-header">
        <h1 className="page-title">🎁 Rewards</h1>
      </div>

      {/* Daily Streak */}
      <div className="animate-fadeInUp" style={{
        background: 'linear-gradient(135deg, rgba(253, 112, 20, 0.15), rgba(255, 215, 0, 0.1))',
        border: '1px solid rgba(253, 112, 20, 0.2)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔥</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
          {state.user.streak} Day Streak
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {claimed ? 'Come back tomorrow!' : 'Claim your daily reward below!'}
        </p>
      </div>

      {/* Daily Rewards Grid */}
      <div className="animate-fadeInUp delay-100">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>Daily Rewards</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '12px',
        }}>
          {DAILY_REWARD_XP.slice(0, 4).map((xp, idx) => {
            const day = idx + 1;
            const isClaimed = day <= currentDay;
            const isClaimable = day === currentDay + 1 && !claimed;

            return (
              <RewardChest
                key={day}
                day={day}
                xpReward={xp}
                claimed={isClaimed}
                isClaimable={isClaimable}
                onClaim={isClaimable ? handleClaimDaily : () => {}}
              />
            );
          })}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '20px',
        }}>
          {DAILY_REWARD_XP.slice(4).map((xp, idx) => {
            const day = idx + 5;
            const isClaimed = day <= currentDay;
            const isClaimable = day === currentDay + 1 && !claimed;

            return (
              <RewardChest
                key={day}
                day={day}
                xpReward={xp}
                claimed={isClaimed}
                isClaimable={isClaimable}
                onClaim={isClaimable ? handleClaimDaily : () => {}}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Claim Button */}
      {!claimed && (
        <div className="animate-fadeInUp delay-200" style={{ marginBottom: '24px' }}>
          <button
            className="btn btn-primary btn-lg animate-pulse"
            onClick={handleClaimDaily}
            style={{ width: '100%' }}
          >
            🎁 Claim Daily Reward (+{DAILY_REWARD_XP[currentDay % 7] || 10} XP)
          </button>
        </div>
      )}

      {/* Achievements Section */}
      <div className="animate-fadeInUp delay-300">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>🏅 Achievements</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {earnedIds.size}/{state.achievements.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {state.achievements.map((achievement) => {
            const earned = earnedIds.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={earned ? 'card-glow' : 'card'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  opacity: earned ? 1 : 0.6,
                }}
              >
                <span style={{
                  fontSize: '2rem',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: earned ? 'rgba(108, 92, 231, 0.15)' : 'var(--color-bg-elevated)',
                  borderRadius: '12px',
                  filter: earned ? 'none' : 'grayscale(0.5)',
                }}>
                  {achievement.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{achievement.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {achievement.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {earned ? (
                    <span className="badge badge-success">✅ Earned</span>
                  ) : (
                    <span className="badge badge-xp">+{achievement.xp_reward} XP</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
