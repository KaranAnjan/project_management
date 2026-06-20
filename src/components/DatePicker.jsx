import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function DatePicker({ value, onChange, placeholder = 'Select date', min }) {
  const [open, setOpen] = useState(false)
  const [up, setUp] = useState(false)
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date())
  const ref = useRef()
  const triggerRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      setUp(spaceAbove > spaceBelow)
    }
  }, [open])

  const selected = value ? new Date(value) : null
  const today = new Date()
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const grid = []
    for (let i = 0; i < startPad; i++) grid.push(null)
    for (let d = 1; d <= totalDays; d++) grid.push(d)
    return grid
  }, [year, month])

  const formatDate = useCallback((d) => {
    if (!d) return ''
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }, [])

  const isSameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const isToday = (d) => isSameDay(new Date(year, month, d), today) && d !== null
  const isSelected = (d) => selected && isSameDay(new Date(year, month, d), selected)
  const isDisabled = (d) => min && new Date(year, month, d) < new Date(min)

  const select = (d) => {
    if (isDisabled(d)) return
    const date = new Date(year, month, d)
    onChange(date.toISOString().split('T')[0])
    setOpen(false)
  }

  const nav = (delta) => setViewDate(new Date(year, month + delta, 1))

  return (
    <div className="dp-wrap" ref={ref}>
      <button type="button" className="dp-trigger" ref={triggerRef} onClick={() => setOpen(!open)}>
        <span className="dp-trigger-icon">📅</span>
        <span className={`dp-trigger-text ${!value ? 'placeholder' : ''}`}>
          {value ? formatDate(selected) : placeholder}
        </span>
        {value && <span className="dp-clear" onClick={(e) => { e.stopPropagation(); onChange(''); setOpen(false) }}>×</span>}
      </button>

      {open && (
        <div className={`dp-popup${up ? ' up' : ''}`}>
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={() => nav(-1)}>‹</button>
            <span className="dp-title">{months[month]} {year}</span>
            <button type="button" className="dp-nav" onClick={() => nav(1)}>›</button>
          </div>
          <div className="dp-weekdays">
            {days.map(d => <span key={d} className="dp-weekday">{d}</span>)}
          </div>
          <div className="dp-grid">
            {daysInMonth.map((d, i) => (
              <button
                key={i}
                type="button"
                className={`dp-day ${!d ? 'empty' : ''} ${isToday(d) ? 'today' : ''} ${isSelected(d) ? 'selected' : ''} ${isDisabled(d) ? 'disabled' : ''}`}
                onClick={() => d && select(d)}
                disabled={!d || isDisabled(d)}
              >
                {d || ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
