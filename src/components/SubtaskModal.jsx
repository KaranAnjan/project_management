import { useState } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById, getMembers } from '../data/mockData'
import DatePicker from './DatePicker'

const statuses = ['todo', 'in_progress', 'review', 'done']
const priorities = ['low', 'medium', 'high', 'critical']

export default function SubtaskModal({ subtask, onClose, onUpdate, onStatusToggle }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(subtask.title)
  const [status, setStatus] = useState(subtask.status)
  const [priority, setPriority] = useState(subtask.priority || 'medium')
  const [assignee, setAssignee] = useState(subtask.assignee || '')
  const [dueDate, setDueDate] = useState(new Date(subtask.dueDate).toISOString().split('T')[0])

  const allMembers = getMembers()
  const assigneeUser = getMemberById(subtask.assignee)
  const statusInfo = getStatusInfo(subtask.status)
  const priorityInfo = getPriorityInfo(subtask.priority || 'medium')
  const isOverdue = subtask.status !== 'done' && new Date(subtask.dueDate) < new Date()

  const handleSave = () => {
    onUpdate({
      title, status, priority,
      assignee: assignee || subtask.assignee,
      dueDate: new Date(dueDate).toISOString(),
    })
    setEditing(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editing ? 'Edit Subtask' : subtask.title}</h3>
          <div className="modal-header-actions">
            {!editing && (
              <button className="btn btn-ghost" onClick={onStatusToggle}>
                {subtask.status === 'done' ? '↩ Reopen' : '✓ Done'}
              </button>
            )}
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
                  {allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <DatePicker value={dueDate} onChange={setDueDate} />
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-body">
            <div className="task-detail-grid">
              <div className="task-detail-item">
                <label className="form-label">Status</label>
                <span className={`status-badge ${subtask.status}`}>{statusInfo.label}</span>
              </div>
              <div className="task-detail-item">
                <label className="form-label">Priority</label>
                <span className={`priority-badge ${subtask.priority || 'medium'}`}>{priorityInfo.label}</span>
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
                  {new Date(subtask.dueDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  {isOverdue && ' (overdue)'}
                </span>
              </div>
            </div>
            <div className="task-detail-item">
              <label className="form-label">Parent Task</label>
              <span>Linked to task</span>
            </div>
          </div>
        )}

        <div className="modal-footer">
          {editing ? (
            <div className="modal-footer-right" style={{ marginLeft: 'auto' }}>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Subtask</button>
          )}
        </div>
      </div>
    </div>
  )
}
