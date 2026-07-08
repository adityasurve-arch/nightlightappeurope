import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getMember, saveMember } from '../lib/member'
import { useLang } from '../lib/i18n'

const DEMO_MEMBER = {
  firstName: 'Aditya',
  lastName: 'Surve',
  email: 'aditya.surve@edu.escp.eu',
  city: 'Paris',
  memberId: 'NL-DEMO-2025',
  points: 545,
  tier: 'Silver',
  verified: true,
  signupDate: '2025-01-15T00:00:00.000Z',
  faceId: false,
}

const FEATURES = [
  { icon: '💳', key: 'feature1' },
  { icon: '⭐', key: 'feature2' },
  { icon: '📍', key: 'feature3' },
]

// First-launch overlay: pick French or English before anything else
function LanguagePicker({ onPick }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 nl-pop"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        <span className="text-white text-lg font-bold">NL</span>
      </div>
      <h1 style={{ color: 'var(--text)' }} className="text-xl font-bold mb-1 text-center">
        Choose your language
      </h1>
      <p style={{ color: 'var(--muted)' }} className="text-sm mb-8 text-center">
        Choisissez votre langue
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onPick('fr')}
          className="w-full py-4 rounded-2xl font-semibold text-base nl-press flex items-center justify-center gap-3"
          style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          🇫🇷 Français
        </button>
        <button
          onClick={() => onPick('en')}
          className="w-full py-4 rounded-2xl font-semibold text-base nl-press flex items-center justify-center gap-3"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', cursor: 'pointer' }}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { t, hasChosen, setLang } = useLang()

  useEffect(() => {
    if (getMember()) navigate('/venues', { replace: true })
  }, [])

  function handleDemo() {
    saveMember(DEMO_MEMBER)
    navigate('/venues', { replace: true })
  }

  if (!hasChosen) return <LanguagePicker onPick={setLang} />

  return (
    <div style={{ backgroundColor: 'var(--bg)' }} className="min-h-screen flex flex-col">
      {/* Status bar spacer */}
      <div className="h-12" />

      {/* Logo bar */}
      <header className="px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            <span className="text-white text-xs font-bold">NL</span>
          </div>
          <span style={{ color: 'var(--text)' }} className="font-semibold text-sm">Quarter</span>
        </div>
        <button
          onClick={handleDemo}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          {t('landing.signin')}
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-5 pt-6">
        {/* Live badge */}
        <div
          className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
          style={{ backgroundColor: 'rgba(200,146,42,0.15)', color: '#DBA84E', border: '1px solid rgba(200,146,42,0.25)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {t('landing.badge')}
        </div>

        {/* Headline */}
        <h1 style={{ color: 'var(--text)' }} className="text-4xl font-extrabold leading-tight mb-3 nl-slide-up">
          {t('landing.headline1')}<br />
          {t('landing.headline2')}<br />
          <span className="nl-shimmer-text">{t('landing.headline3')}</span>
        </h1>

        <p style={{ color: 'var(--muted)' }} className="text-sm leading-relaxed mb-3">
          {t('landing.sub')}
        </p>

        {/* Tier ladder preview */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { name: 'Bronze', color: 'var(--tier-bronze)' },
            { name: 'Silver', color: 'var(--tier-silver)' },
            { name: 'Gold', color: 'var(--tier-gold)' },
          ].map(({ name, color }, i) => (
            <div key={name} className="flex items-center gap-2">
              {i > 0 && <span style={{ color: 'var(--muted)' }} className="text-xs">→</span>}
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ color, border: `1px solid ${i === 2 ? 'var(--tier-gold)' : 'var(--border)'}`, backgroundColor: 'var(--surface)' }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          to="/signup"
          className="w-full py-4 rounded-2xl font-bold text-base text-center nl-press nl-glow mb-3"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          {t('landing.cta')}
        </Link>

        {/* Demo CTA */}
        <button
          onClick={handleDemo}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-center transition-all active:scale-95 mb-3"
          style={{ backgroundColor: 'rgba(200,146,42,0.12)', color: '#DBA84E', border: '1px solid rgba(200,146,42,0.3)' }}
        >
          {t('landing.demo')}
        </button>

        {/* Secondary CTA */}
        <Link
          to="/venues"
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-center transition-colors mb-8"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          {t('landing.browse')}
        </Link>

        {/* Feature cards */}
        <div className="flex flex-col gap-3 mb-8">
          {FEATURES.map(({ icon, key }) => (
            <div
              key={key}
              className="rounded-2xl p-4 flex items-start gap-4"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <div style={{ color: 'var(--text)' }} className="font-semibold text-sm mb-1">{t(`landing.${key}.title`)}</div>
                <div style={{ color: 'var(--muted)' }} className="text-xs leading-relaxed">{t(`landing.${key}.desc`)}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-5 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="opacity-60">
          {t('landing.footer')}
        </p>
      </footer>
    </div>
  )
}
