import { getMember } from '../lib/member'
import { TIERS, getTier, getNextTier, progressToNextTier } from '../data/rewards'
import TierBadge from '../components/TierBadge'
import ProgressBar from '../components/ProgressBar'

const LOCKED_REWARDS = [
  { icon: '🍸', label: 'Free cocktail of the month', pts: 200 },
  { icon: '🎟', label: 'Exclusive tasting event access', pts: 400 },
  { icon: '🎁', label: 'Branded merchandise bundle', pts: 750 },
]

export default function Rewards() {
  const member = getMember()
  const tier = getTier(member.points)
  const nextTier = getNextTier(member.points)
  const progress = progressToNextTier(member.points)

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="px-4 pt-8 pb-8 flex flex-col gap-6">
        <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">Rewards</h1>

        {/* Current tier banner */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: `linear-gradient(135deg, var(--surface) 0%, ${tier.color}15 100%)`,
            border: `1px solid ${tier.color}44`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div style={{ color: 'var(--muted)' }} className="text-xs mb-1">Current tier</div>
              <TierBadge tier={tier} size="lg" />
            </div>
            <div className="text-right">
              <div style={{ color: 'var(--muted)' }} className="text-xs mb-0.5">Points balance</div>
              <div style={{ color: 'var(--text)' }} className="text-3xl font-bold">{member.points}</div>
            </div>
          </div>

          {nextTier ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
                <span>Progress to {nextTier.icon} {nextTier.name}</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar percent={progress} color={tier.color} />
              <p style={{ color: 'var(--muted)' }} className="text-xs">
                {nextTier.min - member.points} more points to unlock {nextTier.name}
              </p>
            </div>
          ) : (
            <p style={{ color: tier.color }} className="text-sm font-medium">
              You've reached the highest tier. Congratulations! 🎉
            </p>
          )}
        </div>

        {/* How to earn points */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">How to earn points</h2>
          <div className="flex flex-col gap-2">
            {[
              { icon: '🏛', action: 'Visit a partner venue', pts: '+10 pts' },
              { icon: '🍹', action: 'Order a drink', pts: '+5 pts' },
              { icon: '👥', action: 'Refer a friend', pts: '+25 pts' },
              { icon: '🎂', action: 'Birthday bonus', pts: '+50 pts' },
            ].map(({ icon, action, pts }) => (
              <div key={action} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span style={{ color: 'var(--muted)' }} className="text-sm">{action}</span>
                </div>
                <span style={{ color: '#9B93E8' }} className="text-xs font-semibold">{pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier perks */}
        <div>
          <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">All tier perks</h2>
          <div className="flex flex-col gap-3">
            {TIERS.map(t => (
              <div
                key={t.name}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${t.name === tier.name ? t.color + '55' : 'var(--border)'}`,
                  opacity: t.min > member.points ? 0.5 : 1,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <TierBadge tier={t} size="md" />
                  {t.name === tier.name && (
                    <span style={{ color: 'var(--accent)', backgroundColor: 'rgba(83,74,183,0.15)' }} className="text-xs px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                  {t.min > member.points && (
                    <span style={{ color: 'var(--muted)' }} className="text-xs">
                      🔒 {t.min} pts required
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-1.5">
                  {t.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                      <span style={{ color: t.color }} className="mt-0.5">✓</span>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Locked rewards */}
        <div>
          <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">Redeem points</h2>
          <div className="flex flex-col gap-2">
            {LOCKED_REWARDS.map(({ icon, label, pts }) => (
              <div
                key={label}
                className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  opacity: member.points < pts ? 0.4 : 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span style={{ color: 'var(--text)' }} className="text-sm">{label}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div style={{ color: '#9B93E8' }} className="text-xs font-semibold">{pts} pts</div>
                  {member.points < pts && (
                    <div style={{ color: 'var(--muted)' }} className="text-xs">🔒</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
