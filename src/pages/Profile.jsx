import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { getMember, clearMember, getCompanions } from '../lib/member'
import { getTier } from '../data/rewards'
import { SYNTHETIC_VISITS } from '../data/visits'
import { NETWORK_MEMBERS, TIER_COLORS } from '../data/networkMembers'
import TierBadge from '../components/TierBadge'

function buildCrew() {
  const stored = getCompanions()
  // count outings per network member across all visits
  const counts = {}
  SYNTHETIC_VISITS.forEach(visit => {
    const ids = stored[visit.id] ?? visit.defaultCompanions ?? []
    ids.forEach(id => {
      counts[id] = (counts[id] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, outings]) => ({ member: NETWORK_MEMBERS.find(m => m.id === id), outings }))
    .filter(({ member }) => !!member)
}

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const crewRef = useRef(null)
  const member = getMember()
  const tier = getTier(member.points)
  const crew = buildCrew()

  useEffect(() => {
    if (location.search.includes('section=crew') && crewRef.current) {
      setTimeout(() => crewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [location.search])

  function handleSignOut() {
    clearMember()
    navigate('/')
  }

  const initials = `${member.firstName?.[0] ?? ''}${member.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen pb-28">
      <div className="px-4 pt-8 flex flex-col gap-5">

        {/* Header */}
        <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">Profile</h1>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            {initials}
          </div>
          <div className="text-center">
            <div style={{ color: 'var(--text)' }} className="text-lg font-bold">
              {member.firstName} {member.lastName}
            </div>
            <div style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">{member.email}</div>
          </div>
          <TierBadge tier={tier} size="md" />
        </div>

        {/* Member details */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {[
            { label: 'Member ID', value: member.memberId },
            { label: 'City', value: member.city },
            {
              label: 'Member since',
              value: new Date(member.signupDate).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              }),
            },
            { label: 'Points', value: `${member.points} pts` },
            {
              label: 'Identity',
              value: member.verified ? '✓ Verified' : '⚠ Unverified',
              valueStyle: { color: member.verified ? '#4ade80' : '#fbbf24' },
            },
          ].map(({ label, value, valueStyle }, i, arr) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3.5"
              style={{
                backgroundColor: 'var(--surface)',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ color: 'var(--muted)' }} className="text-sm">{label}</span>
              <span style={{ color: 'var(--text)', ...valueStyle }} className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Your crew */}
        <div ref={crewRef}>
          <div className="flex items-baseline justify-between mb-3">
            <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold">Your crew</h2>
            <span style={{ color: 'var(--muted)', fontSize: '11px' }}>
              {crew.length} network member{crew.length !== 1 ? 's' : ''}
            </span>
          </div>

          {crew.length === 0 ? (
            <div
              className="rounded-2xl px-4 py-6 text-center"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p style={{ color: 'var(--muted)' }} className="text-sm">
                No crew yet — tag network members on your visits in History.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {crew.map(({ member: m, outings }, i, arr) => {
                const tierColor = TIER_COLORS[m.tier] || 'var(--muted)'
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: `${tierColor}22`, color: tierColor }}
                    >
                      {m.firstName[0]}{m.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                        {m.firstName} {m.lastName}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '11px' }}>
                        {m.city} · {m.tier}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div style={{ color: 'var(--text)' }} className="text-sm font-semibold">{outings}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '10px' }}>
                        outing{outings !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            disabled
            className="w-full py-3.5 rounded-2xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            ✏️ Edit profile — coming soon
          </button>

          {!member.verified && (
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fbbf24' }}
            >
              🪪 Verify Identity
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            Sign out
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="text-center pb-2">
          Pernod Network · v0.1 prototype · Drink responsibly
        </p>
      </div>
    </div>
  )
}
