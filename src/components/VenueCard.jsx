const CITY_COLORS = {
  Paris: '#B08C5A',
  Milan: '#5A8CB0',
  Barcelona: '#B05A5A',
  Vienna: '#5AB08C',
  Lisbon: '#8C5AB0',
}

export default function VenueCard({ venue }) {
  const color = CITY_COLORS[venue.city] || '#534AB7'

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 style={{ color: 'var(--text)' }} className="font-semibold text-sm leading-tight">
            {venue.name}
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
            style={{ color, backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
          >
            {venue.city}
          </span>
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}22` }}
        >
          <span className="text-base">🍸</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-1.5">
          <span style={{ color: 'var(--muted)' }} className="text-xs mt-0.5">📍</span>
          <span style={{ color: 'var(--muted)' }} className="text-xs leading-snug">{venue.address}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ color: 'var(--muted)' }} className="text-xs">🕐</span>
          <span style={{ color: 'var(--muted)' }} className="text-xs">{venue.hours}</span>
        </div>
      </div>

      {/* Deal badge */}
      <div
        className="rounded-lg px-3 py-2 text-xs"
        style={{ backgroundColor: 'rgba(83,74,183,0.12)', border: '1px solid rgba(83,74,183,0.25)', color: '#9B93E8' }}
      >
        🏷 {venue.deal}
      </div>

      {/* CTA */}
      <a
        href={venue.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-xs py-2 rounded-lg transition-colors font-medium"
        style={{ backgroundColor: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
      >
        Get directions →
      </a>
    </div>
  )
}
