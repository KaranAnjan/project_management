import { useState } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById } from '../data/mockData'
import DatePicker from './DatePicker'

const statuses = ['todo', 'in_progress', 'review', 'done']
const priorities = ['low', 'medium', 'high', 'critical']

export default function TaskModal({ task, members, onClose, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState(task.priority)
  const [assignee, setAssignee] = useState(task.assignee)
  const [dueDate, setDueDate] = useState(new Date(task.dueDate).toISOString().split('T')[0])

  const [subtasks, setSubtasks] = useState(task.subtasks || [])
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [newSubtaskAssignee, setNewSubtaskAssignee] = useState(task.assignee || '')
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])
  const [newSubtaskTitleView, setNewSubtaskTitleView] = useState('')
  const [newSubtaskAssigneeView, setNewSubtaskAssigneeView] = useState(task.assignee || '')
  const [newSubtaskDueDateView, setNewSubtaskDueDateView] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])

  const assigneeUser = getMemberById(task.assignee)
  const statusInfo = getStatusInfo(task.status)
  const priorityInfo = getPriorityInfo(task.priority)

  const doneSubtasks = subtasks.filter(s => s.status === 'done').length
  const subtaskProgress = subtasks.length ? Math.round((doneSubtasks / subtasks.length) * 100) : 0

  const saveSubtasks = (updated) => {
    setSubtasks(updated)
    onUpdate({ subtasks: updated })
  }

  const toggleSubtask = (subId) => {
    const updated = subtasks.map(s => s.id === subId ? { ...s, status: s.status === 'done' ? 'todo' : 'done' } : s)
    saveSubtasks(updated)
  }

  const addSubtaskFromView = () => {
    if (!newSubtaskTitleView.trim() || !newSubtaskDueDateView) return
    const updated = [...subtasks, {
      id: `sub_${Date.now()}`, title: newSubtaskTitleView.trim(),
      status: 'todo', priority: 'medium',
      assignee: newSubtaskAssigneeView || task.assignee || '',
      dueDate: new Date(newSubtaskDueDateView).toISOString(),
    }]
    saveSubtasks(updated)
    setNewSubtaskTitleView('')
  }

  const addSubtaskFromEdit = () => {
    if (!newSubtaskTitle.trim() || !newSubtaskDueDate) return
    setSubtasks(prev => [...prev, {
      id: `sub_${Date.now()}`, title: newSubtaskTitle.trim(),
      status: 'todo', priority: 'medium',
      assignee: newSubtaskAssignee || task.assignee || '',
      dueDate: new Date(newSubtaskDueDate).toISOString(),
    }])
    setNewSubtaskTitle('')
  }

  const removeSubtask = (subId) => {
    const updated = subtasks.filter(s => s.id !== subId)
    if (editing) setSubtasks(updated)
    else saveSubtasks(updated)
  }

  const handleSave = () => {
    onUpdate({
      title, description, status, priority, assignee,
      dueDate: new Date(dueDate).toISOString(),
      subtasks,
    })
    setEditing(false)
  }

  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editing ? 'Edit Task' : task.title}</h3>
          <div className="modal-header-actions">
            <button className="btn btn-ghost" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
            <button className="btn btn-ghost modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        {editing ? (
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                  {statuses.map(s => <option key={s} value={s}>{getStatusInfo(s).label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  {priorities.map(p => <option key={p} value={p}>{getPriorityInfo(p).label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <DatePicker value={dueDate} onChange={setDueDate} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subtasks ({doneSubtasks}/{subtasks.length})</label>
              <div className="subtask-edit-list">
                {subtasks.length === 0 && <p className="empty-text" style={{ padding: '8px', fontSize: '13px' }}>No subtasks yet</p>}
                {subtasks.map(s => (
                  <div key={s.id} className="subtask-edit-row">
                    <label className="subtask-check-label">
                      <input type="checkbox" checked={s.status === 'done'} onChange={() => toggleSubtask(s.id)} className="subtask-check" />
                      <span className={`subtask-edit-title ${s.status === 'done' ? 'done' : ''}`}>{s.title}</span>
                    </label>
                    <button className="subtask-remove-btn" onClick={() => removeSubtask(s.id)}>×</button>
                  </div>
                ))}
              </div>
              <div className="subtask-add-form">
                <input type="text" className="form-input" placeholder="Subtask name" value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtaskFromEdit() } }} />
                <div className="subtask-add-form-row">
                  <select className="form-select" value={newSubtaskAssignee} onChange={e => setNewSubtaskAssignee(e.target.value)}>
                    <option value="">Assignee ({getMemberById(task.assignee)?.name || 'unassigned'})</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <DatePicker value={newSubtaskDueDate} onChange={setNewSubtaskDueDate} />
                  <button type="button" className="btn btn-primary" onClick={addSubtaskFromEdit}>+ Add</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="task-detail-section">
              <label className="form-label">Description</label>
              <p className="task-detail-text">{task.description || 'No description'}</p>
            </div>
            <div className="task-detail-grid">
              <div className="task-detail-item">
                <label className="form-label">Status</label>
                <span className={`status-badge ${task.status}`}>{statusInfo.label}</span>
              </div>
              <div className="task-detail-item">
                <label className="form-label">Priority</label>
                <span className={`priority-badge ${task.priority}`}>{priorityInfo.label}</span>
              </div>
              <div className="task-detail-item">
                <label className="form-label">Assignee</label>
                {assigneeUser ? (
                  <div className="member-tag">
                    <span className="member-avatar small" style={{ background: assigneeUser.color }}>{assigneeUser.avatar}</span>
                    <span>{assigneeUser.name}</span>
                  </div>
                ) : <span className="unassigned">Unassigned</span>}
              </div>
              <div className="task-detail-item">
                <label className="form-label">Due Date</label>
                <span className={isOverdue ? 'date-overdue' : ''}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  {isOverdue && ' (overdue)'}
                </span>
              </div>
            </div>
            <div className="task-detail-item">
              <label className="form-label">Created</label>
              <span>{new Date(task.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>

            <div className="task-subtasks-section">
              <label className="form-label">Subtasks ({doneSubtasks}/{subtasks.length})</label>
              <div className="subtask-progress-mini">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill completed" style={{ width: `${subtaskProgress}%` }} />
                </div>
              </div>
              <div className="subtask-view-list">
                {subtasks.length === 0 && (
                  <p className="empty-text" style={{ padding: '8px 0', fontSize: '13px' }}>No subtasks yet. Add one below.</p>
                )}
                {subtasks.map(s => (
                  <div key={s.id} className={`subtask-view-item ${s.status === 'done' ? 'done' : ''}`} onClick={() => toggleSubtask(s.id)}>
                    <span className="subtask-view-check">{s.status === 'done' ? '✓' : '○'}</span>
                    <span className="subtask-view-title">{s.title}</span>
                  </div>
                ))}
              </div>
              <div className="subtask-add-form" style={{ marginTop: '8px' }}>
                <input type="text" className="form-input" placeholder="Subtask name" value={newSubtaskTitleView}
                  onChange={e => setNewSubtaskTitleView(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtaskFromView() } }} />
                <div className="subtask-add-form-row">
                  <select className="form-select" value={newSubtaskAssigneeView} onChange={e => setNewSubtaskAssigneeView(e.target.value)}>
                    <option value="">Assignee ({getMemberById(task.assignee)?.name || 'unassigned'})</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                  <DatePicker value={newSubtaskDueDateView} onChange={setNewSubtaskDueDateView} />
                  <button type="button" className="btn btn-primary" onClick={addSubtaskFromView}>+ Add</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          {editing ? (
            <>
              <button className="btn btn-danger" onClick={() => { onDelete(); onClose() }}>Delete</button>
              <div className="modal-footer-right">
                <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-danger" onClick={() => { onDelete(); onClose() }}>Delete</button>
              <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Task</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
