import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SYNTHETIC_VISITS, VISIT_CITIES } from '../data/visits'
import { NETWORK_MEMBERS, TIER_COLORS, findMembers } from '../data/networkMembers'
import { getCompanions, setVisitCompanions } from '../lib/member'

const CITY_COLORS = {
  Paris: '#B08C5A',
  Milan: '#5A8CB0',
  Barcelona: '#B05A5A',
  Vienna: '#5AB08C',
  Lisbon: '#8C5AB0',
}

const CATEGORY_COLORS = {
  Whisky: '#C4A35A',
  Gin: '#5AB0A3',
  Vodka: '#8C9FD4',
  Rum: '#C47A5A',
  Tequila: '#8CC45A',
  Liqueur: '#C45AB0',
  Aperitif: '#C4825A',
}

function formatMonth(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function formatDay(dateStr) {
  const d = new Date(dateStr)
  return { day: d.getDate(), weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }) }
}

function groupByMonth(visits) {
  const groups = {}
  visits.forEach(v => {
    const key = formatMonth(v.date)
    if (!groups[key]) groups[key] = []
    groups[key].push(v)
  })
  return groups
}

function getMemberById(id) {
  return NETWORK_MEMBERS.find(m => m.id === id)
}

function MemberChip({ memberId, onRemove }) {
  const m = getMemberById(memberId)
  if (!m) return null
  const tierColor = TIER_COLORS[m.tier] || 'var(--muted)'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: 'var(--text)', border: '1px solid var(--border)' }}
    >
      <span style={{ color: tierColor, fontSize: '8px' }}>●</span>
      {m.firstName} {m.lastName}
      {onRemove && (
        <button
          onClick={() => onRemove(memberId)}
          className="ml-0.5 leading-none"
          style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: 1 }}
        >
          ×
        </button>
      )}
    </span>
  )
}

