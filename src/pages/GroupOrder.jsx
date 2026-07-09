import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getMember } from '../lib/member'
import { MENU, getItemById } from '../data/menu'
import { VENUES, getVenueById } from '../data/venues'
import { useLang } from '../lib/i18n'

const VENUE_KEY = 'nl_venue'

// ─── Demo friends who "join" the table ───────────────────────────────────────
const DEMO_FRIENDS = [
  { id: 'NL-3301-B', name: 'Sophie M.', initials: 'SM', tier: 'Gold' },
  { id: 'NL-5512-C', name: 'Lucas B.', initials: 'LB', tier: 'Silver' },
]

const TIER_COLORS = { Bronze: '#C4843A', Silver: '#8C9FD4', Gold: '#C4A93A' }

// ─── Fake QR code SVG ────────────────────────────────────────────────────────
function QRCode({ value = 'NL-TABLE', size = 176 }) {
  const N = 21
  const cellSize = size / N

  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(hash * 31 + value.charCodeAt(i), 1) | 0
  }

  const finderFilled = (r, c, or, oc) => {
    const dr = r - or, dc = c - oc
    if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return false
    if (dr === 0 || dr === 6 || dc === 0 || dc === 6) return true
    if (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) return true
    return false
  }

  const isFinder = (r, c) =>
    (r <= 7 && c <= 7) || (r <= 7 && c >= N - 8) || (r >= N - 8 && c <= 7)

  const cells = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let filled = false
      if (r <= 7 && c <= 7) filled = finderFilled(r, c, 0, 0)
      else if (r <= 7 && c >= N - 8) filled = finderFilled(r, c, 0, N - 7)
      else if (r >= N - 8 && c <= 7) filled = finderFilled(r, c, N - 7, 0)
      else if (!isFinder(r, c)) {
        const v = Math.abs(Math.imul(hash + r * 100 + c, 1103515245) + 12345) & 0x7fffffff
        filled = v % 5 !== 0
      }
      if (filled) cells.push({ r, c })
    }
  }

  return (
    <svg width={size} height={size}>
      <rect width={size} height={size} fill="white" rx="10" />
      {cells.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          x={c * cellSize + 0.5}
          y={r * cellSize + 0.5}
          width={cellSize - 1}
          height={cellSize - 1}
          fill="#111827"
          rx="0.5"
        />
      ))}
    </svg>
  )
}

