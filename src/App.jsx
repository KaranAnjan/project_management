import { useState, useCallback, useMemo } from 'react'
import { initialProjects, initialTasks, getDepartmentById, getMembers } from './data/mockData'
import Sidebar from './components/Sidebar'
import DepartmentTabs from './components/DepartmentTabs'
import Dashboard from './components/Dashboard'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import TasksView from './components/TasksView'
import SubtasksView from './components/SubtasksView'
import ReportsView from './components/ReportsView'
import FlowView from './components/FlowView'

export default function App() {
  const [projects, setProjects] = useState(initialProjects)
  const [tasks, setTasks] = useState(initialTasks)
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDepartment, setActiveDepartment] = useState('all')
const members = getMembers()

  const filteredByDept = useMemo(() => {
    if (activeDepartment === 'all') return projects
    return projects.filter(p => p.departmentId === activeDepartment)
  }, [projects, activeDepartment])

  const filteredProjects = useMemo(() => {
    let result = filteredByDept
    if (searchQuery) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return result
  }, [filteredByDept, searchQuery])

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks
    return tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [tasks, searchQuery])

  const handleSelectProject = useCallback((projectId) => {
    setSelectedProject(projectId)
    setActiveView('project')
  }, [])

  const handleAddProject = useCallback((project) => {
    setProjects(prev => [project, ...prev])
  }, [])

  const handleUpdateProject = useCallback((projectId, updates) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p))
  }, [])

  const handleDeleteProject = useCallback((projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
    setTasks(prev => prev.filter(t => t.projectId !== projectId))
    if (selectedProject === projectId) {
      setActiveView('dashboard')
      setSelectedProject(null)
    }
  }, [selectedProject])

  const handleAddTask = useCallback((task) => {
    setTasks(prev => [task, ...prev])
  }, [])

  const handleUpdateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }, [])

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }, [])

  const handleNavigate = useCallback((view) => {
    setActiveView(view)
    if (view !== 'project') setSelectedProject(null)
  }, [])

  const handleDepartmentChange = useCallback((deptId) => {
    setActiveDepartment(deptId)
    if (activeView !== 'tasks' && activeView !== 'subtasks') {
      setActiveView('projects')
    }
    setSelectedProject(null)
  }, [activeView])

  const currentDepartment = activeDepartment !== 'all' ? getDepartmentById(activeDepartment) : null

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            projects={filteredByDept}
            tasks={tasks}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
            activeDepartment={activeDepartment}
          />
        )
      case 'projects':
        return (
          <ProjectList
            projects={filteredProjects}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onAddProject={handleAddProject}
          />
        )
      case 'tasks':
        return (
          <TasksView
            projects={filteredByDept}
            tasks={filteredTasks.filter(t => {
              if (activeDepartment === 'all') return true
              const p = projects.find(pr => pr.id === t.projectId)
              return p && p.departmentId === activeDepartment
            })}
            members={members}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
            onSelectProject={handleSelectProject}
          />
        )
      case 'subtasks':
        return (
          <SubtasksView
            projects={projects}
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onSelectProject={handleSelectProject}
          />
        )
      case 'reports':
        return (
          <ReportsView
            projects={filteredByDept}
            tasks={filteredTasks}
          />
        )
      case 'flow':
        return (
          <FlowView
            projects={filteredByDept}
            tasks={filteredTasks}
          />
        )
      case 'project':
        return (
          <ProjectDetail
            project={projects.find(p => p.id === selectedProject)}
            tasks={filteredTasks.filter(t => t.projectId === selectedProject)}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onBack={() => handleNavigate('projects')}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="main-area">
        <div className="top-bar">
          <div className="top-bar-left">
            <h1 className="top-bar-title">{
              activeView === 'dashboard' ? 'Dashboard' :
              activeView === 'projects' ? 'Projects' :
              activeView === 'tasks' ? 'All Tasks' :
              activeView === 'subtasks' ? 'Subtasks' :
              activeView === 'reports' ? 'Reports' :
              activeView === 'flow' ? 'Flow' :
              projects.find(p => p.id === selectedProject)?.title || 'Project'
            }</h1>
            {currentDepartment && (
              <span className="top-bar-dept" style={{ background: currentDepartment.color }}>
                {currentDepartment.icon} {currentDepartment.name}
              </span>
            )}
          </div>
          <DepartmentTabs
            activeDepartment={activeDepartment}
            onSelect={handleDepartmentChange}
          />
          <div className="top-bar-right">
            <div className="search-box">
              <span className="search-icon">⌕</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
          </div>
        </div>
        <main className="content">
          {renderView()}
        </main>
      </div>
    </div>
  )
}
