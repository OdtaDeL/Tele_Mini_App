import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getXPForNextLevel, getLevelTitle, formatNumber } from '../utils/helpers';
import ProgressRing from '../components/ProgressRing';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, getCompletedLessonsCount, getCompletedModulesCount } = useApp();
  const { user } = state;
  const xpInfo = getXPForNextLevel(user.xp);
  const completedLessons = getCompletedLessonsCount();
  const completedModules = getCompletedModulesCount();

  return (
    <div className="page page-top">

      {/* ── Identity block ── */}
      <div className="a-fadeUp" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProgressRing progress={xpInfo.progress} size={64} strokeWidth={3}>
            <div className="avatar" style={{ width: 50, height: 50, fontSize: '1.3rem' }}>
              {user.first_name[0]}
            </div>
          </ProgressRing>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1.2 }}>
              {user.first_name}
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: 2 }}>
              @{user.username}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              <span className="badge-level">Lv.{user.level} · {getLevelTitle(user.level)}</span>
              {user.streak > 0 && (
                <span className="badge-streak">{user.streak}d streak</span>
              )}
            </div>
          </div>
        </div>

        {/* XP progress strip */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 500 }}>
              Level {user.level} → {user.level + 1}
            </span>
            <span className="gold-text" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
              {formatNumber(xpInfo.current)} / {formatNumber(xpInfo.next)} XP
            </span>
          </div>
          <div className="progress-bar progress-bar-thick" style={{ borderRadius: 4 }}>
            <div className="progress-bar-fill a-progress" style={{ width: `${xpInfo.progress}%`, borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="a-fadeUp d-1" style={{ marginBottom: 24 }}>
        <p className="section-label">Stats</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { val: user.level,         label: 'Level' },
            { val: formatNumber(user.xp), label: 'XP' },
            { val: completedLessons,   label: 'Lessons' },
            { val: completedModules,   label: 'Modules' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.04em', color: 'var(--text-1)', lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-3)', marginTop: 5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="a-fadeUp d-2" style={{ marginBottom: 24 }}>
        <p className="section-label">Course Progress</p>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          {[
            { label: 'Lessons', val: completedLessons, total: state.lessons.length },
            { label: 'Modules', val: completedModules, total: state.modules.length },
          ].map((item, i) => {
            const pct = item.total > 0 ? Math.round((item.val / item.total) * 100) : 0;
            return (
              <div key={item.label} style={{ marginBottom: i === 0 ? 14 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: pct === 100 ? 'var(--green)' : 'var(--text-1)' }}>
                    {item.val}/{item.total}
                  </span>
                </div>
                <div className="progress-bar progress-bar-thick" style={{ borderRadius: 4 }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%`, borderRadius: 4, background: pct === 100 ? 'var(--green)' : undefined }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Account info ── */}
      <div className="a-fadeUp d-3" style={{ marginBottom: 24 }}>
        <p className="section-label">Account</p>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {[
            { label: 'Telegram ID', value: String(user.telegram_id) },
            { label: 'Username',    value: `@${user.username}` },
            { label: 'Member since', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
            { label: 'Role',        value: user.is_admin ? 'Admin' : 'Member' },
          ].map(item => (
            <div key={item.label} className="info-row">
              <span className="info-row-label">{item.label}</span>
              <span className="info-row-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin button */}
      {user.is_admin && (
        <div className="a-fadeUp d-4">
          <button
            className="btn btn-ghost btn-lg"
            id="admin-panel-btn"
            onClick={() => navigate('/admin')}
            style={{ width: '100%' }}
          >
            Admin Panel
          </button>
        </div>
      )}
    </div>
  );
}
