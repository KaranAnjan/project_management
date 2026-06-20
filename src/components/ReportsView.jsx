import { useState, useMemo } from 'react'
import { getStatusInfo, getPriorityInfo, getMemberById, getDepartmentById } from '../data/mockData'

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function fmt(d) {
  const date = new Date(d)
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

const statuses = ['all', 'todo', 'in_progress', 'review', 'done']

export default function ReportsView({ projects, tasks }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('project')
  const [sortDir, setSortDir] = useState('asc')
  const [filterProject, setFilterProject] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterStatus2, setFilterStatus2] = useState('all')

  const rows = useMemo(() => {
    const all = []
    for (const p of projects) {
      const dept = getDepartmentById(p.departmentId)
      const projectTasks = tasks.filter(t => t.projectId === p.id)
      for (const t of projectTasks) {
        const done = t.subtasks.filter(s => s.status === 'done').length
        const total = t.subtasks.length
        all.push({
          project: p.title,
          projectDept: p.departmentId,
          projectId: p.id,
          task: t.title,
          taskId: t.id,
          assignee: t.assignee,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
          deptName: dept?.name || '-',
          deptIcon: dept?.icon || '',
          deptColor: dept?.color || '#6b7280',
          subtaskDone: done,
          subtaskTotal: total,
          subtaskPct: total ? Math.round(done / total * 100) : 0,
        })
      }
    }
    return all
  }, [projects, tasks])

  const filtered = useMemo(() => {
    let result = [...rows]
    if (filterProject !== 'all') result = result.filter(r => r.projectId === filterProject)
    if (filterStatus !== 'all') result = result.filter(r => r.status === filterStatus)
    if (filterStatus2 !== 'all') result = result.filter(r => {
      if (filterStatus2 === 'overdue') return new Date(r.dueDate) < new Date() && r.status !== 'done'
      if (filterStatus2 === 'no_subtasks') return r.subtaskTotal === 0
      return true
    })
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(r => r.task.toLowerCase().includes(q) || r.project.toLowerCase().includes(q))
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'project') cmp = a.project.localeCompare(b.project) || a.task.localeCompare(b.task)
      else if (sortKey === 'task') cmp = a.task.localeCompare(b.task)
      else if (sortKey === 'assignee') cmp = (getMemberById(a.assignee)?.name || '').localeCompare(getMemberById(b.assignee)?.name || '')
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status)
      else if (sortKey === 'priority') {
        const order = { critical: 0, high: 1, medium: 2, low: 3 }
        cmp = (order[a.priority] ?? 99) - (order[b.priority] ?? 99)
      }
      else if (sortKey === 'dueDate') cmp = new Date(a.dueDate) - new Date(b.dueDate)
      else if (sortKey === 'dept') cmp = a.deptName.localeCompare(b.deptName)
      else if (sortKey === 'subtask') cmp = a.subtaskPct - b.subtaskPct
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [rows, search, sortKey, sortDir, filterProject, filterStatus, filterStatus2])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sortIcon = (key) => sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  const overdueCount = rows.filter(r => new Date(r.dueDate) < new Date() && r.status !== 'done').length
  const doneCount = rows.filter(r => r.status === 'done').length
  const inProgressCount = rows.filter(r => r.status === 'in_progress' || r.status === 'review').length

  const exportCSV = () => {
    const header = 'Project,Task,Assignee,Status,Priority,Due Date,Department,Subtasks\n'
    const body = filtered.map(r => {
      const assignee = getMemberById(r.assignee)?.name || 'Unassigned'
      return `"${r.project}","${r.task}","${assignee}",${r.status},${r.priority},${fmt(r.dueDate)},${r.deptName},"${r.subtaskDone}/${r.subtaskTotal}"`
    }).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'project_report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="reports-view">
      <div className="reports-toolbar">
        <h2 className="reports-title">Task Report</h2>
        <div className="reports-summary">
          <span className="reports-summary-item"><strong>{rows.length}</strong> total</span>
          <span className="reports-summary-item" style={{ color: '#10b981' }}><strong>{doneCount}</strong> done</span>
          <span className="reports-summary-item" style={{ color: '#3b82f6' }}><strong>{inProgressCount}</strong> in progress</span>
          <span className="reports-summary-item" style={{ color: '#ef4444' }}><strong>{overdueCount}</strong> overdue</span>
        </div>
        <button className="btn btn-ghost" onClick={exportCSV}>↓ Export CSV</button>
      </div>

      <div className="reports-filters">
        <div className="reports-filter-group">
          <span className="reports-filter-label">Search</span>
          <div className="search-box" style={{ width: 180 }}>
            <input type="text" placeholder="Search tasks or projects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="reports-filter-group">
          <span className="reports-filter-label">Project</span>
          <select className="form-select" value={filterProject} onChange={e => setFilterProject(e.target.value)}>
            <option value="all">All</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div className="reports-filter-group">
          <span className="reports-filter-label">Status</span>
          <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All' : getStatusInfo(s).label}</option>)}
          </select>
        </div>
        <div className="reports-filter-group">
          <span className="reports-filter-label">Filter</span>
          <select className="form-select" value={filterStatus2} onChange={e => setFilterStatus2(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="overdue">Overdue Only</option>
            <option value="no_subtasks">No Subtasks</option>
          </select>
        </div>
      </div>

      <div className="reports-table-wrap">
        <table className="reports-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('project')} className="reports-th-sort">Project{sortIcon('project')}</th>
              <th onClick={() => toggleSort('task')} className="reports-th-sort">Task{sortIcon('task')}</th>
              <th onClick={() => toggleSort('assignee')} className="reports-th-sort">Assignee{sortIcon('assignee')}</th>
              <th onClick={() => toggleSort('status')} className="reports-th-sort">Status{sortIcon('status')}</th>
              <th onClick={() => toggleSort('priority')} className="reports-th-sort">Priority{sortIcon('priority')}</th>
              <th onClick={() => toggleSort('dueDate')} className="reports-th-sort">Due Date{sortIcon('dueDate')}</th>
              <th onClick={() => toggleSort('dept')} className="reports-th-sort">Department{sortIcon('dept')}</th>
              <th onClick={() => toggleSort('subtask')} className="reports-th-sort">Subtasks{sortIcon('subtask')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="reports-empty">No tasks match the current filters.</td></tr>
            )}
            {filtered.map(r => {
              const statusInfo = getStatusInfo(r.status)
              const priorityInfo = getPriorityInfo(r.priority)
              const member = getMemberById(r.assignee)
              const overdue = r.status !== 'done' && new Date(r.dueDate) < new Date()
              return (
                <tr key={r.taskId}>
                  <td className="reports-cell-project">{r.project}</td>
                  <td className="reports-cell-task">{r.task}</td>
                  <td>
                    {member ? (
                      <div className="reports-assignee">
                        <span className="reports-avatar" style={{ background: member.color }}>{member.avatar}</span>
                        <span>{member.name}</span>
                      </div>
                    ) : <span className="text-light">Unassigned</span>}
                  </td>
                  <td><span className="reports-badge reports-badge-status" style={{ background: statusInfo.color }}>{statusInfo.label}</span></td>
                  <td><span className="reports-badge reports-badge-priority" style={{ background: priorityInfo.color }}>{priorityInfo.label}</span></td>
                  <td className={`reports-cell-date ${overdue ? 'overdue' : ''}`}>
                    {fmt(r.dueDate)}
                    {overdue && <span className="reports-overdue-tag">overdue</span>}
                  </td>
                  <td>
                    <span className="reports-dept-tag">
                      <span>{r.deptIcon}</span>
                      <span>{r.deptName}</span>
                    </span>
                  </td>
                  <td>
                    <div className="reports-subtask-cell">
                      <span className="reports-subtask-count">{r.subtaskDone}/{r.subtaskTotal}</span>
                      <div className="reports-subtask-bar">
                        <div className="reports-subtask-fill" style={{ width: `${r.subtaskPct}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
