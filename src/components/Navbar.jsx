import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearMember, getMember } from '../lib/member'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const member = getMember()

  function handleLogout() {
    clearMember()
    navigate('/')
  }

  const links = [
    { to: '/dashboard', label: 'My Card' },
    { to: '/rewards', label: 'Rewards' },
    { to: '/venues', label: 'Venues' },
  ]

  return (
    <nav style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div style={{ backgroundColor: 'var(--accent)' }} className="w-7 h-7 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">PR</span>
          </div>
          <span style={{ color: 'var(--text)' }} className="font-semibold text-sm hidden sm:block">
            Pernod Network
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="px-3 py-1.5 rounded-md text-sm transition-colors"
              style={{
                color: location.pathname === to ? 'var(--accent)' : 'var(--muted)',
                backgroundColor: location.pathname === to ? 'rgba(83,74,183,0.12)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {member && (
            <span style={{ color: 'var(--muted)' }} className="text-xs hidden sm:block">
              {member.firstName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-md transition-colors"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
