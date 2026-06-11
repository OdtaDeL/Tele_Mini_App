import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatNumber } from '../../utils/helpers';

export default function UserManager() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [xpGrant, setXpGrant] = useState<{ userId: string; amount: string } | null>(null);

  const allUsers = [state.user, ...state.leaderboardUsers];
  const filtered = search
    ? allUsers.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.first_name.toLowerCase().includes(search.toLowerCase()) ||
        u.telegram_id.includes(search)
      )
    : allUsers;

  const handleGrantXP = (userId: string) => {
    if (!xpGrant || !xpGrant.amount) return;
    const amount = parseInt(xpGrant.amount);
    if (isNaN(amount)) return;

    dispatch({ type: 'ADMIN_GRANT_XP', payload: { userId, amount } });
    setXpGrant(null);
  };

  return (
    <div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>
        Users ({allUsers.length})
      </h3>

      {/* Search */}
      <input
        className="input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Search users..."
        style={{ marginBottom: '16px' }}
      />

      {/* User List */}
      {filtered.map((user) => {
        const isCurrentUser = user.id === state.user.id;
        const isGranting = xpGrant?.userId === user.id;

        return (
          <div key={user.id} className="admin-card" style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="avatar avatar-sm">{user.first_name[0]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {user.username}
                  {isCurrentUser && <span style={{ color: 'var(--color-accent-secondary)', fontSize: '0.75rem' }}> (You)</span>}
                  {user.is_banned && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem' }}> [Banned]</span>}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  Lvl {user.level} · {formatNumber(user.xp)} XP · ID: {user.telegram_id}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setXpGrant(isGranting ? null : { userId: user.id, amount: '' })}
                  title="Grant XP"
                >
                  💎
                </button>
                {!isCurrentUser && (
                  <button
                    className={`btn ${user.is_banned ? 'btn-primary' : 'btn-danger'} btn-sm`}
                    onClick={() => dispatch({ type: 'ADMIN_BAN_USER', payload: user.id })}
                    title={user.is_banned ? 'Unban' : 'Ban'}
                  >
                    {user.is_banned ? '✅' : '🚫'}
                  </button>
                )}
              </div>
            </div>

            {/* XP Grant Form */}
            {isGranting && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                <input
                  className="input"
                  type="number"
                  value={xpGrant.amount}
                  onChange={(e) => setXpGrant({ ...xpGrant, amount: e.target.value })}
                  placeholder="XP amount (negative to remove)"
                  style={{ flex: 1, fontSize: '0.85rem' }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleGrantXP(user.id)}
                >
                  Grant
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
