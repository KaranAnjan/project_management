import { getStatusInfo, getPriorityInfo, getDepartmentById, calcTimeProgress } from '../data/mockData'

export default function ProjectCard({ project, members, onSelect, onDelete }) {
  const statusInfo = getStatusInfo(project.status)
  const priorityInfo = getPriorityInfo(project.priority)
  const dept = getDepartmentById(project.departmentId)

  const daysLeft = Math.ceil((new Date(project.dueDate) - new Date()) / 86400000)
  const isOverdue = daysLeft < 0 && project.status !== 'completed'
  const isCompleted = project.status === 'completed'

  const timeProgress = calcTimeProgress(project.startDate, project.dueDate)

  return (
    <div className="project-card" onClick={onSelect}>
      <div className="project-card-top">
        <div className="project-card-category" style={{ background: dept?.color || statusInfo.color }}>
          {dept ? `${dept.icon} ${dept.name}` : project.category}
        </div>
        <div className="project-card-menu" onClick={e => { e.stopPropagation(); onDelete() }}>
          ⋯
        </div>
      </div>
      <h3 className="project-card-title">{project.title}</h3>
      <p className="project-card-desc">{project.description}</p>

      <div className="project-card-meta">
        <span className={`status-badge ${project.status}`}>{statusInfo.label}</span>
        <span className={`priority-badge ${project.priority}`}>{priorityInfo.label}</span>
      </div>

      <div className="project-card-footer">
        <div className="project-card-progress">
          <div className="progress-bar-bg small">
            <div className={`progress-bar-fill ${isCompleted ? 'completed' : ''}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="progress-text">{project.progress}%</span>
        </div>
        <div className="project-card-members">
          {project.members.map(mid => {
            const m = members.find(mm => mm.id === mid)
            return m ? (
              <span key={mid} className="member-avatar small" style={{ background: m.color }} title={m.name}>
                {m.avatar}
              </span>
            ) : null
          })}
        </div>
      </div>

      <div className="project-card-time-bar">
        <div className="time-bar-label">
          <span>Time</span>
          <span>{timeProgress}%</span>
        </div>
        <div className="time-bar-bg">
          <div className={`time-bar-fill ${timeProgress >= 100 ? 'completed' : ''}`}
            style={{ width: `${Math.min(timeProgress, 100)}%` }}
          />
        </div>
      </div>

      <div className="project-card-date">
        {isCompleted ? (
          <span className="date-completed">✓ Completed</span>
        ) : isOverdue ? (
          <span className="date-overdue">⚠ {Math.abs(daysLeft)} days overdue</span>
        ) : (
          <span>Due in {daysLeft} days</span>
        )}
      </div>
    </div>
  )
}
