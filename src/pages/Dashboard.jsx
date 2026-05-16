import { useState } from 'react'
import { Link } from 'react-router-dom'
import MemberCard from '../components/MemberCard'
import TierBadge from '../components/TierBadge'
import ProgressBar from '../components/ProgressBar'
import { getMember } from '../lib/member'
import { getTier, getNextTier, progressToNextTier } from '../data/rewards'

const QUICK_LINKS = [
  { to: '/rewards', icon: '⭐', label: 'Rewards', desc: 'Points & perks' },
  { to: '/venues', icon: '📍', label: 'Venues', desc: 'Find a bar' },
  { to: '/history', icon: '🕐', label: 'History', desc: 'Visit log' },
]

export default function Dashboard() {
  const member = getMember()
  const tier = getTier(member.points)
  const nextTier = getNextTier(member.points)
  const progress = progressToNextTier(member.points)
  const [walletModal, setWalletModal] = useState(false)

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="px-4 pt-8 pb-8 flex flex-col gap-6">
        {/* Greeting */}
        <div>
          <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">
            Welcome back, {member.firstName} 👋
          </h1>
          <p style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">
            {member.city} member since{' '}
            {new Date(member.signupDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Member Card */}
        <MemberCard member={member} />

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
                  <div style={{ color: 'var(--muted)' }} className="text-xs">Pernod Network Card</div>
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
                style={{ backgroundColor: 'rgba(83,74,183,0.1)', border: '1px solid rgba(83,74,183,0.2)', color: '#9B93E8' }}
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
              <div style={{ color: 'var(--muted)' }} className="text-xs mb-0.5">Your points</div>
              <div style={{ color: 'var(--text)' }} className="text-2xl font-bold">{member.points}</div>
            </div>
            <TierBadge tier={tier} size="md" />
          </div>

          {nextTier ? (
            <>
              <ProgressBar percent={progress} color={tier.color} />
              <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
                <span>{tier.name}</span>
                <span>{nextTier.min - member.points} pts to {nextTier.icon} {nextTier.name}</span>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--muted)' }} className="text-xs">
              You're at the highest tier. Enjoy your Gold benefits! 🎉
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h2 style={{ color: 'var(--muted)' }} className="text-xs font-semibold tracking-widest uppercase mb-3">
            Quick access
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_LINKS.map(({ to, icon, label, desc }) =>
              to ? (
                <Link
                  key={label}
                  to={to}
                  className="rounded-xl p-4 flex flex-col gap-1.5 transition-transform hover:-translate-y-0.5 text-center"
                  style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <span className="text-2xl">{icon}</span>
                  <span style={{ color: 'var(--text)' }} className="text-xs font-semibold">{label}</span>
                  <span style={{ color: 'var(--muted)' }} className="text-xs">{desc}</span>
                </Link>
              ) : null
            )}
          </div>
        </div>

        {/* Earning hint */}
        <div
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.2)' }}
        >
          <span className="text-xl">💡</span>
          <p style={{ color: 'var(--muted)' }} className="text-xs leading-relaxed">
            Earn <span style={{ color: '#9B93E8' }} className="font-semibold">10 pts</span> per venue visit ·{' '}
            <span style={{ color: '#9B93E8' }} className="font-semibold">5 pts</span> per drink ordered
          </p>
        </div>
      </div>
    </div>
  )
}
