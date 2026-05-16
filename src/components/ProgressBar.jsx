export default function ProgressBar({ percent, color = 'var(--accent)' }) {
  return (
    <div
      className="w-full rounded-full h-2 overflow-hidden"
      style={{ backgroundColor: 'var(--surface2)' }}
    >
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  )
}