function TagSheet({ visitId, currentIds, onClose, onSave }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([...currentIds])
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = query.length > 0 ? findMembers(query) : []

  function toggle(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleSave() {
    onSave(visitId, selected)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className="fixed bottom-0 left-1/2 z-50 flex flex-col"
        style={{
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '70vh',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'var(--border)' }} />
        </div>

        <div className="px-4 pt-2 pb-3">
          <div style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">
            Who were you with?
          </div>

          {/* Search input */}
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
            style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--muted)' }}>
              <circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or member ID…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text)' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--muted)' }}>×</button>
            )}
          </div>

          {/* Selected chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.map(id => (
                <MemberChip key={id} memberId={id} onRemove={id => setSelected(prev => prev.filter(x => x !== id))} />
              ))}
            </div>
          )}

          {/* Search results */}
          <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
            {query.length > 0 && results.length === 0 && (
              <p style={{ color: 'var(--muted)' }} className="text-sm text-center py-4">
                No network members found
              </p>
            )}
            {query.length === 0 && selected.length === 0 && (
              <p style={{ color: 'var(--muted)' }} className="text-xs text-center py-3">
                Search for a Pernod Network member to tag
              </p>
            )}
            {results.map(m => {
              const isSelected = selected.includes(m.id)
              const tierColor = TIER_COLORS[m.tier] || 'var(--muted)'
              return (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'rgba(83,74,183,0.15)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(83,74,183,0.3)' : 'transparent'}`,
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ backgroundColor: `${tierColor}25`, color: tierColor }}
                  >
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                      {m.firstName} {m.lastName}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px' }}>
                      {m.city} · {m.memberId}
                    </div>
                  </div>
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="px-4 pb-6 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Save {selected.length > 0 ? `(${selected.length} tagged)` : ''}
          </button>
        </div>
      </div>
    </>
  )
}

function buildCrewPreview(companionsMap) {
  const counts = {}
  SYNTHETIC_VISITS.forEach(visit => {
    const ids = companionsMap[visit.id] ?? visit.defaultCompanions ?? []
    ids.forEach(id => { counts[id] = (counts[id] ?? 0) + 1 })
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const uniqueCount = sorted.length
  const topTwo = sorted.slice(0, 2).map(([id]) => {
    const m = NETWORK_MEMBERS.find(n => n.id === id)
    return m ? m.firstName : null
  }).filter(Boolean)
  return { uniqueCount, topTwo }
}

export default function History() {
  const navigate = useNavigate()
  const [activeCity, setActiveCity] = useState('All')
  const [companions, setCompanions] = useState(getCompanions)
  const [taggingVisitId, setTaggingVisitId] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const filtered = activeCity === 'All'
    ? SYNTHETIC_VISITS
    : SYNTHETIC_VISITS.filter(v => v.city === activeCity)

  const visibleVisits = showAll ? filtered : filtered.slice(0, 2)
  const grouped = groupByMonth(visibleVisits)

  const totalVisits = filtered.length
  const totalPoints = filtered.reduce((sum, v) => sum + v.pointsEarned, 0)
  const { uniqueCount: crewCount, topTwo: crewTopTwo } = buildCrewPreview(companions)

  function handleCityChange(city) {
    setActiveCity(city)
    setShowAll(false)
  }

  function getVisitCompanionIds(visit) {
    // localStorage override takes precedence over synthetic defaults
    return companions[visit.id] ?? visit.defaultCompanions ?? []
  }

  function handleSaveCompanions(visitId, memberIds) {
    setVisitCompanions(visitId, memberIds)
    setCompanions(getCompanions())
  }

  const taggingVisit = taggingVisitId ? SYNTHETIC_VISITS.find(v => v.id === taggingVisitId) : null

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen pb-28">
      <div className="px-4 pt-8 flex flex-col gap-5">

        {/* Header */}
        <div>
          <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">My History</h1>
          <p style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">Your recent venue visits</p>
        </div>

        {/* Summary strip — 2 columns */}
        <div
          className="grid grid-cols-2 rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >
          {[
            { value: totalVisits, label: 'Visits' },
            { value: totalPoints, label: 'Pts earned' },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-4"
              style={{
                backgroundColor: 'var(--surface)',
                borderRight: i === 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ color: 'var(--text)' }} className="text-xl font-bold">{value}</div>
              <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Group activity button */}
        <button
          onClick={() => navigate('/profile?section=crew')}
          className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 text-left transition-all active:scale-95"
          style={{
            backgroundColor: 'rgba(83,74,183,0.08)',
            border: '1px solid rgba(83,74,183,0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(83,74,183,0.2)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#9B93E8" strokeWidth={1.8} className="w-5 h-5">
                <circle cx="9" cy="7" r="3" />
                <path d="M3 20c0-3.3 2.7-6 6-6" strokeLinecap="round" />
                <circle cx="16" cy="7" r="3" />
                <path d="M21 20c0-3.3-2.7-6-6-6" strokeLinecap="round" />
                <path d="M12 14c2.2 0 4 1.8 4 4" strokeLinecap="round" />
                <path d="M12 14c-2.2 0-4 1.8-4 4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ color: '#9B93E8' }} className="text-sm font-semibold">Group activity</div>
              <div style={{ color: 'var(--muted)', fontSize: '11px' }} className="mt-0.5">
                {crewCount > 0
                  ? `${crewCount} network member${crewCount !== 1 ? 's' : ''} · ${crewTopTwo.join(', ')}${crewCount > 2 ? ` +${crewCount - 2}` : ''}`
                  : 'Tag friends on visits to see group trends'}
              </div>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="#9B93E8" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* City filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {VISIT_CITIES.map(city => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{
                backgroundColor: activeCity === city ? 'var(--accent)' : 'var(--surface)',
                color: activeCity === city ? 'white' : 'var(--muted)',
                border: `1px solid ${activeCity === city ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Visit list grouped by month */}
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="text-4xl">🍸</div>
            <p style={{ color: 'var(--muted)' }} className="text-sm">No visits yet in {activeCity}.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([month, visits]) => (
            <div key={month}>
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--muted)' }}>
                {month}
              </div>
              <div className="flex flex-col gap-3">
                {visits.map(visit => {
                  const { day, weekday } = formatDay(visit.date)
                  const cityColor = CITY_COLORS[visit.city] || 'var(--accent)'
                  const companionIds = getVisitCompanionIds(visit)

                  return (
                    <div
                      key={visit.id}
                      className="rounded-2xl p-4 flex gap-4"
                      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                    >
                      {/* Date pill */}
                      <div
                        className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl w-12"
                        style={{ backgroundColor: `${cityColor}18`, border: `1px solid ${cityColor}33` }}
                      >
                        <span style={{ color: cityColor }} className="text-lg font-bold leading-none">{day}</span>
                        <span style={{ color: cityColor, fontSize: '10px' }} className="font-medium uppercase">{weekday}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div style={{ color: 'var(--text)' }} className="text-sm font-semibold truncate">{visit.venueName}</div>
                            <div
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs mt-0.5"
                              style={{ backgroundColor: `${cityColor}18`, color: cityColor }}
                            >
                              📍 {visit.city}
                            </div>
                          </div>
                          <div
                            className="flex-shrink-0 px-2 py-1 rounded-lg text-xs font-semibold"
                            style={{ backgroundColor: 'rgba(83,74,183,0.15)', color: '#9B93E8' }}
                          >
                            +{visit.pointsEarned} pts
                          </div>
                        </div>

                        {/* Companions row */}
                        <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
                          {companionIds.map(id => (
                            <MemberChip key={id} memberId={id} />
                          ))}
                          <button
                            onClick={() => setTaggingVisitId(visit.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors"
                            style={{
                              color: 'var(--muted)',
                              border: '1px dashed var(--border)',
                              backgroundColor: 'transparent',
                            }}
                          >
                            <span>👥</span>
                            <span>{companionIds.length > 0 ? 'Edit' : '+ Tag friends'}</span>
                          </button>
                        </div>

                        {/* Drink chips */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {visit.drinks.map((drink, i) => {
                            const catColor = CATEGORY_COLORS[drink.category] || 'var(--muted)'
                            return (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{
                                  backgroundColor: `${catColor}18`,
                                  color: catColor,
                                  border: `1px solid ${catColor}33`,
                                }}
                              >
                                {drink.brand} · {drink.category}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}

        {/* See past visits */}
        {!showAll && filtered.length > 2 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3.5 rounded-2xl text-sm font-medium transition-all active:scale-95"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            See past visits ({filtered.length - 2} more)
          </button>
        )}
      </div>

      {/* Tag sheet */}
      {taggingVisit && (
        <TagSheet
          visitId={taggingVisit.id}
          currentIds={getVisitCompanionIds(taggingVisit)}
          onClose={() => setTaggingVisitId(null)}
          onSave={handleSaveCompanions}
        />
      )}
    </div>
  )
}
