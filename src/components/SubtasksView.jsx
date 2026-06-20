import { useState, useMemo } from 'react'
import { getStatusInfo, getMemberById, getDepartmentById } from '../data/mockData'
import SubtaskModal from './SubtaskModal'
import CreateSubtaskModal from './CreateSubtaskModal'

export default function SubtasksView({ projects, tasks, onUpdateTask, onSelectProject, filterTaskId }) {
  const [selectedSubtask, setSelectedSubtask] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredTasks = useMemo(() => {
    if (!filterTaskId) return tasks
    return tasks.filter(t => t.id === filterTaskId)
  }, [tasks, filterTaskId])

  const selectedTask = useMemo(() => {
    if (!filterTaskId) return null
    return tasks.find(t => t.id === filterTaskId)
  }, [tasks, filterTaskId])

  const allSubtasks = useMemo(() => {
    const subs = []
    filteredTasks.forEach(task => {
      if (task.subtasks) {
        task.subtasks.forEach(s => {
          const project = projects.find(p => p.id === task.projectId)
          subs.push({ ...s, parentTaskId: task.id, parentTaskTitle: task.title, project })
        })
      }
    })
    if (filterStatus !== 'all') return subs.filter(s => s.status === filterStatus)
    return subs
  }, [filteredTasks, filterStatus, projects])

  const statusCounts = useMemo(() => {
    const counts = { all: allSubtasks.length }
    allSubtasks.forEach(s => { counts[s.status] = (counts[s.status] || 0) + 1 })
    return counts
  }, [allSubtasks])

  const handleCreateSubtask = (taskId, subtask) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      const updated = [...(task.subtasks || []), subtask]
      onUpdateTask(taskId, { subtasks: updated })
    }
    setShowCreate(false)
  }

  return (
    <div className="tasks-view">
      <div className="tasks-view-header">
        <h2>{filterTaskId && selectedTask ? `Subtasks: ${selectedTask.title}` : `All Subtasks (${allSubtasks.length})`}</h2>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Subtask</button>
      </div>

      <div className="tasks-status-filters">
        <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
          All ({statusCounts.all})
        </button>
        {['todo', 'in_progress', 'review', 'done'].map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
            {getStatusInfo(s).label} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      {allSubtasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⊞</div>
          <h3>No subtasks yet</h3>
          <p>Create a subtask to get started</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Subtask</button>
        </div>
      ) : (
        <div className="task-list-full">
          {allSubtasks.map(s => {
            const assignee = getMemberById(s.assignee)
            const statusInfo = getStatusInfo(s.status)
            const dept = s.project ? getDepartmentById(s.project.departmentId) : null
            const isOverdue = s.status !== 'done' && new Date(s.dueDate) < new Date()

            return (
              <div key={s.id} className="task-row">
                <div className="task-row-main" onClick={() => setSelectedSubtask(s)}>
                  <div className="task-row-left">
                    <span className="task-row-status" style={{ background: statusInfo.color }} />
                    <div className="task-row-info">
                      <div className="task-row-title-row">
                        <div className="task-row-title">{s.title}</div>
                        {assignee && (
                          <span className="member-avatar small" style={{ background: assignee.color }} title={assignee.name}>
                            {assignee.avatar}
                          </span>
                        )}
                      </div>
                      <div className="task-row-meta">
                        <span className="task-row-project" onClick={e => { e.stopPropagation(); onSelectProject(s.project?.id) }}>
                          in {s.parentTaskTitle}
                        </span>
                        {dept && <span className="dept-tag" style={{ background: dept.color }}>{dept.icon} {dept.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="task-row-center">
                    <span className={`status-badge ${s.status}`}>{statusInfo.label}</span>
                  </div>
                  <div className="task-row-right">
                    <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                      {new Date(s.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedSubtask && (
        <SubtaskModal
          subtask={selectedSubtask}
          onClose={() => setSelectedSubtask(null)}
          onUpdate={(updates) => {
            const task = tasks.find(t => t.id === selectedSubtask.parentTaskId)
            if (task) {
              const updatedSubtasks = task.subtasks.map(st =>
                st.id === selectedSubtask.id ? { ...st, ...updates } : st
              )
              onUpdateTask(selectedSubtask.parentTaskId, { subtasks: updatedSubtasks })
              setSelectedSubtask(prev => ({ ...prev, ...updates }))
            }
          }}
          onStatusToggle={() => {
            const task = tasks.find(t => t.id === selectedSubtask.parentTaskId)
            if (task) {
              const updatedSubtasks = task.subtasks.map(st =>
                st.id === selectedSubtask.id
                  ? { ...st, status: st.status === 'done' ? 'todo' : 'done' }
                  : st
              )
              onUpdateTask(selectedSubtask.parentTaskId, { subtasks: updatedSubtasks })
              setSelectedSubtask(prev => ({ ...prev, status: prev.status === 'done' ? 'todo' : 'done' }))
            }
          }}
        />
      )}

      {showCreate && (
        <CreateSubtaskModal
          tasks={tasks}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateSubtask}
        />
      )}
    </div>
  )
}
