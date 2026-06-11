import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId } from '../../utils/helpers';
import type { Module } from '../../types';

export default function ModuleManager() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<Module | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', icon: '📘' });

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    if (editing) {
      dispatch({
        type: 'ADMIN_UPDATE_MODULE',
        payload: {
          ...editing,
          title: form.title,
          description: form.description,
          icon: form.icon,
        },
      });
    } else {
      const newModule: Module = {
        id: generateId(),
        title: form.title,
        description: form.description,
        icon: form.icon,
        order: state.modules.length + 1,
        lessons_count: 0,
      };
      dispatch({ type: 'ADMIN_ADD_MODULE', payload: newModule });
    }

    setForm({ title: '', description: '', icon: '📘' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (mod: Module) => {
    setEditing(mod);
    setForm({ title: mod.title, description: mod.description, icon: mod.icon });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this module and all its lessons?')) {
      dispatch({ type: 'ADMIN_DELETE_MODULE', payload: id });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          Modules ({state.modules.length})
        </h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', icon: '📘' }); }}
        >
          {showForm ? '✕ Cancel' : '+ Add Module'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="admin-card animate-fadeInDown" style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
            {editing ? 'Edit Module' : 'New Module'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                className="input"
                style={{ width: '60px', textAlign: 'center', fontSize: '1.5rem', padding: '8px' }}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="📘"
              />
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Module Title"
              />
            </div>
            <textarea
              className="input textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Module Description"
              style={{ minHeight: '60px' }}
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? '💾 Save Changes' : '➕ Create Module'}
            </button>
          </div>
        </div>
      )}

      {/* Module List */}
      {state.modules.sort((a, b) => a.order - b.order).map((mod) => (
        <div key={mod.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>{mod.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{mod.title}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {state.lessons.filter(l => l.module_id === mod.id).length} lessons · Order: {mod.order}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(mod)}>✏️</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(mod.id)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}