// ─── Camera scanner frame (shared by venue scan + join scan) ─────────────────
function ScannerView({ title, subtitle, hint, detected }) {
  return (
    <div style={{ backgroundColor: '#000', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />

        {/* Scanner frame */}
        <div style={{ position: 'relative', width: 240, height: 240, zIndex: 2 }}>
          {[
            { top: 0, left: 0, borderTop: '3px solid white', borderLeft: '3px solid white', borderRadius: '6px 0 0 0' },
            { top: 0, right: 0, borderTop: '3px solid white', borderRight: '3px solid white', borderRadius: '0 6px 0 0' },
            { bottom: 0, left: 0, borderBottom: '3px solid white', borderLeft: '3px solid white', borderRadius: '0 0 0 6px' },
            { bottom: 0, right: 0, borderBottom: '3px solid white', borderRight: '3px solid white', borderRadius: '0 0 6px 0' },
          ].map((style, i) => (
            <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...style, ...(detected ? { borderColor: '#4ade80' } : {}) }} />
          ))}

          {!detected && (
            <div
              style={{
                position: 'absolute',
                left: 8, right: 8, height: 2,
                background: 'linear-gradient(90deg, transparent, #C8922A, #DBA84E, #C8922A, transparent)',
                boxShadow: '0 0 12px rgba(200,146,42,0.8)',
                animation: 'scanLine 2s ease-in-out infinite',
              }}
            />
          )}

          {detected && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  backgroundColor: 'rgba(74,222,128,0.15)', border: '2px solid #4ade80',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#4ade80', fontSize: 26, animation: 'popIn 0.3s ease',
                }}
              >
                ✓
              </div>
            </div>
          )}

          <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }} />
        </div>

        {/* Top label */}
        <div style={{ position: 'absolute', top: 48, left: 0, right: 0, textAlign: 'center', zIndex: 2, padding: '0 24px' }}>
          <div style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{subtitle}</div>
        </div>

        {/* Scanning indicator */}
        <div
          style={{
            position: 'absolute', bottom: 80, left: 0, right: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 2,
          }}
        >
          {detected ? (
            <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>QR detected</span>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.4)',
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Scanning…</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{ backgroundColor: '#0E0E10', padding: '20px 24px 36px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.5, margin: 0, textAlign: 'center' }}>{hint}</p>
      </div>

      <style>{`
        @keyframes scanLine { 0%, 100% { top: 8px; } 50% { top: calc(100% - 10px); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}

// ─── SCREEN 1: Scan the venue QR (entry point, like a QR menu) ───────────────
function VenueScanScreen({ detected }) {
  return (
    <ScannerView
      title="Scan the venue QR"
      subtitle="Find it on your table or at the bar"
      hint="Every Quarter partner venue has a QR code on the table — scan it to see the menu and start ordering"
      detected={detected}
    />
  )
}

// ─── SCREEN 2: Venue detected → Start a Table ────────────────────────────────
function TableStartScreen({ venue, onStart, onJoin, onRescan }) {
  const { t } = useLang()
  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100%', padding: '32px 20px' }}>
      {/* Venue hero */}
      <div
        style={{
          borderRadius: 20, overflow: 'hidden', marginBottom: 20,
          border: '1px solid var(--border)', position: 'relative',
        }}
      >
        <img src={venue.photos[0]} alt={venue.name} style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(14,14,16,0.92) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
          <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 600, marginBottom: 2 }}>✓ QR scanned</div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>{venue.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{venue.address}</div>
        </div>
      </div>

      {/* How it works */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {[
          { icon: '📲', title: t('order.step1'), desc: t('order.step1d') },
          { icon: '🛒', title: t('order.step2'), desc: t('order.step2d') },
          { icon: '🍸', title: t('order.step3'), desc: t('order.step3d') },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
            <div>
              <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={onStart}
          className="nl-press"
          style={{
            backgroundColor: 'var(--accent)', color: 'white', border: 'none',
            borderRadius: 14, padding: '16px 0', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', width: '100%',
          }}
        >
          {t('order.start')}
        </button>
        <button
          onClick={onJoin}
          className="nl-press"
          style={{
            backgroundColor: 'transparent', color: 'var(--text)',
            border: '1px solid var(--border)', borderRadius: 14,
            padding: '16px 0', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', width: '100%',
          }}
        >
          {t('order.join')}
        </button>
        <button
          onClick={onRescan}
          style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            fontSize: 12, cursor: 'pointer', padding: '6px 0',
          }}
        >
          Wrong venue? Scan again
        </button>
      </div>
    </div>
  )
}

// ─── SCREEN 2b: Join — scan the host's QR ────────────────────────────────────
function JoinScreen() {
  return (
    <ScannerView
      title="Scan the host's QR code"
      subtitle="Point your camera at their screen"
      hint="Ask the host to show their table QR code"
    />
  )
}

// ─── SCREEN 3: Host QR ────────────────────────────────────────────────────────
function HostQRScreen({ member, tableMembers, venue, onStart }) {
  const { t } = useLang()
  const ready = tableMembers.length >= 2

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100%', padding: '32px 20px' }}>
      <h1 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        {t('order.yourTable')}{venue ? ` ${t('order.at')} ${venue.name}` : ''}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28 }}>
        {t('order.scanToJoin')}
      </p>

      {/* QR card */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <QRCode value={member?.memberId || 'NL-DEMO'} size={176} />
        <div style={{ color: 'var(--muted)', fontSize: 12, letterSpacing: 2, fontWeight: 600 }}>
          {member?.memberId || 'NL-DEMO'}
        </div>
      </div>

      {/* Members joined */}
      <div
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          At your table
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tableMembers.map((m, i) => (
            <div
              key={m.id}
              style={{ display: 'flex', alignItems: 'center', gap: 12, animation: i > 0 ? 'fadeIn 0.4s ease' : 'none' }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: i === 0 ? 'rgba(200,146,42,0.2)' : 'var(--surface2)',
                  border: `2px solid ${i === 0 ? 'var(--accent)' : TIER_COLORS[m.tier] || 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text)',
                  flexShrink: 0,
                }}
              >
                {m.initials}
              </div>
              <div>
                <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
                  {m.name} {i === 0 && <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 400 }}>(you)</span>}
                </div>
                <div style={{ color: TIER_COLORS[m.tier] || 'var(--muted)', fontSize: 11 }}>{m.tier}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#4ade80', fontSize: 12 }}>✓ Joined</div>
            </div>
          ))}

          {tableMembers.length < 3 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '2px dashed var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--muted)', fontSize: 18,
                }}
              >
                +
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>Waiting for friends…</div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onStart}
        style={{
          backgroundColor: 'var(--accent)',
          color: 'white',
          border: '1px solid var(--accent)',
          borderRadius: 14,
          padding: '16px 0',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          width: '100%',
          transition: 'all 0.3s',
        }}
      >
        {ready ? 'Start Ordering →' : 'Order by myself →'}
      </button>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}

