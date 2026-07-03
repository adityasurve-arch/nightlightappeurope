import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { getMember, clearMember, getCompanions } from '../lib/member'
import { useLang } from '../lib/i18n'
import { getTier } from '../data/rewards'
import { SYNTHETIC_VISITS } from '../data/visits'
import { NETWORK_MEMBERS, TIER_COLORS } from '../data/networkMembers'
import TierBadge from '../components/TierBadge'

function buildCrew() {
  const stored = getCompanions()
  // count outings per network member across all visits
  const counts = {}
  SYNTHETIC_VISITS.forEach(visit => {
    const ids = stored[visit.id] ?? visit.defaultCompanions ?? []
    ids.forEach(id => {
      counts[id] = (counts[id] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, outings]) => ({ member: NETWORK_MEMBERS.find(m => m.id === id), outings }))
    .filter(({ member }) => !!member)
}

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const crewRef = useRef(null)
  const member = getMember()
  const tier = getTier(member.points)
  const crew = buildCrew()
  const { lang, setLang, t } = useLang()

  useEffect(() => {
    if (location.search.includes('section=crew') && crewRef.current) {
      setTimeout(() => crewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    }
  }, [location.search])

  function handleSignOut() {
    clearMember()
    navigate('/')
  }

  const initials = `${member.firstName?.[0] ?? ''}${member.lastName?.[0] ?? ''}`.toUpperCase()

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen pb-28">
      <div className="px-4 pt-8 flex flex-col gap-5">

        {/* Header */}
        <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold">{t('profile.title')}</h1>

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            {initials}
          </div>
          <div className="text-center">
            <div style={{ color: 'var(--text)' }} className="text-lg font-bold">
              {member.firstName} {member.lastName}
            </div>
            <div style={{ color: 'var(--muted)' }} className="text-sm mt-0.5">{member.email}</div>
          </div>
          <TierBadge tier={tier} size="md" />
        </div>

        {/* Member details */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {[
            { label: t('profile.memberId'), value: member.memberId },
            { label: t('profile.city'), value: member.city },
            {
              label: t('profile.memberSince'),
              value: new Date(member.signupDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              }),
            },
            { label: t('profile.points'), value: `${member.points} pts` },
            {
              label: t('profile.identity'),
              value: member.verified ? t('profile.verified') : t('profile.unverified'),
              valueStyle: { color: member.verified ? '#4ade80' : '#fbbf24' },
            },
          ].map(({ label, value, valueStyle }, i, arr) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3.5"
              style={{
                backgroundColor: 'var(--surface)',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ color: 'var(--muted)' }} className="text-sm">{label}</span>
              <span style={{ color: 'var(--text)', ...valueStyle }} className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* My activity — History & Rewards moved here from the bottom nav */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {[
            { icon: '🕐', label: t('profile.visitHistory'), desc: t('profile.visitHistoryDesc'), to: '/history' },
            { icon: '⭐', label: t('profile.rewardsPoints'), desc: t('profile.rewardsPointsDesc'), to: '/rewards' },
          ].map(({ icon, label, desc, to }, i, arr) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left nl-press"
              style={{
                backgroundColor: 'var(--surface)',
                border: 'none',
                cursor: 'pointer',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span className="text-xl flex-shrink-0">{icon}</span>
              <div className="flex-1">
                <div style={{ color: 'var(--text)' }} className="text-sm font-medium">{label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{desc}</div>
              </div>
              <span style={{ color: 'var(--muted)' }}>→</span>
            </button>
          ))}
        </div>

        {/* Language switcher */}
        <div
          className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🌐</span>
            <span style={{ color: 'var(--text)' }} className="text-sm font-medium">{t('profile.language')}</span>
          </div>
          <div className="flex gap-1.5">
            {[
              { code: 'en', label: 'EN' },
              { code: 'fr', label: 'FR' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold nl-press"
                style={{
                  backgroundColor: lang === code ? 'var(--accent)' : 'var(--surface2)',
                  color: lang === code ? 'white' : 'var(--muted)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Your crew */}
        <div ref={crewRef}>
          <div className="flex items-baseline justify-between mb-3">
            <h2 style={{ color: 'var(--text)' }} className="text-sm font-semibold">{t('profile.crew')}</h2>
            <span style={{ color: 'var(--muted)', fontSize: '11px' }}>
              {crew.length} {crew.length !== 1 ? t('profile.networkMembers') : t('profile.networkMember')}
            </span>
          </div>

          {crew.length === 0 ? (
            <div
              className="rounded-2xl px-4 py-6 text-center"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <p style={{ color: 'var(--muted)' }} className="text-sm">
                {t('profile.noCrew')}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {crew.map(({ member: m, outings }, i, arr) => {
                const tierColor = TIER_COLORS[m.tier] || 'var(--muted)'
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ backgroundColor: `${tierColor}22`, color: tierColor }}
                    >
                      {m.firstName[0]}{m.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                        {m.firstName} {m.lastName}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '11px' }}>
                        {m.city} · {m.tier}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div style={{ color: 'var(--text)' }} className="text-sm font-semibold">{outings}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '10px' }}>
                        {outings !== 1 ? t('profile.outings') : t('profile.outing')}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quarter brand dashboard */}
        <button
          onClick={() => navigate('/quarter')}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-2xl nl-press"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }}
        >
          <span
            className="text-xs font-bold flex-shrink-0 rounded-md px-1.5 py-0.5"
            style={{ backgroundColor: '#534AB7', color: 'white' }}
          >
            Q
          </span>
          <div className="flex-1">
            <div style={{ color: 'var(--text)' }} className="text-sm font-medium">Quarter · Brand dashboard</div>
            <div style={{ color: 'var(--muted)', fontSize: '11px' }}>Network insights for partner brands</div>
          </div>
          <span style={{ color: 'var(--muted)' }}>→</span>
        </button>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            disabled
            className="w-full py-3.5 rounded-2xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            {t('profile.edit')}
          </button>

          {!member.verified && (
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
              style={{ backgroundColor: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fbbf24' }}
            >
              {t('profile.verify')}
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-95"
            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
          >
            {t('profile.signOut')}
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="text-center pb-2">
          {t('profile.footer')}
        </p>
      </div>
    </div>
  )
}
