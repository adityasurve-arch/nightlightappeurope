import { useState } from 'react'
import { VENUES, CITIES } from '../data/venues'
import VenueCard from '../components/VenueCard'
import { getMember } from '../lib/member'

export default function Venues() {
  const member = getMember()
  const [activeCity, setActiveCity] = useState('All')

  const filtered = activeCity === 'All' ? VENUES : VENUES.filter(v => v.city === activeCity)

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="px-4 pt-8 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">Partner Venues</h1>
            <p style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">
              {filtered.length} venue{filtered.length !== 1 ? 's' : ''}{activeCity !== 'All' ? ` in ${activeCity}` : ' across the network'}
            </p>
          </div>
          {member?.city && (
            <button
              onClick={() => setActiveCity(member.city)}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor: activeCity === member.city ? 'rgba(83,74,183,0.2)' : 'var(--surface)',
                color: activeCity === member.city ? '#9B93E8' : 'var(--muted)',
                border: `1px solid ${activeCity === member.city ? 'var(--accent)' : 'var(--border)'}`,
              }}
            >
              My city ({member.city})
            </button>
          )}
        </div>

        {/* City filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', ...CITIES].map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className="px-3 py-1.5 rounded-lg text-sm transition-colors"
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

        {/* Venue grid */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🏙</div>
            <p style={{ color: 'var(--muted)' }}>No venues found for this city.</p>
          </div>
        )}
      </div>
    </div>
  )
}
