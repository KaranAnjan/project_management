export default function Sidebar({ activeView, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'All Tasks', icon: '✓' },
    { id: 'subtasks', label: 'Subtasks', icon: '⊞' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'flow', label: 'Flow', icon: '🔀' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={() => onNavigate('dashboard')}>
        <span className="brand-icon">◈</span>
        <span className="brand-text">ProjectFlow</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar" style={{ background: '#6366f1' }}>KA</div>
          <div className="user-info">
            <div className="user-name">Karan Arora</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
