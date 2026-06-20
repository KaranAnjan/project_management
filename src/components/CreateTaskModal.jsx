import { useState } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById } from '../data/mockData'
import DatePicker from './DatePicker'

const statuses = ['todo', 'in_progress', 'review', 'done']
const priorities = ['low', 'medium', 'high', 'critical']

export default function CreateTaskModal({ projectId, members, onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('medium')
  const [assignee, setAssignee] = useState(members[0]?.id || '')
  const [dueDate, setDueDate] = useState('')
  const [subtasks, setSubtasks] = useState([])
  const [subtaskInput, setSubtaskInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !dueDate) return
    const task = {
      id: `t${Date.now()}`,
      projectId, title: title.trim(), description: description.trim() || '',
      status, priority, assignee,
      createdAt: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      subtasks,
    }
    onCreate(task)
  }

  const addSubtask = () => {
    if (!subtaskInput.trim()) return
    setSubtasks(prev => [...prev, { id: `sub_${Date.now()}`, title: subtaskInput.trim(), done: false }])
    setSubtaskInput('')
  }

  const removeSubtask = (id) => { setSubtasks(prev => prev.filter(s => s.id !== id)) }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button className="btn btn-ghost modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Task Name *</label>
              <input type="text" className="form-input" placeholder="Enter task name" value={title} onChange={e => setTitle(e.target.value)} autoFocus required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} placeholder="Brief description" value={description} onChange={e => setDescription(e.target.value)} />
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
                  {members.map(mid => {
                    const m = getMemberById(mid)
                    return m ? <option key={mid} value={mid}>{m.name}</option> : null
                  })}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <DatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subtasks ({subtasks.length})</label>
              <div className="subtask-edit-list">
                {subtasks.map(s => (
                  <div key={s.id} className="subtask-edit-row">
                    <span className="subtask-edit-title">{s.title}</span>
                    <button type="button" className="subtask-remove-btn" onClick={() => removeSubtask(s.id)}>×</button>
                  </div>
                ))}
              </div>
              <div className="subtask-add-row">
                <input type="text" className="form-input" placeholder="Add subtask..." value={subtaskInput}
                  onChange={e => setSubtaskInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubtask() } }} />
                <button type="button" className="btn btn-outline" onClick={addSubtask}>+</button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || !dueDate}>Create Task</button>
          </div>
        </form>
      </div>
    </div>
  )
}
