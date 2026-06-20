import { useState, useMemo } from 'react'
import { getStatusInfo, getMembers, getDepartmentById, calcTimeProgress } from '../data/mockData'
import TaskList from './TaskList'
import CreateTaskModal from './CreateTaskModal'

export default function ProjectDetail({ project, tasks, onUpdateProject, onDeleteProject, onAddTask, onUpdateTask, onDeleteTask, onBack }) {
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [taskFilter, setTaskFilter] = useState('all')
  const members = getMembers()

  if (!project) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>Project not found</h3>
        <button className="btn btn-primary" onClick={onBack}>Back to Projects</button>
      </div>
    )
  }

  const dept = getDepartmentById(project.departmentId)
  const statusInfo = getStatusInfo(project.status)
  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / 86400000)
  const isOverdue = daysLeft < 0 && project.status !== 'completed'
  const timeProgress = calcTimeProgress(project.startDate, project.dueDate)

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'all') return tasks
    return tasks.filter(t => t.status === taskFilter)
  }, [tasks, taskFilter])

  const taskStats = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter(t => t.status === 'done').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const todo = tasks.filter(t => t.status === 'todo').length
    return { total, done, inProgress, todo, progress: total ? Math.round((done / total) * 100) : 0 }
  }, [tasks])

  const subtaskStats = useMemo(() => {
    let total = 0
    let done = 0
    tasks.forEach(t => {
      if (t.subtasks) {
        total += t.subtasks.length
        done += t.subtasks.filter(s => s.status === 'done').length
      }
    })
    return { total, done, progress: total ? Math.round((done / total) * 100) : 0 }
  }, [tasks])

  const statuses = ['all', 'todo', 'in_progress', 'review', 'done', 'subtasks']

  return (
    <div className="project-detail">
      <div className="detail-top">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div className="detail-actions">
          <button className="btn btn-outline" onClick={() => onDeleteProject(project.id)}>Delete</button>
        </div>
      </div>

      <div className="detail-header">
        <div className="detail-title-section">
          {dept && (
            <div className="detail-category-badge" style={{ background: dept.color }}>
              {dept.icon} {dept.name}
            </div>
          )}
          <h2>{project.title}</h2>
          <p className="detail-desc">{project.description}</p>
        </div>
        <div className="detail-stats">
          <div className="detail-stat">
            <span className="detail-stat-value">{statusInfo.label}</span>
            <span className="detail-stat-label">Status</span>
          </div>
          <div className="detail-stat">
            <span className={`detail-stat-value ${isOverdue ? 'overdue' : ''}`}>
              {project.status === 'completed' ? '✓ Done' : isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
            </span>
            <span className="detail-stat-label">Due</span>
          </div>
          <div className="detail-stat">
            <span className="detail-stat-value">{project.progress}%</span>
            <span className="detail-stat-label">Progress</span>
          </div>
        </div>
      </div>

      <div className="detail-progress-section">
        <div className="detail-progress-header">
          <span>Task Completion</span>
          <span>{taskStats.done}/{taskStats.total} tasks</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${taskStats.progress}%` }} />
        </div>
      </div>

      <div className="detail-progress-section">
        <div className="detail-progress-header">
          <span>Subtask Completion</span>
          <span>{subtaskStats.done}/{subtaskStats.total} subtasks</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill completed" style={{ width: `${subtaskStats.progress}%` }} />
        </div>
      </div>

      <div className="detail-progress-section">
        <div className="detail-progress-header">
          <span>Time Progress</span>
          <span>{timeProgress}% elapsed</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${Math.min(timeProgress, 100)}%`, background: timeProgress > 80 ? '#ef4444' : timeProgress > 60 ? '#f59e0b' : '#6366f1' }} />
        </div>
      </div>

      <div className="detail-members">
        <span className="detail-section-label">Team ({project.members.length})</span>
        <div className="member-list">
          {project.members.map(mid => {
            const m = members.find(mm => mm.id === mid)
            return m ? (
              <div key={mid} className="member-tag">
                <span className="member-avatar" style={{ background: m.color }}>{m.avatar}</span>
                <span className="member-name">{m.name}</span>
              </div>
            ) : null
          })}
        </div>
      </div>

      <div className="detail-tasks-section">
        <div className="tasks-section-header">
          <h3>Tasks ({taskStats.total})</h3>
          <button className="btn btn-primary" onClick={() => setShowCreateTask(true)}>+ Add Task</button>
        </div>

        <div className="tasks-status-filters">
          {statuses.map(s => (
            <button
              key={s}
              className={`filter-btn ${taskFilter === s ? 'active' : ''}`}
              onClick={() => setTaskFilter(s)}
            >
              {s === 'all' ? 'All' : s === 'subtasks' ? 'Subtasks' : getStatusInfo(s).label}
              {s === 'subtasks' ? (
                <span className="filter-count">
                  {tasks.reduce((sum, t) => sum + (t.subtasks?.length || 0), 0)}
                </span>
              ) : s !== 'all' && (
                <span className="filter-count">{tasks.filter(t => t.status === s).length}</span>
              )}
            </button>
          ))}
        </div>

        {taskFilter === 'subtasks' ? (
          <div className="subtask-list-flat">
            {tasks.length === 0 ? (
              <p className="empty-text">No subtasks</p>
            ) : (
              tasks.flatMap(task =>
                (task.subtasks || []).map(s => {
                  const subAssignee = getMemberById(s.assignee)
                  const subOverdue = s.status !== 'done' && new Date(s.dueDate) < new Date()
                  const subInfo = getStatusInfo(s.status)
                  return (
                    <div key={s.id} className={`subtask-flat-item ${s.status === 'done' ? 'done' : ''}`}
                      onClick={() => {
                        const updated = task.subtasks.map(st => st.id === s.id ? { ...st, status: st.status === 'done' ? 'todo' : 'done' } : st)
                        onUpdateTask(task.id, { subtasks: updated })
                      }}>
                      <span className="subtask-flat-check">{s.status === 'done' ? '✓' : '○'}</span>
                      <div className="subtask-flat-info">
                        <span className="subtask-flat-title">{s.title}</span>
                        <span className="subtask-flat-parent">in {task.title}</span>
                      </div>
                      <div className="subtask-flat-right">
                        <span className={`status-badge ${s.status}`}>{subInfo.label}</span>
                        {subAssignee && (
                          <span className="member-avatar small" style={{ background: subAssignee.color }} title={subAssignee.name}>
                            {subAssignee.avatar}
                          </span>
                        )}
                        <span className={`subtask-flat-date ${subOverdue ? 'overdue' : ''}`}>
                          {new Date(s.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )
            )}
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            members={members}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        )}
      </div>

      {showCreateTask && (
        <CreateTaskModal
          projectId={project.id}
          members={project.members}
          onClose={() => setShowCreateTask(false)}
          onCreate={(task) => {
            onAddTask(task)
            setShowCreateTask(false)
          }}
        />
      )}
    </div>
  )
}
