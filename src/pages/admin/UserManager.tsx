import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function UserManager() {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');

  const allUsers = [state.user, ...state.leaderboardUsers];
  const filtered = search
    ? allUsers.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.first_name.toLowerCase().includes(search.toLowerCase()) ||
        u.telegram_id.includes(search)
      )
    : allUsers;

  return (
    <div>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>
        Users ({allUsers.length})
      </h3>

      <input
        className="input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, username or ID…"
        style={{ marginBottom: '16px' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((user) => {
          const isCurrentUser = user.id === state.user.id;

          return (
            <div key={user.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar avatar-sm">{user.first_name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-1)' }}>
                    {user.first_name}
                  </p>
                  {isCurrentUser && (
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--gold-bright)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      You
                    </span>
                  )}
                  {user.is_banned && (
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Banned
                    </span>
                  )}
                  {user.is_admin && (
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Admin
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 1 }}>
                  @{user.username} · ID: {user.telegram_id}
                </p>
              </div>
              {!isCurrentUser && (
                <button
                  className={`btn ${user.is_banned ? 'btn-secondary' : 'btn-danger'} btn-sm`}
                  onClick={() => dispatch({ type: 'ADMIN_BAN_USER', payload: user.id })}
                >
                  {user.is_banned ? 'Unban' : 'Ban'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
