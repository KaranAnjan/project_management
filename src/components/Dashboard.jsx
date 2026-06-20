import { useState, useMemo } from 'react'
import { getStatusInfo, getMembers, getDepartmentById, departments } from '../data/mockData'
import CreateProjectModal from './CreateProjectModal'

export default function Dashboard({ projects, tasks, onSelectProject, onAddProject, activeDepartment }) {
  const [showCreate, setShowCreate] = useState(false)
  const members = getMembers()

  const deptProjects = useMemo(() => {
    if (activeDepartment === 'all') return projects
    return projects.filter(p => p.departmentId === activeDepartment)
  }, [projects, activeDepartment])

  const projectIds = useMemo(() => new Set(deptProjects.map(p => p.id)), [deptProjects])
  const filteredTasks = useMemo(() => tasks.filter(t => projectIds.has(t.projectId)), [tasks, projectIds])

  const stats = useMemo(() => {
    const activeProjects = deptProjects.filter(p => p.status === 'active' || p.status === 'planning').length
    const completedProjects = deptProjects.filter(p => p.status === 'completed').length
    const totalTasks = filteredTasks.length
    const doneTasks = filteredTasks.filter(t => t.status === 'done').length
    const overdue = filteredTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length
    return { activeProjects, completedProjects, totalTasks, doneTasks, overdue }
  }, [deptProjects, filteredTasks])

  const recentProjects = useMemo(() =>
    [...deptProjects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [deptProjects]
  )

  const upcomingTasks = useMemo(() =>
    [...filteredTasks]
      .filter(t => t.status !== 'done')
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6),
    [filteredTasks]
  )

  const progressByProject = useMemo(() => {
    return deptProjects.filter(p => p.status !== 'completed').map(p => {
      const projectTasks = filteredTasks.filter(t => t.projectId === p.id)
      const done = projectTasks.filter(t => t.status === 'done').length
      return {
        ...p,
        taskProgress: projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0,
        totalTasks: projectTasks.length,
        doneTasks: done,
      }
    })
  }, [deptProjects, filteredTasks])

  const priorityCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 }
    filteredTasks.filter(t => t.status !== 'done').forEach(t => {
      if (counts[t.priority] !== undefined) counts[t.priority]++
    })
    return counts
  }, [filteredTasks])

  const deptCounts = useMemo(() => {
    const counts = {}
    departments.forEach(d => { counts[d.id] = 0 })
    projects.forEach(p => {
      counts[p.departmentId] = (counts[p.departmentId] || 0) + 1
    })
    return counts
  }, [projects])

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Overview</h2>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>◉</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeProjects}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#10b981' }}>✓</div>
          <div className="stat-info">
            <div className="stat-value">{stats.completedProjects}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>◷</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#ef4444' }}>⚠</div>
          <div className="stat-info">
            <div className="stat-value">{stats.overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      <div className="dept-mini-stats">
        {departments.map(d => (
          <div key={d.id} className="dept-mini-stat" style={{ '--dept-color': d.color }}>
            <span className="dept-mini-icon">{d.icon}</span>
            <span className="dept-mini-name">{d.name}</span>
            <span className="dept-mini-count">{deptCounts[d.id] || 0}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Active Projects Progress</h3>
          </div>
          <div className="card-body">
            {progressByProject.length === 0 ? (
              <p className="empty-text">No active projects</p>
            ) : (
              progressByProject.map(p => (
                <div key={p.id} className="progress-item" onClick={() => onSelectProject(p.id)}>
                  <div className="progress-item-header">
                    <span className="progress-item-title">{p.title}</span>
                    <span className="progress-item-value">{p.taskProgress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${p.taskProgress}%` }} />
                  </div>
                  <div className="progress-item-meta">
                    <span>{p.doneTasks}/{p.totalTasks} tasks</span>
                    <span className={`status-badge ${p.status}`}>
                      {getStatusInfo(p.status).label}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Upcoming Deadlines</h3>
          </div>
          <div className="card-body">
            {upcomingTasks.length === 0 ? (
              <p className="empty-text">No upcoming tasks</p>
            ) : (
              <div className="task-preview-list">
                {upcomingTasks.map(t => {
                  const p = deptProjects.find(pr => pr.id === t.projectId)
                  const isOverdue = new Date(t.dueDate) < new Date()
                  const daysLeft = Math.ceil((new Date(t.dueDate) - new Date()) / 86400000)
                  return (
                    <div key={t.id} className="task-preview-item" onClick={() => onSelectProject(t.projectId)}>
                      <div className="task-preview-title">{t.title}</div>
                      <div className="task-preview-meta">
                        <span className="task-preview-project">{p?.title}</span>
                        <span className={`task-preview-date ${isOverdue ? 'overdue' : ''}`}>
                          {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Task Priority Breakdown</h3>
          </div>
          <div className="card-body">
            <div className="priority-breakdown">
              {[
                { key: 'critical', label: 'Critical', color: '#ef4444' },
                { key: 'high', label: 'High', color: '#f97316' },
                { key: 'medium', label: 'Medium', color: '#f59e0b' },
                { key: 'low', label: 'Low', color: '#10b981' },
              ].map(({ key, label, color }) => {
                const count = priorityCounts[key] || 0
                const maxCount = Math.max(...Object.values(priorityCounts), 1)
                return (
                  <div key={key} className="priority-row">
                    <div className="priority-label">
                      <span className="priority-dot" style={{ background: color }} />
                      <span>{label}</span>
                    </div>
                    <div className="priority-bar-bg">
                      <div className="priority-bar-fill" style={{ width: `${(count / maxCount) * 100}%`, background: color }} />
                    </div>
                    <span className="priority-count">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recent Projects</h3>
          </div>
          <div className="card-body">
            {recentProjects.length === 0 ? (
              <p className="empty-text">No projects yet</p>
            ) : (
              <div className="project-mini-list">
                {recentProjects.map(p => {
                  const dept = getDepartmentById(p.departmentId)
                  return (
                    <div key={p.id} className="project-mini-item" onClick={() => onSelectProject(p.id)}>
                      <div className="project-mini-icon" style={{ background: getStatusInfo(p.status).color }}>
                        {p.title.charAt(0)}
                      </div>
                      <div className="project-mini-info">
                        <div className="project-mini-title">{p.title}</div>
                        <div className="project-mini-meta">
                          <span className={`status-badge ${p.status}`}>
                            {getStatusInfo(p.status).label}
                          </span>
                          {dept && (
                            <span className="dept-tag" style={{ background: dept.color }}>
                              {dept.icon} {dept.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreate={(project) => {
            onAddProject(project)
            setShowCreate(false)
          }}
        />
      )}
    </div>
  )
}
