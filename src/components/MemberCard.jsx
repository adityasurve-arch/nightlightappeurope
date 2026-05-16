import { getTier } from '../data/rewards'

const CITY_COLORS = {
  Paris: '#B08C5A',
  Milan: '#5A8CB0',
  Barcelona: '#B05A5A',
  Vienna: '#5AB08C',
  Lisbon: '#8C5AB0',
}

export default function MemberCard({ member }) {
  const tier = getTier(member.points || 0)
  const cityColor = CITY_COLORS[member.city] || '#534AB7'

  return (
    <div
      className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden select-none"
      style={{
        background: `linear-gradient(135deg, #1A1A2E 0%, #16213E 40%, ${cityColor}33 100%)`,
        border: '1px solid rgba(255,255,255,0.08)',
        aspectRatio: '1.586 / 1',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}
    >
      {/* Glow blob */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: cityColor }}
      />

      {/* Header row */}
      <div className="absolute top-4 left-5 right-5 flex items-start justify-between">
        <div>
          <div className="text-white font-bold text-sm tracking-wider opacity-90">PERNOD</div>
          <div className="text-white text-xs opacity-50 tracking-widest">NETWORK</div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: tier.color, backgroundColor: `${tier.color}22`, border: `1px solid ${tier.color}55` }}
        >
          {tier.icon} {tier.name}
        </span>
      </div>

      {/* QR placeholder */}
      <div className="absolute bottom-4 right-5">
        <div
          className="w-12 h-12 rounded-md flex items-center justify-center opacity-60"
          style={{ border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <svg viewBox="0 0 20 20" className="w-8 h-8 opacity-50" fill="white">
            <rect x="1" y="1" width="7" height="7" rx="1" />
            <rect x="12" y="1" width="7" height="7" rx="1" />
            <rect x="1" y="12" width="7" height="7" rx="1" />
            <rect x="3" y="3" width="3" height="3" fill="#0E0E10" />
            <rect x="14" y="3" width="3" height="3" fill="#0E0E10" />
            <rect x="3" y="14" width="3" height="3" fill="#0E0E10" />
            <rect x="12" y="12" width="2" height="2" />
            <rect x="15" y="12" width="2" height="2" />
            <rect x="12" y="15" width="2" height="2" />
            <rect x="15" y="15" width="2" height="2" />
          </svg>
        </div>
      </div>

      {/* Member info */}
      <div className="absolute bottom-4 left-5">
        <div className="text-white text-base font-semibold leading-tight">
          {member.firstName} {member.lastName}
        </div>
        <div className="text-white text-xs opacity-50 mt-0.5 font-mono tracking-widest">
          {member.memberId}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${cityColor}44`, color: 'rgba(255,255,255,0.8)', border: `1px solid ${cityColor}66` }}
          >
            {member.city}
          </span>
          {member.verified ? (
            <span
              className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.4)' }}
            >
              ✓ Verified
            </span>
          ) : (
            <span
              className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.3)' }}
            >
              ⚠ Unverified
            </span>
          )}
          <span className="text-xs opacity-40 text-white">
            Since {new Date(member.signupDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
  )
}
