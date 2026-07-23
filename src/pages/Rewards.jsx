import { getMember } from '../lib/member'
import { TIERS, getTier, getNextTier, progressToNextTier } from '../data/rewards'
import TierBadge from '../components/TierBadge'
import ProgressBar from '../components/ProgressBar'
import { useLang } from '../lib/i18n'

const LOCKED_REWARDS = [
  { icon: '🍸', labelKey: 'rewards.r1', pts: 200 },
  { icon: '🎟', labelKey: 'rewards.r2', pts: 400 },
  { icon: '🎁', labelKey: 'rewards.r3', pts: 750 },
]

export default function Rewards() {
  const member = getMember()
  const tier = getTier(member.points)
  const nextTier = getNextTier(member.points)
  const progress = progressToNextTier(member.points)
  const { t } = useLang()

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen">
      <div className="px-4 pt-8 pb-8 flex flex-col gap-6">
        <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">{t('rewards.title')}</h1>

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
              <div style={{ color: 'var(--muted)' }} className="text-xs mb-1">{t('rewards.currentTier')}</div>
              <TierBadge tier={tier} size="lg" />
            </div>
            <div className="text-right">
              <div style={{ color: 'var(--muted)' }} className="text-xs mb-0.5">{t('rewards.balance')}</div>
              <div style={{ color: 'var(--text)' }} className="text-3xl font-bold">{member.points}</div>
            </div>
          </div>

          {nextTier ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs" style={{ color: 'var(--muted)' }}>
                <span>{t('rewards.progressTo')} {nextTier.icon} {nextTier.name}</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar percent={progress} color={tier.color} />
              <p style={{ color: 'var(--muted)' }} className="text-xs">
                {nextTier.min - member.points} {t('rewards.morePtsTo')} {nextTier.name}
              </p>
            </div>
          ) : (
            <p style={{ color: tier.color }} className="text-sm font-medium">
              {t('rewards.highest')}
            </p>
          )}
        </div>

        {/* How to earn points */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">{t('rewards.howEarn')}</h2>
          <div className="flex flex-col gap-2">
            {[
              { icon: '🏛', action: t('rewards.visitVenue'), pts: '+10 pts' },
              { icon: '🍹', action: t('rewards.orderDrink'), pts: '+5 pts' },
              { icon: '👥', action: t('rewards.refer'), pts: '+25 pts' },
              { icon: '🎂', action: t('rewards.birthday'), pts: '+50 pts' },
            ].map(({ icon, action, pts }) => (
              <div key={action} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{icon}</span>
                  <span style={{ color: 'var(--muted)' }} className="text-sm">{action}</span>
                </div>
                <span style={{ color: '#DBA84E' }} className="text-xs font-semibold">{pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier perks */}
        <div>
          <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">{t('rewards.allPerks')}</h2>
          <div className="flex flex-col gap-3">
            {TIERS.map(tr => (
              <div
                key={tr.name}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid ${tr.name === tier.name ? tr.color + '55' : 'var(--border)'}`,
                  opacity: tr.min > member.points ? 0.5 : 1,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <TierBadge tier={tr} size="md" />
                  {tr.name === tier.name && (
                    <span style={{ color: 'var(--accent)', backgroundColor: 'rgba(200,146,42,0.15)' }} className="text-xs px-2 py-0.5 rounded-full">
                      {t('rewards.current')}
                    </span>
                  )}
                  {tr.min > member.points && (
                    <span style={{ color: 'var(--muted)' }} className="text-xs">
                      🔒 {tr.min} {t('rewards.ptsRequired')}
                    </span>
                  )}
                </div>
                <ul className="flex flex-col gap-1.5">
                  {tr.perks.map(perk => (
                    <li key={perk} className="flex items-start gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                      <span style={{ color: tr.color }} className="mt-0.5">✓</span>
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
          <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold mb-3">{t('rewards.redeem')}</h2>
          <div className="flex flex-col gap-2">
            {LOCKED_REWARDS.map(({ icon, labelKey, pts }) => (
              <div
                key={labelKey}
                className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  opacity: member.points < pts ? 0.4 : 1,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span style={{ color: 'var(--text)' }} className="text-sm">{t(labelKey)}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div style={{ color: '#DBA84E' }} className="text-xs font-semibold">{pts} pts</div>
                  {member.points < pts ? (
                    <div style={{ color: 'var(--muted)' }} className="text-xs">{pts - member.points} {t('rewards.away')} 🔒</div>
                  ) : (
                    <div style={{ color: 'var(--success)' }} className="text-xs font-semibold">{t('rewards.unlocked')}</div>
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
