import { useState } from 'react'
import { getMembers, getDepartments } from '../data/mockData'
import DatePicker from './DatePicker'

const members = getMembers()
const depts = getDepartments()

export default function CreateProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [departmentId, setDepartmentId] = useState(depts[0].id)
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !dueDate) return
    const project = {
      id: `p${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'No description',
      status: 'planning', priority,
      category: depts.find(d => d.id === departmentId)?.name || '',
      departmentId, progress: 0,
      startDate: new Date().toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      members: selectedMembers.length ? selectedMembers : [members[0].id],
      createdBy: members[0].id,
      createdAt: new Date().toISOString(),
    }
    onCreate(project)
  }

  const toggleMember = (mid) => {
    setSelectedMembers(prev =>
      prev.includes(mid) ? prev.filter(id => id !== mid) : [...prev, mid]
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Project</h3>
          <button className="btn btn-ghost modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input type="text" className="form-input" placeholder="Enter project name" value={title} onChange={e => setTitle(e.target.value)} autoFocus required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} placeholder="Brief description of the project" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="form-row three">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={departmentId} onChange={e => setDepartmentId(e.target.value)}>
                  {depts.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <DatePicker value={dueDate} onChange={setDueDate} placeholder="Select due date" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Team Members</label>
              <div className="member-select-grid">
                {members.map(m => (
                  <label key={m.id} className={`member-check-item ${selectedMembers.includes(m.id) ? 'selected' : ''}`}>
                    <input type="checkbox" checked={selectedMembers.includes(m.id)} onChange={() => toggleMember(m.id)} className="member-check-input" />
                    <span className="member-avatar small" style={{ background: m.color }}>{m.avatar}</span>
                    <span>{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || !dueDate}>Create Project</button>
          </div>
        </form>
      </div>
    </div>
  )
}
