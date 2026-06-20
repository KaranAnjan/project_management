import { useState } from 'react'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

export default function TaskList({ tasks, members, onUpdateTask, onDeleteTask }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState({})

  const toggleExpanded = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state small">
        <p>No tasks match the current filter</p>
      </div>
    )
  }

  return (
    <>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            members={members}
            onClick={() => setSelectedTask(task)}
            onUpdate={(updates) => onUpdateTask(task.id, updates)}
            onToggleExpand={() => toggleExpanded(task.id)}
            expanded={!!expandedTasks[task.id]}
          />
        ))}
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
          onDelete={() => {
            onDeleteTask(selectedTask.id)
            setSelectedTask(null)
          }}
        />
      )}
    </>
  )
}
