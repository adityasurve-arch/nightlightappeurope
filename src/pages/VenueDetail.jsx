import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getVenueById } from '../data/venues'
import { MENU } from '../data/menu'

const REVIEWS = [
  { name: 'Sofia R.', tier: 'Silver', stars: 5, text: 'Great vibe on Thursdays. The member deal on vodka is actually real — same price as house.', date: 'May 2026' },
  { name: 'Luca F.', tier: 'Bronze', stars: 4, text: 'Came with my crew, ordered from the table with the app. No waiting at the bar, drinks were ready fast.', date: 'May 2026' },
  { name: 'Camille M.', tier: 'Gold', stars: 5, text: 'My go-to spot. Staff knows the Quarter perks and the pickup QR works smoothly.', date: 'April 2026' },
]

function Stars({ n }) {
  return (
    <span style={{ color: 'var(--tier-gold)', fontSize: 11, letterSpacing: 1 }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

export default function VenueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const venue = getVenueById(id)
  const [tab, setTab] = useState('offers')
  const [gallery, setGallery] = useState(false)

  if (!venue) {
    return (
      <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', padding: 24 }}>
        <p style={{ color: 'var(--muted)' }}>Venue not found.</p>
        <Link to="/venues" style={{ color: 'var(--accent-light)' }}>← Back to venues</Link>
      </div>
    )
  }

  const [p1, p2, p3] = venue.photos

  // Full-screen gallery
  if (gallery) {
    return (
      <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingBottom: 32 }}>
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <button
            onClick={() => setGallery(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center nl-press"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            ←
          </button>
          <span style={{ color: 'white' }} className="text-sm font-semibold">{venue.name} · {venue.photos.length} photos</span>
        </div>
        <div className="flex flex-col gap-2 px-2 pt-2">
          {venue.photos.map((src, i) => (
            <img key={i} src={src} alt={`${venue.name} photo ${i + 1}`} className="w-full rounded-xl" loading="lazy" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', paddingBottom: 96 }}>

      {/* ── Photo collage header ── */}
      <div className="relative grid grid-cols-2 gap-1.5 p-1.5" style={{ height: 300 }}>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full flex items-center justify-center nl-press"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: 'white', border: 'none', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
        >
          ←
        </button>
        <div className="flex flex-col gap-1.5 h-full min-h-0">
          <img src={p1} alt={venue.name} className="w-full rounded-xl object-cover" style={{ height: '58%' }} />
          <img src={p2} alt={`${venue.name} drinks`} className="w-full rounded-xl object-cover" style={{ height: '42%' }} />
        </div>
        <div className="relative h-full">
          <img src={p3} alt={`${venue.name} interior`} className="w-full h-full rounded-xl object-cover" />
          <button
            onClick={() => setGallery(true)}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold nl-press"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
          >
            View gallery
          </button>
        </div>
      </div>

      {/* ── Info block ── */}
      <div className="px-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h1 style={{ color: 'var(--text)' }} className="text-2xl font-bold leading-tight">{venue.name}</h1>
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1"
              style={{ backgroundColor: 'var(--success)', color: '#052e12' }}
            >
              {venue.rating} ★
            </div>
            <span style={{ color: 'var(--muted)', fontSize: 10 }} className="mt-1">{venue.reviewCount}</span>
          </div>
        </div>

        <p style={{ color: 'var(--muted)' }} className="text-sm mt-1">
          {venue.type} · {venue.priceForTwo}
        </p>
        <p style={{ color: 'var(--muted)' }} className="text-xs mt-1.5 leading-relaxed">
          {venue.distance} · {venue.address}
        </p>
        <p className="text-xs mt-1.5">
          <span style={{ color: 'var(--amber)' }} className="font-semibold">Opens at {venue.opensAt}</span>
          <span style={{ color: 'var(--muted)' }}> · {venue.hours}</span>
        </p>

        {/* Action chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setTab('offers')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 nl-press"
            style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-light)', border: '1px solid rgba(200,146,42,0.3)', cursor: 'pointer' }}
          >
            ✨ Tonight's deal
          </button>
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 nl-press"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none' }}
          >
            🧭 Directions
          </a>
          <a
            href={`tel:${venue.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 nl-press"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none' }}
          >
            📞 Call now
          </a>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-6 px-4 mt-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { key: 'offers', label: 'Offers' },
          { key: 'menu', label: 'Menu' },
          { key: 'reviews', label: 'Reviews' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="pb-2.5 text-sm font-semibold"
            style={{
              color: tab === key ? 'var(--text)' : 'var(--muted)',
              borderBottom: tab === key ? '2px solid var(--accent)' : '2px solid transparent',
              backgroundColor: 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="px-4 pt-4">

        {tab === 'offers' && (
          <div className="flex flex-col gap-3 nl-slide-up">
            {/* Hero deal card */}
            <div
              className="rounded-2xl overflow-hidden flex"
              style={{ background: 'linear-gradient(105deg, var(--accent) 0%, #3A3380 100%)' }}
            >
              <div className="px-5 py-5 flex items-center" style={{ borderRight: '1.5px dashed rgba(255,255,255,0.25)' }}>
                <div style={{ color: 'white' }} className="text-lg font-extrabold leading-tight">
                  MEMBER<br />DEAL
                </div>
              </div>
              <div className="px-4 py-4 flex-1">
                <div style={{ color: 'white' }} className="text-sm font-semibold leading-snug">{venue.deal}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs mt-1.5">
                  Show your member card · No code needed
                </div>
                <Link to={`/order?venue=${venue.id}`} style={{ color: 'white' }} className="text-xs font-bold mt-2 inline-block">
                  Order now →
                </Link>
              </div>
            </div>

            {/* Points reminder */}
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className="text-xl">⚡</span>
              <p style={{ color: 'var(--muted)' }} className="text-xs leading-relaxed">
                Earn <span style={{ color: 'var(--accent-light)' }} className="font-semibold">10 pts</span> for visiting
                + <span style={{ color: 'var(--accent-light)' }} className="font-semibold">5 pts</span> per drink at this venue
              </p>
            </div>
          </div>
        )}

        {tab === 'menu' && (
          <div className="flex flex-col gap-5 nl-slide-up">
            {MENU.map(({ category, emoji, items }) => (
              <div key={category}>
                <h3 style={{ color: 'var(--text)' }} className="text-sm font-bold mb-2">
                  {emoji} {category}
                </h3>
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  {items.map((item, i, arr) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--text)' }} className="text-sm font-medium">{item.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 11 }}>{item.description}</div>
                      </div>
                      <span style={{ color: 'var(--text)' }} className="text-sm font-semibold flex-shrink-0 ml-3">
                        €{item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p style={{ color: 'var(--muted)', fontSize: 11 }} className="text-center pb-2">
              Prices may vary by night · Member deals applied at checkout
            </p>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="flex flex-col gap-3 nl-slide-up">
            {REVIEWS.map(({ name, tier, stars, text, date }) => (
              <div
                key={name}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-light)' }}
                    >
                      {name[0]}
                    </div>
                    <div>
                      <div style={{ color: 'var(--text)' }} className="text-xs font-semibold">{name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 10 }}>{tier} member · {date}</div>
                    </div>
                  </div>
                  <Stars n={stars} />
                </div>
                <p style={{ color: 'var(--muted)' }} className="text-xs leading-relaxed">{text}</p>
              </div>
            ))}
            <p style={{ color: 'var(--muted)', fontSize: 11 }} className="text-center pb-2">
              Reviews from verified Quarter members only
            </p>
          </div>
        )}
      </div>

      {/* ── Sticky bottom CTAs ── */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full flex gap-3 px-4 py-3 z-40"
        style={{
          maxWidth: 430,
          backgroundColor: 'rgba(14,14,16,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <a
          href={venue.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-center nl-press"
          style={{ backgroundColor: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none' }}
        >
          Get directions
        </a>
        <Link
          to={`/order?venue=${venue.id}`}
          className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-center nl-press"
          style={{ backgroundColor: 'var(--accent)', color: 'white', textDecoration: 'none' }}
        >
          Order here 🍸
        </Link>
      </div>
    </div>
  )
}
