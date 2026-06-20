import { useState, useMemo } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById, getDepartmentById } from '../data/mockData'

export default function FlowView({ projects, tasks }) {
  const [expandedProjects, setExpandedProjects] = useState(() => projects.reduce((a, p) => ({ ...a, [p.id]: true }), {}))
  const [expandedTasks, setExpandedTasks] = useState({})
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [expandAllSubtasks, setExpandAllSubtasks] = useState(false)

  const tree = useMemo(() => {
    return projects.map(p => {
      const dept = getDepartmentById(p.departmentId)
      const projectTasks = tasks.filter(t => t.projectId === p.id).map(t => ({
        ...t,
        subtaskList: t.subtasks || [],
      }))
      return { ...p, dept, projectTasks }
    })
  }, [projects, tasks])

  const toggleProject = (id) => setExpandedProjects(p => ({ ...p, [id]: !p[id] }))
  const toggleTask = (id) => setExpandedTasks(p => ({ ...p, [id]: !p[id] }))

  const collapseAll = () => {
    setExpandedProjects(projects.reduce((a, p) => ({ ...a, [p.id]: false }), {}))
    setExpandedTasks({})
    setShowAllTasks(false)
    setExpandAllSubtasks(false)
  }

  const handleShowAllTasks = (e) => {
    const checked = e.target.checked
    setShowAllTasks(checked)
    if (checked) {
      setExpandedProjects(projects.reduce((a, p) => ({ ...a, [p.id]: true }), {}))
    }
  }

  const handleExpandAllSubtasks = (e) => {
    const checked = e.target.checked
    setExpandAllSubtasks(checked)
    if (checked) {
      const allExpanded = {}
      tasks.forEach(t => { allExpanded[t.id] = true })
      setExpandedProjects(projects.reduce((a, p) => ({ ...a, [p.id]: true }), {}))
      setExpandedTasks(allExpanded)
      setShowAllTasks(true)
    }
  }

  return (
    <div className="flow-view">
      <div className="flow-header">
        <div className="flow-header-left">
          <h2 className="flow-title">Project Flow</h2>
          <p className="flow-subtitle">Project → Task → Subtask hierarchy</p>
        </div>
        <div className="flow-header-controls">
          <label className="flow-expand-label">
            <input type="checkbox" checked={showAllTasks} onChange={handleShowAllTasks} />
            <span>Show all tasks</span>
          </label>
          <label className="flow-expand-label">
            <input type="checkbox" checked={expandAllSubtasks} onChange={handleExpandAllSubtasks} />
            <span>Expand all with subtasks</span>
          </label>
          <button className="flow-collapse-btn" onClick={collapseAll}>Collapse all</button>
        </div>
      </div>
      <div className="flow-tree">
        {tree.map((project) => {
          const statusInfo = getStatusInfo(project.status)
          const overdue = project.status !== 'completed' && new Date(project.dueDate) < new Date()
          const expanded = expandedProjects[project.id]
          return (
            <div key={project.id} className="flow-branch">
              <div className="flow-project-node" onClick={() => toggleProject(project.id)}>
                <span className="flow-toggle">{expanded ? '▾' : '▸'}</span>
                <div className="flow-project-icon" style={{ background: project.dept?.color || '#6366f1' }}>
                  {project.dept?.icon || '📋'}
                </div>
                <div className="flow-project-body">
                  <div className="flow-project-title">{project.title}</div>
                  <div className="flow-project-meta">
                    <span className={`status-badge ${project.status}`}>{statusInfo.label}</span>
                    <span className="flow-dept-tag">{project.dept?.name || 'General'}</span>
                    {overdue && <span className="flow-overdue">OVERDUE</span>}
                  </div>
                </div>
                <div className="flow-task-strip">
                  <div className="flow-task-strip-line" />
                  {project.projectTasks.slice(0, 8).map(t => {
                    const tOverdue = t.status !== 'done' && new Date(t.dueDate) < new Date()
                    return (
                      <div key={t.id} className={`flow-task-dot ${t.status}${tOverdue ? ' overdue' : ''}`} data-label={tOverdue ? 'Overdue' : getStatusInfo(t.status).label}>
                        {t.status === 'done' ? '✓' : t.status === 'in_progress' ? '◉' : t.status === 'review' ? '◎' : ''}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={`flow-children-wrap ${expanded ? 'expanded' : ''}`}>
                <div className="flow-children">
                  {project.projectTasks.length === 0 && (
                    <div className="flow-empty-node">
                      <span className="flow-empty-text">No tasks</span>
                    </div>
                  )}
                  {project.projectTasks.map((task) => {
                    const tStatus = getStatusInfo(task.status)
                    const tPriority = getPriorityInfo(task.priority)
                    const member = getMemberById(task.assignee)
                    const tOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date()
                    const totalSubs = task.subtaskList.length
                    const tExpanded = expandedTasks[task.id]
                    return (
                      <div key={task.id} className="flow-branch">
                        <div className="flow-task-node" onClick={() => toggleTask(task.id)}>
                          <span className="flow-toggle">{tExpanded ? '▾' : '▸'}</span>
                          <div className="flow-node-dot" style={{ background: tStatus.color }} />
                          <div className="flow-task-body">
                            <div className="flow-task-title">{task.title}</div>
                            <div className="flow-task-meta">
                              <span className="flow-badge" style={{ background: tStatus.color }}>{tStatus.label}</span>
                              <span className="flow-badge priority" style={{ background: tPriority.color }}>{tPriority.label}</span>
                              {member && <span className="flow-member">{member.avatar}</span>}
                              <span className="flow-date">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              {tOverdue && <span className="flow-overdue-tag">overdue</span>}
                            </div>
                          </div>
                          {totalSubs > 0 && (
                            <div className="flow-task-strip">
                              <div className="flow-task-strip-line" />
                              {task.subtaskList.slice(0, 8).map(sub => {
                                const sOverdue = sub.status !== 'done' && new Date(sub.dueDate) < new Date()
                                return (
                                  <div key={sub.id} className={`flow-task-dot ${sub.status}${sOverdue ? ' overdue' : ''}`} data-label={sOverdue ? 'Overdue' : getStatusInfo(sub.status).label}>
                                    {sub.status === 'done' ? '✓' : sub.status === 'in_progress' ? '◉' : sub.status === 'review' ? '◎' : ''}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>

                        <div className={`flow-children-wrap ${tExpanded ? 'expanded' : ''}`}>
                          <div className="flow-children">
                            {totalSubs === 0 && (
                              <div className="flow-empty-node">
                                <span className="flow-empty-text">No subtasks</span>
                              </div>
                            )}
                            {task.subtaskList.map(sub => {
                              const sStatus = getStatusInfo(sub.status)
                              const sPriority = getPriorityInfo(sub.priority)
                              const sMember = getMemberById(sub.assignee)
                              const sOverdue = sub.status !== 'done' && new Date(sub.dueDate) < new Date()
                              return (
                                <div key={sub.id} className="flow-subtask-node">
                                  <div className="flow-node-dot small" style={{ background: sStatus.color }} />
                                  <div className="flow-task-body">
                                    <div className="flow-task-title subtask">{sub.title}</div>
                                    <div className="flow-task-meta">
                                      <span className="flow-badge" style={{ background: sStatus.color }}>{sStatus.label}</span>
                                      <span className="flow-badge priority" style={{ background: sPriority.color }}>{sPriority.label}</span>
                                      {sMember && <span className="flow-member">{sMember.avatar}</span>}
                                      <span className="flow-date">{new Date(sub.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                      {sOverdue && <span className="flow-overdue-tag">overdue</span>}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
