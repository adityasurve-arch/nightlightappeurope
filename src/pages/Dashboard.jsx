import { useState } from 'react'
import { Link } from 'react-router-dom'
import MemberCard from '../components/MemberCard'
import TierBadge from '../components/TierBadge'
import ProgressBar from '../components/ProgressBar'
import { getMember } from '../lib/member'
import { getTier, getNextTier, progressToNextTier } from '../data/rewards'
import { useLang } from '../lib/i18n'
import { EVENTS } from '../data/events'

const QUICK_LINKS = [
  { to: '/rewards', icon: '⭐', labelKey: 'dash.rewards', descKey: 'dash.rewardsDesc' },
  { to: '/venues', icon: '📍', labelKey: 'dash.venues', descKey: 'dash.venuesDesc' },
  { to: '/history', icon: '🕐', labelKey: 'dash.history', descKey: 'dash.historyDesc' },
]

export default function Dashboard() {
  const member = getMember()
  const tier = getTier(member.points)
  const nextTier = getNextTier(member.points)
  const progress = progressToNextTier(member.points)
  const [walletModal, setWalletModal] = useState(false)
  const { t, lang } = useLang()

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="px-4 pt-8 pb-8 flex flex-col gap-6">
        {/* Greeting */}
        <div>
          <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">
            {t('dash.welcome')}, {member.firstName} 👋
          </h1>
          <p style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">
            {member.city} · {t('dash.memberSince')}{' '}
            {new Date(member.signupDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Member Card */}
        <MemberCard member={member} />

        {/* Primary action — the revenue feature gets the hero spot */}
        <Link
          to="/order"
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base nl-press nl-glow"
          style={{ backgroundColor: 'var(--accent)', color: 'white', textDecoration: 'none' }}
        >
          <span className="text-xl">🍸</span>
          {t('dash.orderTable')}
        </Link>

        {/* Apple Wallet button */}
        <button
          onClick={() => setWalletModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: '#000', border: '1px solid #333' }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="text-white text-sm font-semibold">Add to Apple Wallet</span>
        </button>

        {/* Apple Wallet modal */}
        {walletModal && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setWalletModal(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: 'var(--text)' }} className="font-semibold text-sm">Apple Wallet</div>
                  <div style={{ color: 'var(--muted)' }} className="text-xs">Quarter Card</div>
                </div>
              </div>

              <div style={{ color: 'var(--muted)' }} className="text-sm leading-relaxed">
                Your membership card can be added as a{' '}
                <span style={{ color: 'var(--text)' }} className="font-medium">.pkpass</span> to Apple Wallet — tap it at any partner venue for instant check-in.
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { icon: '👤', label: member.firstName + ' ' + member.lastName },
                  { icon: '🪪', label: member.memberId },
                  { icon: '📍', label: member.city + ' · ' + tier.icon + ' ' + tier.name },
                  { icon: '✓', label: member.verified ? 'Identity verified' : 'Identity not yet verified' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                    <span>{icon}</span><span>{label}</span>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                style={{ backgroundColor: 'rgba(200,146,42,0.1)', border: '1px solid rgba(200,146,42,0.2)', color: '#DBA84E' }}
              >
                ℹ Generating the pass requires an Apple Developer certificate and a backend signing service. This will be live when the iOS app launches.
              </div>

              <button
                onClick={() => setWalletModal(false)}
                className="w-full py-2.5 rounded-xl text-sm font-medium"
                style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Verification nudge */}
        {!member.verified && (
          <Link
            to="/signup"
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors"
            style={{ backgroundColor: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}
          >
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <div style={{ color: '#fbbf24' }} className="text-sm font-medium">Identity not verified</div>
              <div style={{ color: 'var(--muted)' }} className="text-xs">Verify your ID to unlock venue check-in</div>
            </div>
            <span style={{ color: '#fbbf24' }} className="text-xs">→</span>
          </Link>
        )}

        {/* Points summary */}
        <div
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div style={{ color: 'var(--muted)' }} className="text-xs mb-0.5">{t('dash.yourPoints')}</div>
              <div style={{ color: 'var(--text)' }} className="text-2xl font-bold">{member.points}</div>
            </div>
            <TierBadge tier={tier} size="md" />
          </div>

          {nextTier ? (
            <>
              <ProgressBar percent={progress} color={tier.color} />
              <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
                <span>{tier.name}</span>
                <span>{nextTier.min - member.points} {t('dash.ptsTo')} {nextTier.icon} {nextTier.name}</span>
              </div>
              {/* Visits-away framing — only motivating when the target is close */}
              {(() => {
                const nights = Math.max(1, Math.ceil((nextTier.min - member.points) / 25))
                return nights <= 8 ? (
                  <div
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-light)' }}
                  >
                    ⚡ {t('dash.nightsAway1')} {nights} {nights === 1 ? t('dash.night') : t('dash.nights')} {t('dash.nightsAway2')} {nextTier.name} {t('dash.soClose')}
                  </div>
                ) : (
                  <div
                    className="rounded-lg px-3 py-2 text-xs font-medium"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-light)' }}
                  >
                    ⚡ {t('dash.groupTip')}
                  </div>
                )
              })()}
            </>
          ) : (
            <div className="nl-shimmer-text text-xs font-semibold">
              {t('dash.goldTier')}
            </div>
          )}
        </div>

        {/* Crew activity — social FOMO loop */}
        <Link
          to="/profile?section=crew"
          className="rounded-xl p-4 flex items-center gap-3 nl-press"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', textDecoration: 'none' }}
        >
          <div className="flex -space-x-2 flex-shrink-0">
            {[
              { initials: 'SR', color: 'var(--tier-gold)' },
              { initials: 'LB', color: 'var(--tier-silver)' },
              { initials: 'EM', color: 'var(--tier-bronze)' },
            ].map(({ initials, color }) => (
              <div
                key={initials}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: 'var(--surface2)', border: `1.5px solid ${color}`, color: 'var(--text)' }}
              >
                {initials}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <div style={{ color: 'var(--text)' }} className="text-sm font-semibold">{t('dash.crewOut')}</div>
            <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5">
              {t('dash.crewEarned')} <span style={{ color: 'var(--accent-light)' }} className="font-semibold">150 pts</span> {t('dash.together')}
            </div>
          </div>
          <span style={{ color: 'var(--muted)' }}>→</span>
        </Link>

        {/* Event invite card */}
        {EVENTS.length > 0 && (() => {
          const ev = EVENTS[0]
          const evDate = new Date(ev.date)
          return (
            <Link
              to={`/events/${ev.id}`}
              className="block rounded-2xl overflow-hidden nl-press"
              style={{ textDecoration: 'none', border: '1px solid rgba(200,162,75,0.3)' }}
            >
              {/* Thin amber top bar */}
              <div style={{ height: 3, backgroundColor: '#C8A24B' }} />
              <div className="relative">
                <img
                  src={ev.heroImage}
                  alt={ev.eventName}
                  className="w-full object-cover"
                  style={{ height: 100 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, rgba(14,14,16,0.85) 40%, rgba(14,14,16,0.3) 100%)' }}
                />
                <div className="absolute inset-0 flex items-center px-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(200,162,75,0.2)', color: '#C8A24B', border: '1px solid rgba(200,162,75,0.3)' }}
                      >
                        You're invited
                      </span>
                    </div>
                    <div style={{ color: 'white' }} className="text-sm font-bold leading-tight truncate">
                      {ev.eventName}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.65)' }} className="text-xs mt-0.5">
                      {evDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {ev.time} · {ev.venue}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: 'rgba(200,162,75,0.2)', border: '1px solid rgba(200,162,75,0.3)' }}
                    >
                      🥃
                    </div>
                    <span style={{ color: '#C8A24B', fontSize: '10px' }} className="font-semibold">{ev.spotsLeft} left</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        })()}

        {/* Quick links */}
        <div>
          <h2 style={{ color: 'var(--muted)' }} className="text-xs font-semibold tracking-widest uppercase mb-3">
            {t('dash.quickAccess')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_LINKS.map(({ to, icon, labelKey, descKey }) =>
              to ? (
                <Link
                  key={labelKey}
                  to={to}
                  className="rounded-xl p-4 flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5 text-center"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span className="text-2xl">{icon}</span>
                  <span style={{ color: 'var(--text)' }} className="text-xs font-semibold">{t(labelKey)}</span>
                  <span style={{ color: 'var(--muted)' }} className="text-xs">{t(descKey)}</span>
                </Link>
              ) : null
            )}
          </div>
        </div>

        {/* Earning hint */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(200,146,42,0.08)', border: '1px solid rgba(200,146,42,0.2)' }}
        >
          <span className="text-xl">💡</span>
          <p style={{ color: 'var(--muted)' }} className="text-xs leading-relaxed">
            {t('dash.earn')} <span style={{ color: '#DBA84E' }} className="font-semibold">10 pts</span> {t('dash.perVisit')} ·{' '}
            <span style={{ color: '#DBA84E' }} className="font-semibold">5 pts</span> {t('dash.perDrink')}
          </p>
        </div>
      </div>
    </div>
  )
}
