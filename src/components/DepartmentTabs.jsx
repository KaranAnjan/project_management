import { getDepartments } from '../data/mockData'

const depts = getDepartments()

export default function DepartmentTabs({ activeDepartment, onSelect }) {
  return (
    <div className="dept-tabs">
      <button
        className={`dept-tab ${activeDepartment === 'all' ? 'active' : ''}`}
        onClick={() => onSelect('all')}
      >
        All Departments
      </button>
      {depts.map(d => (
        <button
          key={d.id}
          className={`dept-tab ${activeDepartment === d.id ? 'active' : ''}`}
          onClick={() => onSelect(d.id)}
          style={{
            '--dept-color': d.color,
          }}
        >
          <span className="dept-tab-icon">{d.icon}</span>
          <span className="dept-tab-label">{d.name}</span>
        </button>
      ))}
    </div>
  )
}
