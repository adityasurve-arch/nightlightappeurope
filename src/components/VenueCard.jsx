import { Link } from 'react-router-dom'

const CITY_COLORS = {
  Paris: '#B08C5A',
}

export default function VenueCard({ venue }) {
  const color = CITY_COLORS[venue.city] || '#534AB7'

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-0.5 nl-press"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none' }}
    >
      {/* Photo header */}
      <div className="relative" style={{ height: 140 }}>
        <img
          src={venue.photos[0]}
          alt={venue.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Rating chip */}
        <div
          className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-xs font-bold"
          style={{ backgroundColor: 'var(--success)', color: '#052e12' }}
        >
          {venue.rating} ★
        </div>
        {/* Gradient for legibility */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12"
          style={{ background: 'linear-gradient(transparent, rgba(14,14,16,0.9))' }}
        />
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        {/* Name + type */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 style={{ color: 'var(--text)' }} className="font-semibold text-sm leading-tight">
              {venue.name}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 11 }} className="mt-0.5">
              {venue.type} · {venue.priceForTwo}
            </p>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ color, backgroundColor: `${color}22`, border: `1px solid ${color}44` }}
          >
            {venue.city}
          </span>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-1.5">
          <span style={{ color: 'var(--muted)' }} className="text-xs">🕐</span>
          <span style={{ color: 'var(--muted)' }} className="text-xs">{venue.hours}</span>
        </div>

        {/* Deal badge */}
        <div
          className="rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: 'rgba(83,74,183,0.12)', border: '1px solid rgba(83,74,183,0.25)', color: '#9B93E8' }}
        >
          🏷 {venue.deal}
        </div>

        {/* CTA hint */}
        <div
          className="text-center text-xs py-2 rounded-lg font-medium"
          style={{ backgroundColor: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          View menu, photos & offers →
        </div>
      </div>
    </Link>
  )
}
