import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEvent } from '../data/events'
import { getMember } from '../lib/member'
import { useLang } from '../lib/i18n'

const AMBER = '#C8A24B'
const AMBER_SOFT = 'rgba(200,162,75,0.12)'
const AMBER_BORDER = 'rgba(200,162,75,0.25)'

function Pill({ children, color = AMBER }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}33` }}
    >
      {children}
    </span>
  )
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base mt-0.5">{icon}</span>
      <div>
        <div style={{ color: 'var(--muted)', fontSize: '11px' }} className="uppercase tracking-widest">{label}</div>
        <div style={{ color: 'var(--text)' }} className="text-sm font-medium mt-0.5">{value}</div>
      </div>
    </div>
  )
}

function ConfirmationScreen({ event, shareConsent, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-6 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ backgroundColor: AMBER_SOFT, border: `1px solid ${AMBER_BORDER}` }}
      >
        🥃
      </div>
      <div>
        <div style={{ color: 'var(--text)' }} className="text-xl font-bold mb-2">You're on the list</div>
        <div style={{ color: 'var(--muted)' }} className="text-sm leading-relaxed">
          Your spot at <span style={{ color: 'var(--text)' }} className="font-medium">{event.eventName}</span> is reserved.
          We'll send a reminder 24 hours before.
        </div>
      </div>

      <div
        className="w-full rounded-2xl p-4 flex flex-col gap-2.5"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {[
          { icon: '📅', label: 'Date', value: new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + event.time },
          { icon: '📍', label: 'Venue', value: event.venue + ', ' + event.address },
          { icon: '👔', label: 'Dress code', value: event.dressCode },
        ].map(row => (
          <DetailRow key={row.label} {...row} />
        ))}
      </div>

      <div
        className="w-full rounded-xl px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: 'rgba(83,74,183,0.1)', border: '1px solid rgba(83,74,183,0.2)' }}
      >
        <span className="text-lg">⭐</span>
        <div style={{ color: '#9B93E8' }} className="text-sm font-medium">
          +{event.pointsForRsvp} pts added to your card
        </div>
      </div>

      {/* GDPR: show clearly what was and wasn't shared */}
      <div
        className="w-full rounded-xl px-4 py-3 flex flex-col gap-1.5 text-left"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div style={{ color: 'var(--muted)', fontSize: '11px' }} className="uppercase tracking-widest mb-1">Data shared with {event.brandName}</div>
        {shareConsent
          ? <div style={{ color: 'var(--text)' }} className="text-xs">✓ Your name — for the physical guest list at the door</div>
          : <div style={{ color: 'var(--muted)' }} className="text-xs">Nothing — {event.brandName} only sees aggregate RSVP numbers</div>
        }
        <div style={{ color: 'var(--muted)' }} className="text-xs">Your contact details, drink preferences, and member ID are never shared.</div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        Back to card
      </button>
    </div>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const event = getEvent(id)
  const member = getMember()

  const [shareConsent, setShareConsent] = useState(false)   // GDPR: unchecked by default
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div style={{ color: 'var(--muted)' }}>Event not found.</div>
        <button onClick={() => navigate('/dashboard')} style={{ color: 'var(--accent)' }} className="text-sm">← Back</button>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const spotsPercent = Math.round(((event.spotsTotal - event.spotsLeft) / event.spotsTotal) * 100)

  function handleRsvp() {
    setRsvpDone(true)
  }

  if (rsvpDone) {
    return (
      <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
        <div className="px-4 pt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm mb-4"
            style={{ color: 'var(--muted)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </button>
        </div>
        <ConfirmationScreen event={event} shareConsent={shareConsent} onClose={() => navigate('/dashboard')} />
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen pb-10">

      {/* Hero image */}
      <div className="relative w-full" style={{ height: 240 }}>
        <img
          src={event.heroImage}
          alt={event.eventName}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(14,14,16,0.3) 0%, rgba(14,14,16,0.85) 100%)' }}
        />
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(14,14,16,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Sponsored tag */}
        <div className="absolute top-4 right-4">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(14,14,16,0.7)', color: 'var(--muted)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}
          >
            Sponsored event
          </span>
        </div>

        {/* Brand + title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div style={{ color: AMBER }} className="text-xs font-semibold tracking-widest uppercase mb-1">
            {event.brandName}
          </div>
          <h1 style={{ color: 'white' }} className="text-lg font-bold leading-tight">{event.eventName}</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mt-0.5">{event.tagline}</p>
        </div>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">

        {/* Spots remaining bar */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--surface)', border: `1px solid ${AMBER_BORDER}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: AMBER }} className="text-sm font-semibold">
              {event.spotsLeft} spots remaining
            </span>
            <span style={{ color: 'var(--muted)' }} className="text-xs">
              {event.spotsTotal - event.spotsLeft} / {event.spotsTotal} reserved
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: 'var(--border)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${spotsPercent}%`, backgroundColor: AMBER }}
            />
          </div>
        </div>

        {/* Event details */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <DetailRow
            icon="📅"
            label="Date & time"
            value={eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + event.time}
          />
          <DetailRow icon="📍" label="Venue" value={`${event.venue} · ${event.address}`} />
          <DetailRow icon="👔" label="Dress code" value={event.dressCode} />
          <DetailRow icon="🥃" label="Category" value={event.category} />
        </div>

        {/* About the event */}
        <div>
          <div style={{ color: 'var(--muted)', fontSize: '11px' }} className="uppercase tracking-widest mb-2">About this event</div>
          <p style={{ color: 'var(--text)' }} className="text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Why you're invited — transparent targeting disclosure */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: AMBER_SOFT, border: `1px solid ${AMBER_BORDER}` }}
        >
          <div style={{ color: AMBER }} className="text-xs font-semibold uppercase tracking-widest mb-2">
            Why you're invited
          </div>
          <p style={{ color: 'var(--text)' }} className="text-sm leading-relaxed">{event.whyInvited}</p>
          <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="mt-2">
            Nightlight matched your drink preferences to this event. No personal data was shared with {event.brandName} to send this invite.
          </p>
        </div>

        {/* Points reward */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(83,74,183,0.1)', border: '1px solid rgba(83,74,183,0.2)' }}
        >
          <span className="text-lg">⭐</span>
          <p style={{ color: '#9B93E8' }} className="text-sm font-medium">
            Earn +{event.pointsForRsvp} pts just for RSVPing
          </p>
        </div>

        {/* ── GDPR consent section ── */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div style={{ color: 'var(--muted)', fontSize: '11px' }} className="uppercase tracking-widest">
            Your privacy choices
          </div>

          {/* Consent 1: share name with brand — UNCHECKED by default */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={shareConsent}
                onChange={e => setShareConsent(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: AMBER }}
              />
            </div>
            <div>
              <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                Share my first name with {event.brandName}
              </div>
              <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5 leading-relaxed">
                Optional. Used only for the physical guest list at the door. {event.brandName} will not receive your contact details, member ID, or drink history.
              </div>
            </div>
          </label>

          {/* Consent 2: future event invitations — UNCHECKED by default */}
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={e => setMarketingConsent(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>
            <div>
              <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                Invite me to future events like this
              </div>
              <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5 leading-relaxed">
                Optional. Nightlight will match your preferences to curated events. You can turn this off anytime in Profile → Preferences.
              </div>
            </div>
          </label>

          {/* Core consent disclaimer — always shown */}
          <div
            className="rounded-xl px-3 py-2.5 text-xs leading-relaxed"
            style={{ backgroundColor: 'rgba(136,136,160,0.08)', color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            By tapping RSVP, you agree to receive event reminders from Nightlight about this event only. Your personal data is processed under Nightlight's{' '}
            <span style={{ color: 'var(--accent)' }} className="underline cursor-pointer">Privacy Policy</span>
            {' '}(Art. 6(1)(b) GDPR — performance of a contract). Withdrawal of consent doesn't affect your RSVP status.
          </div>
        </div>

        {/* RSVP button */}
        <button
          onClick={handleRsvp}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
          style={{ backgroundColor: AMBER, color: '#0E0E10' }}
        >
          Reserve my spot — {event.time} · {eventDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </button>

        <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="text-center">
          Free to attend. No payment required. Cancellations accepted up to 48 hrs before the event.
        </p>
      </div>
    </div>
  )
}