// ─── SCREEN 4: Menu ───────────────────────────────────────────────────────────
function MenuScreen({ tableMembers, cart, activeMember, setActiveMember, activeCategory, setActiveCategory, addToCart, removeFromCart, getTotalItems, onViewCart, onBack, venue }) {
  const totalItems = getTotalItems()
  const currentCat = MENU.find(c => c.category === activeCategory)

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '24px 20px 0', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, padding: 0, lineHeight: 1, flexShrink: 0 }}
          >
            ←
          </button>
          <h1 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700 }}>
            {venue ? venue.name : 'Table Menu'}
          </h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          {venue ? `📍 ${venue.address.split(',')[0]} · ` : ''}Pick who you're adding drinks for
        </p>
      </div>

      {/* Member selector */}
      <div style={{ display: 'flex', gap: 10, padding: '0 20px', marginBottom: 20, overflowX: 'auto' }} className="no-scrollbar">
        {tableMembers.map((m) => {
          const isActive = activeMember === m.id
          const memberItems = Object.values(cart[m.id] || {}).reduce((a, b) => a + b, 0)
          return (
            <button
              key={m.id}
              onClick={() => setActiveMember(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 99,
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: isActive ? 'rgba(200,146,42,0.15)' : 'var(--surface)',
                color: isActive ? '#DBA84E' : 'var(--muted)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--surface2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: 'white',
                }}
              >
                {m.initials}
              </div>
              {m.name.split(' ')[0]}
              {memberItems > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--accent)', color: 'white',
                    fontSize: 10, fontWeight: 700, borderRadius: 99,
                    padding: '1px 6px', marginLeft: 2,
                  }}
                >
                  {memberItems}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 20px', marginBottom: 20, overflowX: 'auto' }} className="no-scrollbar">
        {MENU.map(({ category, emoji }) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: isActive ? 'var(--accent)' : 'var(--surface)',
                color: isActive ? 'white' : 'var(--muted)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {emoji} {category}
            </button>
          )
        })}
      </div>

      {/* Drink list */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {currentCat?.items.map(item => {
          const qty = (cart[activeMember] || {})[item.id] || 0
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--surface)',
                border: `1px solid ${qty > 0 ? 'rgba(200,146,42,0.4)' : 'var(--border)'}`,
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                  {item.name}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{item.description}</div>
              </div>

              <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700, marginRight: 4 }}>
                €{item.price}
              </div>

              {qty === 0 ? (
                <button
                  onClick={() => addToCart(item.id)}
                  style={{
                    width: 32, height: 32, borderRadius: 99,
                    backgroundColor: 'var(--accent)', border: 'none',
                    color: 'white', fontSize: 20, lineHeight: 1,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      width: 28, height: 28, borderRadius: 99,
                      backgroundColor: 'var(--surface2)', border: '1px solid var(--border)',
                      color: 'var(--text)', fontSize: 18, lineHeight: 1,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    −
                  </button>
                  <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => addToCart(item.id)}
                    style={{
                      width: 28, height: 28, borderRadius: 99,
                      backgroundColor: 'var(--accent)', border: 'none',
                      color: 'white', fontSize: 18, lineHeight: 1,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 50, width: 'calc(100% - 40px)', maxWidth: 390 }}>
          <button
            onClick={onViewCart}
            style={{
              width: '100%',
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '16px 20px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(200,146,42,0.4)',
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 99,
                padding: '2px 10px',
                fontSize: 13,
              }}
            >
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
            <span>View Cart</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Payment methods ──────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'card', label: 'Card', icon: '💳', desc: 'Debit or credit card' },
  { id: 'apple_pay', label: 'Apple Pay', icon: '🍎', desc: 'Fast and secure' },
  { id: 'wallet', label: 'Wallet Money', icon: '💵', desc: 'Your wallet balance' },
  { id: 'counter', label: 'Pay at Counter', icon: '💰', desc: 'Cash or card at bar' },
]

// ─── SCREEN 5: Cart Review ────────────────────────────────────────────────────
function CartReviewScreen({ tableMembers, cart, onBack, onPlace }) {
  const [selectedPayment, setSelectedPayment] = useState('card')

  const getMemberTotal = (memberId) => {
    return Object.entries(cart[memberId] || {}).reduce((total, [itemId, qty]) => {
      const item = getItemById(itemId)
      return total + (item?.price || 0) * qty
    }, 0)
  }

  const tableTotal = tableMembers.reduce((t, m) => t + getMemberTotal(m.id), 0)
  const hasItems = tableTotal > 0

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100%', padding: '24px 20px', paddingBottom: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, padding: 0 }}
        >
          ←
        </button>
        <h1 style={{ color: 'var(--text)', fontSize: 20, fontWeight: 700 }}>Order Summary</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {tableMembers.map((m) => {
          const memberCart = cart[m.id] || {}
          const items = Object.entries(memberCart)
          const total = getMemberTotal(m.id)

          return (
            <div
              key={m.id}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Member header */}
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: items.length > 0 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    backgroundColor: 'var(--surface2)',
                    border: `2px solid ${TIER_COLORS[m.tier] || 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: 'var(--text)',
                  }}
                >
                  {m.initials}
                </div>
                <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, flex: 1 }}>{m.name}</span>
                <span style={{ color: total > 0 ? 'var(--text)' : 'var(--muted)', fontSize: 14, fontWeight: 700 }}>
                  {total > 0 ? `€${total}` : 'Nothing yet'}
                </span>
              </div>

              {/* Items */}
              {items.length > 0 && (
                <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map(([itemId, qty]) => {
                    const item = getItemById(itemId)
                    if (!item) return null
                    return (
                      <div key={itemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--muted)', fontSize: 13 }}>
                          {qty}× {item.name}
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: 13 }}>€{item.price * qty}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Table total */}
      <div
        style={{
          backgroundColor: 'rgba(200,146,42,0.08)',
          border: '1px solid rgba(200,146,42,0.2)',
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <span style={{ color: '#DBA84E', fontSize: 14, fontWeight: 600 }}>Table Total</span>
        <span style={{ color: '#DBA84E', fontSize: 18, fontWeight: 800 }}>€{tableTotal}</span>
      </div>

      {/* Payment method selection */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Payment Method
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PAYMENT_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              style={{
                backgroundColor: selectedPayment === method.id ? 'rgba(83,74,183,0.15)' : 'var(--surface)',
                border: `2px solid ${selectedPayment === method.id ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{method.icon}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
                  {method.label}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 1 }}>
                  {method.desc}
                </div>
              </div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `2px solid ${selectedPayment === method.id ? 'var(--accent)' : 'var(--border)'}`,
                  backgroundColor: selectedPayment === method.id ? 'var(--accent)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {selectedPayment === method.id && (
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onPlace(selectedPayment)}
        disabled={!hasItems}
        style={{
          width: '100%',
          backgroundColor: hasItems ? 'var(--accent)' : 'var(--surface)',
          color: hasItems ? 'white' : 'var(--muted)',
          border: `1px solid ${hasItems ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 14,
          padding: '16px 0',
          fontSize: 15,
          fontWeight: 700,
          cursor: hasItems ? 'pointer' : 'not-allowed',
        }}
      >
        Place Order
      </button>

      <p style={{ color: 'var(--muted)', fontSize: 11, textAlign: 'center', marginTop: 12 }}>
        Each drink is logged to the member who ordered it
      </p>
    </div>
  )
}

// ─── SCREEN 6: Order Placed ───────────────────────────────────────────────────
function OrderPlacedScreen({ status, venue }) {
  const { t } = useLang()
  const isReady = status === 'ready'

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100%', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Status icon */}
      <div
        style={{
          width: 72, height: 72, borderRadius: '50%',
          backgroundColor: isReady ? 'rgba(74,222,128,0.1)' : 'rgba(200,146,42,0.1)',
          border: `2px solid ${isReady ? '#4ade80' : 'var(--accent)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, marginBottom: 20,
          transition: 'all 0.5s',
        }}
      >
        {isReady ? '✓' : '🍸'}
      </div>

      <h1 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
        {isReady ? t('order.ready') : t('order.received')}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32, textAlign: 'center' }}>
        {isReady
          ? `${t('order.headToBar')}${venue ? ` ${t('order.at')} ${venue.name}` : ''} ${t('order.scanToCollect')}`
          : `${venue ? venue.name : t('order.theBar')} ${t('order.preparingDrinks')}`}
      </p>

      {/* Status bar */}
      <div style={{ width: '100%', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {[t('order.statusReceived'), t('order.statusPreparing'), t('order.statusReady')].map((label, i) => {
            const stepIndex = isReady ? 2 : 1
            const active = i <= stepIndex
            return (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  color: active ? (isReady && i === 2 ? '#4ade80' : 'var(--accent)') : 'var(--muted)',
                  fontWeight: active ? 600 : 400,
                  transition: 'color 0.5s',
                }}
              >
                {label}
              </span>
            )
          })}
        </div>
        <div style={{ height: 4, backgroundColor: 'var(--surface)', borderRadius: 99, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: isReady ? '100%' : '60%',
              backgroundColor: isReady ? '#4ade80' : 'var(--accent)',
              borderRadius: 99,
              transition: 'width 0.8s ease, background-color 0.5s',
            }}
          />
        </div>
      </div>

      {/* Pickup QR — appears when ready */}
      {isReady && (
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--surface)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: 20,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            animation: 'fadeIn 0.5s ease',
          }}
        >
          <QRCode value={`PICKUP-${venue?.id || 'BAR'}`} size={160} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              Show this to the bartender
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>
              They'll scan and hand over your order
            </div>
          </div>
        </div>
      )}

      {!isReady && (
        <div
          style={{
            backgroundColor: 'rgba(200,146,42,0.08)',
            border: '1px solid rgba(200,146,42,0.2)',
            borderRadius: 14,
            padding: '14px 16px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#DBA84E', fontSize: 13, fontWeight: 600 }}>Estimated wait</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>5 – 8 minutes</div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function GroupOrder() {
  const member = getMember()
  const me = {
    id: member?.id || 'me',
    name: member?.firstName ? `${member.firstName} ${member.lastName?.[0] || ''}.` : 'You',
    initials: member?.firstName
      ? `${member.firstName[0]}${member.lastName?.[0] || ''}`.toUpperCase()
      : 'ME',
    tier: member?.tier || 'Silver',
  }

  // Venue context: coming from a venue page (?venue=) counts as having scanned its QR
  const [searchParams] = useSearchParams()
  const paramVenue = getVenueById(searchParams.get('venue'))
  const [venue, setVenue] = useState(paramVenue)
  const [scanDetected, setScanDetected] = useState(false)

  const [step, setStep] = useState(paramVenue ? 'table' : 'scan')
  const [tableMembers, setTableMembers] = useState([me])
  const [cart, setCart] = useState({})
  const [activeCategory, setActiveCategory] = useState(MENU[0].category)
  const [activeMember, setActiveMember] = useState(me.id)
  const [orderStatus, setOrderStatus] = useState('preparing')

  // Demo: venue QR "detected" after a short scan
  useEffect(() => {
    if (step !== 'scan') return
    const detected = getVenueById(localStorage.getItem(VENUE_KEY)) || VENUES[0]
    const t1 = setTimeout(() => setScanDetected(true), 2200)
    const t2 = setTimeout(() => {
      setVenue(detected)
      localStorage.setItem(VENUE_KEY, detected.id)
      setStep('table')
    }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  function rescan() {
    localStorage.removeItem(VENUE_KEY)
    setVenue(null)
    setScanDetected(false)
    setStep('scan')
  }

  // Demo: joining a friend's table — auto-connect after scanning
  useEffect(() => {
    if (step !== 'join') return
    const t = setTimeout(() => {
      setTableMembers([
        { id: 'NL-9901-A', name: 'Alex T.', initials: 'AT', tier: 'Gold' },
        { id: 'NL-3301-B', name: 'Sophie M.', initials: 'SM', tier: 'Silver' },
        me,
      ])
      setActiveMember(me.id)
      setStep('menu')
    }, 3000)
    return () => clearTimeout(t)
  }, [step])

  // Demo: friends auto-join when the host QR is showing
  useEffect(() => {
    if (step !== 'qr') return
    const t1 = setTimeout(() => setTableMembers(p => [...p, DEMO_FRIENDS[0]]), 2000)
    const t2 = setTimeout(() => setTableMembers(p => [...p, DEMO_FRIENDS[1]]), 3800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [step])

  // Demo: order auto-advances to ready after 5s
  useEffect(() => {
    if (step !== 'placed') return
    const t = setTimeout(() => setOrderStatus('ready'), 5000)
    return () => clearTimeout(t)
  }, [step])

  const addToCart = (itemId) =>
    setCart(p => ({
      ...p,
      [activeMember]: { ...(p[activeMember] || {}), [itemId]: ((p[activeMember] || {})[itemId] || 0) + 1 },
    }))

  const removeFromCart = (itemId) =>
    setCart(p => {
      const mc = { ...(p[activeMember] || {}) }
      if (!mc[itemId]) return p
      mc[itemId] > 1 ? mc[itemId]-- : delete mc[itemId]
      return { ...p, [activeMember]: mc }
    })

  const getTotalItems = () =>
    Object.values(cart).reduce((t, mc) => t + Object.values(mc).reduce((a, b) => a + b, 0), 0)

  if (step === 'scan') return <VenueScanScreen detected={scanDetected} />
  if (step === 'table') return <TableStartScreen venue={venue} onStart={() => { setTableMembers([me]); setStep('qr') }} onJoin={() => setStep('join')} onRescan={rescan} />
  if (step === 'join') return <JoinScreen />
  if (step === 'qr') return <HostQRScreen member={member} tableMembers={tableMembers} venue={venue} onStart={() => { setActiveMember(me.id); setStep('menu') }} />
  if (step === 'menu') return (
    <MenuScreen
      tableMembers={tableMembers} cart={cart}
      activeMember={activeMember} setActiveMember={setActiveMember}
      activeCategory={activeCategory} setActiveCategory={setActiveCategory}
      addToCart={addToCart} removeFromCart={removeFromCart}
      getTotalItems={getTotalItems} onViewCart={() => setStep('cart')}
      onBack={() => setStep('table')} venue={venue}
    />
  )
  if (step === 'cart') return (
    <CartReviewScreen
      tableMembers={tableMembers} cart={cart}
      onBack={() => setStep('menu')} onPlace={() => { setOrderStatus('preparing'); setStep('placed') }}
    />
  )
  if (step === 'placed') return <OrderPlacedScreen status={orderStatus} venue={venue} />

  return null
}
