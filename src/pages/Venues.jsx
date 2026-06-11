import { useState } from 'react'
import { VENUES, CITIES } from '../data/venues'
import VenueCard from '../components/VenueCard'
import VenueMap from '../components/VenueMap'
import { getMember } from '../lib/member'
import { useLang } from '../lib/i18n'

export default function Venues() {
  const member = getMember()
  const [activeCity, setActiveCity] = useState('All')
  const [view, setView] = useState('list')
  const { t } = useLang()

  const filtered = activeCity === 'All' ? VENUES : VENUES.filter(v => v.city === activeCity)

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="px-4 pt-8 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">{t('venues.title')}</h1>
            <p style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">
              {filtered.length} {filtered.length !== 1 ? t('venues.venues') : t('venues.venue')}{activeCity !== 'All' ? ` ${t('venues.in')} ${activeCity}` : ` ${t('venues.acrossNetwork')}`}
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
              {t('venues.myCity')} ({member.city})
            </button>
          )}
        </div>

        {/* View toggle + city filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
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
                {city === 'All' ? t('venues.all') : city}
              </button>
            ))}
          </div>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
          >
            {[
              { key: 'list', label: t('venues.list') },
              { key: 'map', label: t('venues.map') },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className="px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: view === key ? 'var(--accent)' : 'var(--surface)',
                  color: view === key ? 'white' : 'var(--muted)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {view === 'map' ? (
          <VenueMap />
        ) : (
          <>
            {/* Venue grid */}
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🏙</div>
                <p style={{ color: 'var(--muted)' }}>{t('venues.none')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
