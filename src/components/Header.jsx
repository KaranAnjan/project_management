export default function Header({ searchQuery, onSearchChange, viewTitle, currentDepartment }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{viewTitle}</h1>
        {currentDepartment && (
          <span className="header-dept-badge" style={{ background: currentDepartment.color }}>
            {currentDepartment.icon} {currentDepartment.name}
          </span>
        )}
      </div>
      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search projects or tasks..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange('')}>×</button>
          )}
        </div>
      </div>
    </header>
  )
}
