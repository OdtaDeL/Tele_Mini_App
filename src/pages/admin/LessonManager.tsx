import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateId } from '../../utils/helpers';
import type { Lesson } from '../../types';

export default function LessonManager() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterModule, setFilterModule] = useState<string>('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    module_id: '',
    video_url: '',
  });

  const filteredLessons = filterModule === 'all'
    ? state.lessons
    : state.lessons.filter(l => l.module_id === filterModule);

  const handleSubmit = () => {
    if (!form.title.trim() || !form.module_id) return;

    if (editing) {
      dispatch({
        type: 'ADMIN_UPDATE_LESSON',
        payload: {
          ...editing,
          title: form.title,
          description: form.description,
          content: form.content,
          module_id: form.module_id,
          video_url: form.video_url || undefined,
        },
      });
    } else {
      const moduleLessons = state.lessons.filter(l => l.module_id === form.module_id);
      const newLesson: Lesson = {
        id: generateId(),
        title: form.title,
        description: form.description,
        content: form.content,
        module_id: form.module_id,
        thumbnail: '',
        order: moduleLessons.length + 1,
        video_url: form.video_url || undefined,
      };
      dispatch({ type: 'ADMIN_ADD_LESSON', payload: newLesson });
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({ title: '', description: '', content: '', module_id: '', video_url: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditing(lesson);
    setForm({
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      module_id: lesson.module_id,
      video_url: lesson.video_url || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this lesson?')) {
      dispatch({ type: 'ADMIN_DELETE_LESSON', payload: id });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          Lessons ({filteredLessons.length})
        </h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
        >
          {showForm ? '✕ Cancel' : '+ Add Lesson'}
        </button>
      </div>

      {/* Module Filter */}
      <select
        className="input"
        value={filterModule}
        onChange={(e) => setFilterModule(e.target.value)}
        style={{ marginBottom: '16px' }}
      >
        <option value="all">All Modules</option>
        {state.modules.map(m => (
          <option key={m.id} value={m.id}>{m.icon} {m.title}</option>
        ))}
      </select>

      {/* Form */}
      {showForm && (
        <div className="admin-card a-slideDown" style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
            {editing ? 'Edit Lesson' : 'New Lesson'}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select
              className="input"
              value={form.module_id}
              onChange={(e) => setForm({ ...form, module_id: e.target.value })}
            >
              <option value="">Select Module</option>
              {state.modules.map(m => (
                <option key={m.id} value={m.id}>{m.icon} {m.title}</option>
              ))}
            </select>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Lesson Title"
            />
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short Description"
            />
            <textarea
              className="input textarea"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Lesson Content (Markdown supported)"
              style={{ minHeight: '120px' }}
            />
            <input
              className="input"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="Video Embed URL (optional)"
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Create Lesson'}
            </button>
          </div>
        </div>
      )}

      {/* Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[...filteredLessons].sort((a, b) => a.order - b.order).map((lesson) => {
          const mod = state.modules.find(m => m.id === lesson.module_id);
          return (
            <div key={lesson.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-1)' }}>{lesson.title}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: 2 }}>
                  {mod?.icon} {mod?.title}
                  {lesson.video_url && <span style={{ marginLeft: 8, color: 'var(--gold-bright)' }}>· Video</span>}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(lesson)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lesson.id)}>Del</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
