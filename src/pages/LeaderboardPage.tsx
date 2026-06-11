import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatNumber, getLevelTitle } from '../utils/helpers';

type FilterType = 'global' | 'weekly' | 'monthly';

export default function LeaderboardPage() {
  const { state } = useApp();
  const [filter, setFilter] = useState<FilterType>('global');

  // Combine current user with leaderboard users
  const allUsers = useMemo(() => {
    const users = [state.user, ...state.leaderboardUsers.filter(u => !u.is_banned)];
    // Sort by XP descending
    return users.sort((a, b) => b.xp - a.xp);
  }, [state.user, state.leaderboardUsers]);

  const top3 = allUsers.slice(0, 3);
  const rest = allUsers.slice(3);

  const podiumColors = [
    { bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 170, 0, 0.1))', border: 'rgba(255, 215, 0, 0.3)', medal: '🥇', glow: 'rgba(255, 215, 0, 0.2)' },
    { bg: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(160, 160, 160, 0.1))', border: 'rgba(192, 192, 192, 0.3)', medal: '🥈', glow: 'rgba(192, 192, 192, 0.2)' },
    { bg: 'linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(160, 82, 45, 0.1))', border: 'rgba(205, 127, 50, 0.3)', medal: '🥉', glow: 'rgba(205, 127, 50, 0.2)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
      </div>

      {/* Filter Tabs */}
      <div className="tabs animate-fadeInUp" style={{ marginBottom: '20px' }}>
        {(['global', 'weekly', 'monthly'] as FilterType[]).map((f) => (
          <button
            key={f}
            className={`tab ${filter === f ? 'tab-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="animate-fadeInUp delay-100" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '10px',
        marginBottom: '24px',
        padding: '0 8px',
      }}>
        {/* 2nd Place */}
        {top3[1] && (
          <div style={{
            flex: 1,
            background: podiumColors[1].bg,
            border: `1px solid ${podiumColors[1].border}`,
            borderRadius: '16px',
            padding: '16px 8px',
            textAlign: 'center',
            boxShadow: `0 0 20px ${podiumColors[1].glow}`,
            animation: 'fadeInUp 0.4s ease-out 0.2s both',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{podiumColors[1].medal}</div>
            <div className="avatar avatar-md" style={{ margin: '0 auto 8px', background: 'linear-gradient(135deg, #e8e8e8, #a0a0a0)' }}>
              {top3[1].first_name[0]}
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>{top3[1].username}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Lvl {top3[1].level}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: podiumColors[1].border, marginTop: '4px' }}>
              {formatNumber(top3[1].xp)} XP
            </p>
          </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <div style={{
            flex: 1.2,
            background: podiumColors[0].bg,
            border: `1px solid ${podiumColors[0].border}`,
            borderRadius: '20px',
            padding: '20px 8px',
            textAlign: 'center',
            boxShadow: `0 0 30px ${podiumColors[0].glow}`,
            animation: 'fadeInUp 0.4s ease-out 0.1s both',
            transform: 'translateY(-8px)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>👑</div>
            <div className="avatar avatar-lg" style={{ margin: '0 auto 8px', background: 'linear-gradient(135deg, #ffd700, #ffaa00)' }}>
              {top3[0].first_name[0]}
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' }}>{top3[0].username}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Lvl {top3[0].level} · {getLevelTitle(top3[0].level)}</p>
            <p className="gradient-text" style={{ fontSize: '1rem', fontWeight: 800, marginTop: '4px' }}>
              {formatNumber(top3[0].xp)} XP
            </p>
          </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <div style={{
            flex: 1,
            background: podiumColors[2].bg,
            border: `1px solid ${podiumColors[2].border}`,
            borderRadius: '16px',
            padding: '16px 8px',
            textAlign: 'center',
            boxShadow: `0 0 20px ${podiumColors[2].glow}`,
            animation: 'fadeInUp 0.4s ease-out 0.3s both',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{podiumColors[2].medal}</div>
            <div className="avatar avatar-md" style={{ margin: '0 auto 8px', background: 'linear-gradient(135deg, #cd7f32, #a0522d)' }}>
              {top3[2].first_name[0]}
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>{top3[2].username}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Lvl {top3[2].level}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: podiumColors[2].border, marginTop: '4px' }}>
              {formatNumber(top3[2].xp)} XP
            </p>
          </div>
        )}
      </div>

      {/* Rest of Rankings */}
      <div className="animate-fadeInUp delay-200">
        {rest.map((user, idx) => {
          const rank = idx + 4;
          const isCurrentUser = user.id === state.user.id;

          return (
            <div
              key={user.id}
              className={isCurrentUser ? 'card-glow' : 'card'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
                padding: '12px 16px',
                background: isCurrentUser
                  ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 206, 201, 0.05))'
                  : undefined,
              }}
            >
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                minWidth: '28px',
                textAlign: 'center',
              }}>
                #{rank}
              </span>
              <div className="avatar avatar-sm">
                {user.first_name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {user.username}
                  {isCurrentUser && <span style={{ color: 'var(--color-accent-secondary)', fontSize: '0.75rem' }}> (You)</span>}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  Lvl {user.level} · 🔥 {user.streak}
                </p>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-accent-secondary)' }}>
                {formatNumber(user.xp)} XP
              </span>
            </div>
          );
        })}
      </div>

      {/* Your Rank */}
      <div className="animate-fadeInUp delay-300" style={{
        marginTop: '16px',
        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(0, 206, 201, 0.1))',
        border: '1px solid rgba(108, 92, 231, 0.2)',
        borderRadius: '16px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Your Rank</p>
        <p className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          #{allUsers.findIndex(u => u.id === state.user.id) + 1}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          out of {allUsers.length} members
        </p>
      </div>
    </div>
  );
}
