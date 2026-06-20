import { useState } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById, calcTimeProgress } from '../data/mockData'

export default function TaskCard({ task, members, onClick, onUpdate, onToggleExpand, expanded }) {
  const [subtasks, setSubtasks] = useState(task.subtasks || [])
  const statusInfo = getStatusInfo(task.status)
  const priorityInfo = getPriorityInfo(task.priority)
  const assignee = getMemberById(task.assignee)
  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date()

  const subtaskCount = subtasks.length
  const doneSubtasks = subtasks.filter(s => s.status === 'done').length
  const subtaskProgress = subtaskCount ? Math.round((doneSubtasks / subtaskCount) * 100) : 0
  const timeProgress = calcTimeProgress(task.createdAt, task.dueDate)

  const toggleSubtask = (subId) => {
    const updated = subtasks.map(s =>
      s.id === subId ? { ...s, status: s.status === 'done' ? 'todo' : 'done' } : s
    )
    setSubtasks(updated)
    if (onUpdate) onUpdate({ subtasks: updated })
  }

  const handleMainClick = (e) => {
    if (e.target.closest('.task-card-expand') || e.target.closest('.subtask-inline-item')) return
    onClick()
  }

  return (
    <div className="task-card-wrapper">
      <div className={`task-card ${expanded ? 'expanded' : ''}`} onClick={handleMainClick}>
        <div className="task-card-left">
          <div className="task-card-content">
            <div className="task-card-title-row">
              <div className="task-card-title">{task.title}</div>
              {assignee && (
                <span className="member-avatar small" style={{ background: assignee.color }} title={assignee.name}>
                  {assignee.avatar}
                </span>
              )}
            </div>
            {task.description && <div className="task-card-desc">{task.description}</div>}
            <div className="task-card-sub-meta">
              {subtaskCount > 0 && <span className="subtask-indicator">✓ {doneSubtasks}/{subtaskCount}</span>}
              <span className="task-time-progress">
                <span className="time-progress-dot" style={{ background: timeProgress > 80 ? '#ef4444' : timeProgress > 50 ? '#f59e0b' : '#10b981' }} />
                {timeProgress}%
              </span>
            </div>
          </div>
        </div>
        <div className="task-card-right">
          {subtaskCount > 0 && (
            <div className="subtask-ring">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <circle cx="9" cy="9" r="7" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                <circle cx="9" cy="9" r="7" fill="none" stroke="#10b981" strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 7}`}
                  strokeDashoffset={`${2 * Math.PI * 7 * (1 - subtaskProgress / 100)}`}
                  transform="rotate(-90 9 9)" strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <span className={`priority-badge ${task.priority}`}>{priorityInfo.label}</span>
          <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue
              ? `${Math.abs(Math.ceil((new Date(task.dueDate) - new Date()) / 86400000))}d`
              : new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }
          </span>
          <button className="task-card-expand" onClick={(e) => { e.stopPropagation(); onToggleExpand() }}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && subtaskCount > 0 && (
        <div className="subtask-inline-list">
          {subtasks.map(s => {
            const subAssignee = getMemberById(s.assignee)
            const subInfo = getStatusInfo(s.status)
            const subOverdue = s.status !== 'done' && new Date(s.dueDate) < new Date()
            return (
              <div key={s.id} className={`subtask-inline-item ${s.status === 'done' ? 'done' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleSubtask(s.id) }}>
                <span className="subtask-inline-check">{s.status === 'done' ? '✓' : '○'}</span>
                <span className="subtask-inline-title">{s.title}</span>
                {subAssignee && (
                  <span className="member-avatar small" style={{ background: subAssignee.color }} title={subAssignee.name}>
                    {subAssignee.avatar}
                  </span>
                )}
                <span className={`status-dot mini`} style={{ background: subInfo.color }} />
                <span className="subtask-inline-meta">
                  <span className={`subtask-inline-date ${subOverdue ? 'overdue' : ''}`}>
                    {new Date(s.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
