import { useState, useMemo } from 'react'
import { getStatusInfo, getMembers } from '../data/mockData'
import ProjectCard from './ProjectCard'
import CreateProjectModal from './CreateProjectModal'

export default function ProjectList({ projects, onSelectProject, onDeleteProject, onAddProject }) {
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const members = getMembers()

  const filteredSorted = useMemo(() => {
    let result = [...projects]
    if (filter !== 'all') result = result.filter(p => p.status === filter)
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
        case 'due_soon': return new Date(a.dueDate) - new Date(b.dueDate)
        case 'due_later': return new Date(b.dueDate) - new Date(a.dueDate)
        case 'alpha': return a.title.localeCompare(b.title)
        default: return 0
      }
    })
    return result
  }, [projects, filter, sortBy])

  const statusCounts = useMemo(() => {
    const counts = { all: projects.length }
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1
    })
    return counts
  }, [projects])

  return (
    <div className="project-list-view">
      <div className="list-header">
        <div className="list-filters">
          {[
            { key: 'all', label: `All (${statusCounts.all})` },
            { key: 'active', label: `Active (${statusCounts.active || 0})` },
            { key: 'planning', label: `Planning (${statusCounts.planning || 0})` },
            { key: 'on_hold', label: `On Hold (${statusCounts.on_hold || 0})` },
            { key: 'completed', label: `Completed (${statusCounts.completed || 0})` },
          ].map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="list-actions">
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="due_soon">Due Soon</option>
            <option value="due_later">Due Later</option>
            <option value="alpha">Alphabetical</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
        </div>
      </div>

      {filteredSorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No projects found</h3>
          <p>Create your first project to get started</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create Project</button>
        </div>
      ) : (
        <div className="project-grid">
          {filteredSorted.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              members={members}
              onSelect={() => onSelectProject(p.id)}
              onDelete={() => onDeleteProject(p.id)}
            />
          ))}
        </div>
      )}

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
