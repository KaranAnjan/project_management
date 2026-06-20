import { useState, useMemo } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById, getDepartmentById, calcTimeProgress } from '../data/mockData'
import TaskModal from './TaskModal'
import CreateTaskModal from './CreateTaskModal'

export default function TasksView({ projects, tasks, members, onUpdateTask, onDeleteTask, onAddTask, onSelectProject }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedSubtask, setSelectedSubtask] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedTasks, setExpandedTasks] = useState({})

  const taskList = useMemo(() => {
    let result = [...tasks]
    if (filterStatus !== 'all') result = result.filter(t => t.status === filterStatus)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return result
  }, [tasks, filterStatus])

  const statusCounts = useMemo(() => {
    const counts = { all: tasks.length }
    tasks.forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1 })
    return counts
  }, [tasks])

  const allSubtasks = useMemo(() => {
    const subs = []
    taskList.forEach(task => {
      if (task.subtasks) {
        task.subtasks.forEach(s => {
          const project = projects.find(p => p.id === task.projectId)
          subs.push({ ...s, parentTask: task, project })
        })
      }
    })
    if (filterStatus !== 'all') return subs.filter(s => s.status === filterStatus)
    return subs
  }, [taskList, filterStatus])

  if (tasks.length === 0 && allSubtasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No tasks yet</h3>
        <p>Create a task to get started</p>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create Task</button>
        {showCreate && (
          <CreateTaskModal
            projectId={projects[0]?.id}
            members={projects[0]?.members || []}
            onClose={() => setShowCreate(false)}
            onCreate={(task) => { onAddTask(task); setShowCreate(false) }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="tasks-view">
      <div className="tasks-view-header">
        <h2>All Tasks ({tasks.length})</h2>
        <div className="list-actions">
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Task</button>
        </div>
      </div>

      <div className="tasks-status-filters">
        <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
          All ({statusCounts.all + allSubtasks.length})
        </button>
        {['todo', 'in_progress', 'review', 'done'].map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
            {getStatusInfo(s).label} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      <div className="task-list-full">
        {taskList.map(task => {
          const project = projects.find(p => p.id === task.projectId)
          const dept = project ? getDepartmentById(project.departmentId) : null
          const assignee = getMemberById(task.assignee)
          const statusInfo = getStatusInfo(task.status)
          const priorityInfo = getPriorityInfo(task.priority)
          const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date()
          const subCount = task.subtasks?.length || 0
          const subDone = task.subtasks?.filter(s => s.status === 'done').length || 0
          const timeProgress = calcTimeProgress(task.createdAt, task.dueDate)

          return (
            <div key={task.id}>
              <div className="task-row">
                <div className="task-row-expand" onClick={() => setExpandedTasks(p => ({ ...p, [task.id]: !p[task.id] }))}>
                  {expandedTasks[task.id] ? '▾' : '▸'}
                </div>
                <div className="task-row-main" onClick={() => setSelectedTask(task)}>
                  <div className="task-row-left">
                    <span className="task-row-status" style={{ background: statusInfo.color }} />
                    <div className="task-row-info">
                      <div className="task-row-title-row">
                        <div className="task-row-title">{task.title}</div>
                        {assignee && (
                          <span className="member-avatar small" style={{ background: assignee.color }} title={assignee.name}>
                            {assignee.avatar}
                          </span>
                        )}
                      </div>
                      <div className="task-row-meta">
                        {project && (
                          <span className="task-row-project" onClick={e => { e.stopPropagation(); onSelectProject(project.id) }}>
                            {project.title}
                          </span>
                        )}
                        {dept && <span className="dept-tag" style={{ background: dept.color }}>{dept.icon} {dept.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="task-row-center">
                    <span className={`status-badge ${task.status}`}>{statusInfo.label}</span>
                    <span className={`priority-badge ${task.priority}`}>{priorityInfo.label}</span>
                    {subCount > 0 && <span className="subtask-indicator">✓ {subDone}/{subCount}</span>}
                    <span className="task-time-indicator" style={{ color: timeProgress > 80 ? '#ef4444' : timeProgress > 50 ? '#f59e0b' : '#10b981' }}>
                      {timeProgress}%
                    </span>
                  </div>
                  <div className="task-row-right">
                    <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                      {isOverdue
                        ? `${Math.abs(Math.ceil((new Date(task.dueDate) - new Date()) / 86400000))}d`
                        : new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      }
                    </span>
                  </div>
                </div>
              </div>

              {expandedTasks[task.id] && task.subtasks && task.subtasks.length > 0 && (
                <div className="subtask-rows">
                  {task.subtasks.map(s => {
                    const subAssignee = getMemberById(s.assignee)
                    const subOverdue = s.status !== 'done' && new Date(s.dueDate) < new Date()
                    const subInfo = getStatusInfo(s.status)
                    return (
                      <div key={s.id} className={`subtask-row ${s.status === 'done' ? 'done' : ''}`}
                        onClick={() => {
                          const updated = task.subtasks.map(st => st.id === s.id ? { ...st, status: st.status === 'done' ? 'todo' : 'done' } : st)
                          onUpdateTask(task.id, { subtasks: updated })
                        }}>
                        <div className="subtask-row-left">
                          <span className="subtask-row-check">{s.status === 'done' ? '✓' : '○'}</span>
                          <span className="subtask-row-title">{s.title}</span>
                          {subAssignee && (
                            <span className="member-avatar small" style={{ background: subAssignee.color }} title={subAssignee.name}>
                              {subAssignee.avatar}
                            </span>
                          )}
                          <span className={`status-badge ${s.status}`}>{subInfo.label}</span>
                        </div>
                        <div className="subtask-row-right">
                          <span className={`subtask-row-date ${subOverdue ? 'overdue' : ''}`}>
                            {new Date(s.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          members={members}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updates) => {
            onUpdateTask(selectedTask.id, updates)
            setSelectedTask(prev => ({ ...prev, ...updates }))
          }}
          onDelete={() => { onDeleteTask(selectedTask.id); setSelectedTask(null) }}
        />
      )}

      {showCreate && (
        <CreateTaskModal
          projectId={projects[0]?.id || 'p1'}
          members={projects[0]?.members || ['m1', 'm2', 'm3']}
          onClose={() => setShowCreate(false)}
          onCreate={(task) => { onAddTask(task); setShowCreate(false) }}
        />
      )}
    </div>
  )
}
