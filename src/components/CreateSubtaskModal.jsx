import { useState } from 'react'
import { getMembers, getMemberById } from '../data/mockData'
import DatePicker from './DatePicker'

const allMembers = getMembers()

export default function CreateSubtaskModal({ tasks, onClose, onCreate }) {
  const [taskId, setTaskId] = useState(tasks[0]?.id || '')
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [dueDate, setDueDate] = useState('')

  const selectedTask = tasks.find(t => t.id === taskId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !dueDate || !taskId) return
    const subtask = {
      id: `sub_${Date.now()}`,
      title: title.trim(),
      status: 'todo',
      priority: 'medium',
      assignee: assignee || selectedTask?.assignee || '',
      dueDate: new Date(dueDate).toISOString(),
    }
    onCreate(taskId, subtask)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Subtask</h3>
          <button className="btn btn-ghost modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Parent Task *</label>
              <select className="form-select" value={taskId} onChange={e => setTaskId(e.target.value)} required>
                <option value="">Select a task</option>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Subtask Name *</label>
              <input type="text" className="form-input" placeholder="Enter subtask name" value={title} onChange={e => setTitle(e.target.value)} autoFocus required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="form-select" value={assignee} onChange={e => setAssignee(e.target.value)}>
                  <option value="">Task assignee ({selectedTask ? getMemberById(selectedTask.assignee)?.name || 'unassigned' : 'unassigned'})</option>
                  {allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <DatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || !dueDate || !taskId}>Create Subtask</button>
          </div>
        </form>
      </div>
    </div>
  )
}
