import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '💳',
    title: 'Digital Membership Card',
    desc: 'Your personal card tied to your city, tier, and identity — always in your pocket.',
  },
  {
    icon: '⭐',
    title: 'Rewards & Points',
    desc: 'Earn points every visit, unlock Bronze → Silver → Gold perks, get complimentary drinks.',
  },
  {
    icon: '📍',
    title: 'Partner Venues',
    desc: 'Exclusive access to curated bars across Paris, Milan, Barcelona, Vienna and Lisbon.',
  },
]

const STATS = [
  { value: '25K', label: 'Members' },
  { value: '5', label: 'Cities' },
  { value: '15', label: 'Venues' },
]

export default function Landing() {
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
            <span className="text-white text-xs font-bold">PR</span>
          </div>
          <span style={{ color: 'var(--text)' }} className="font-semibold text-sm">Pernod Network</span>
        </div>
        <Link
          to="/signup"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col px-5 pt-6">
        {/* Live badge */}
        <div
          className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
          style={{ backgroundColor: 'rgba(83,74,183,0.15)', color: '#9B93E8', border: '1px solid rgba(83,74,183,0.25)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Now live across 5 European cities
        </div>

        {/* Headline */}
        <h1 style={{ color: 'var(--text)' }} className="text-3xl font-bold leading-snug mb-3">
          Drink smarter.<br />
          <span style={{ color: 'var(--accent)' }}>Belong to the&nbsp;network.</span>
        </h1>

        <p style={{ color: 'var(--muted)' }} className="text-sm leading-relaxed mb-8">
          Join 25,000 members across Paris, Milan, Barcelona, Vienna and Lisbon. Get your digital membership card, earn rewards, and unlock exclusive access.
        </p>

        {/* Primary CTA */}
        <Link
          to="/signup"
          className="w-full py-4 rounded-2xl font-semibold text-sm text-center transition-all active:scale-95 mb-3"
          style={{ backgroundColor: 'var(--accent)', color: 'white' }}
        >
          Get your free membership card →
        </Link>

        {/* Secondary CTA */}
        <Link
          to="/venues"
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-center transition-colors mb-8"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          Browse venues
        </Link>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 rounded-2xl overflow-hidden mb-8"
          style={{ border: '1px solid var(--border)' }}
        >
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-4"
              style={{
                backgroundColor: 'var(--surface)',
                borderRight: i < 2 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ color: 'var(--text)' }} className="text-xl font-bold">{value}</div>
              <div style={{ color: 'var(--muted)' }} className="text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="flex flex-col gap-3 mb-8">
          {FEATURES.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-4 flex items-start gap-4"
              style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
              <div>
                <div style={{ color: 'var(--text)' }} className="font-semibold text-sm mb-1">{title}</div>
                <div style={{ color: 'var(--muted)' }} className="text-xs leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-5 py-5 text-center" style={{ borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--muted)', fontSize: '11px' }} className="opacity-60">
          Pernod Ricard Consumer Network · Drink responsibly
        </p>
      </footer>
    </div>
  )
}
