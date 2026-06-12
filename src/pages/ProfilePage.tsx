import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, getCompletedLessonsCount, getCompletedModulesCount } = useApp();
  const { user } = state;

  const completedLessons = getCompletedLessonsCount();
  const completedModules = getCompletedModulesCount();
  const totalLessons = state.lessons.length;
  const totalModules = state.modules.length;
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="page page-top">

      {/* ── Identity ── */}
      <div className="a-fadeUp" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, flexShrink: 0,
            background: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.5rem', color: 'var(--gold-fg)',
          }}>
            {user.first_name[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1.2 }}>
              {user.first_name}
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: 3 }}>
              @{user.username}
            </p>
          </div>
          {user.is_admin && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px',
              background: 'rgba(201,162,39,0.1)', color: 'var(--gold-bright)',
              borderRadius: 99, border: '1px solid rgba(201,162,39,0.2)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Admin
            </span>
          )}
        </div>
      </div>

      {/* ── Progress summary ── */}
      <div className="a-fadeUp d-1" style={{ marginBottom: 24 }}>
        <p className="section-label">Course Progress</p>
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}>
          {/* Big number */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 14 }}>
            <span className="gold-text" style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>
              {overallPct}%
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', paddingBottom: 8 }}>
              overall
            </span>
          </div>

          {/* Progress bars */}
          {[
            { label: 'Lessons', val: completedLessons, total: totalLessons },
            { label: 'Modules', val: completedModules, total: totalModules },
          ].map((item, i) => {
            const pct = item.total > 0 ? Math.round((item.val / item.total) * 100) : 0;
            return (
              <div key={item.label} style={{ marginBottom: i === 0 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-2)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: pct === 100 ? 'var(--green)' : 'var(--text-1)' }}>
                    {item.val}/{item.total}
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 4, borderRadius: 2 }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${pct}%`, borderRadius: 2, background: pct === 100 ? 'var(--green)' : undefined }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="a-fadeUp d-2" style={{ marginBottom: 24 }}>
        <p className="section-label">Activity</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { val: completedLessons, label: 'Lessons Completed', sub: `of ${totalLessons} total` },
            { val: completedModules, label: 'Modules Completed', sub: `of ${totalModules} total` },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '2rem', letterSpacing: '-0.05em', color: 'var(--text-1)', lineHeight: 1, marginBottom: 4 }}>
                {s.val}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 2 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Account ── */}
      <div className="a-fadeUp d-3" style={{ marginBottom: 24 }}>
        <p className="section-label">Account</p>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {[
            { label: 'Telegram ID',  value: String(user.telegram_id) },
            { label: 'Username',     value: `@${user.username}` },
            { label: 'Member since', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
            { label: 'Role',         value: user.is_admin ? 'Admin' : 'Member' },
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
