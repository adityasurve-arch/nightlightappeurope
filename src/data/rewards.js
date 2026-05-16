export const TIERS = [
  {
    name: 'Bronze',
    min: 0,
    max: 499,
    color: '#CD7F32',
    bgClass: 'bg-amber-800',
    icon: '🥉',
    perks: [
      'Early access to member events',
      'Weekly venue deals via email',
      'Digital membership card',
      'Welcome gift at first visit',
    ],
  },
  {
    name: 'Silver',
    min: 500,
    max: 1499,
    color: '#C0C0C0',
    bgClass: 'bg-slate-400',
    icon: '🥈',
    perks: [
      'All Bronze perks',
      'One complimentary drink per month',
      'Priority entry at partner venues',
      'Exclusive Silver member mixers',
      'Birthday discount (20% off your visit)',
    ],
  },
  {
    name: 'Gold',
    min: 1500,
    max: Infinity,
    color: '#FFD700',
    bgClass: 'bg-yellow-400',
    icon: '🥇',
    perks: [
      'All Silver perks',
      'VIP queue bypass at all venues',
      'Two complimentary drinks per month',
      'Invite to exclusive brand tastings',
      'Personalised brand recommendations',
      'Annual Gold member gala invite',
    ],
  },
]

export const WELCOME_BONUS = 50

export function getTier(points) {
  return TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0]
}

export function getNextTier(points) {
  const idx = TIERS.findIndex(t => points >= t.min && points <= t.max)
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

export function progressToNextTier(points) {
  const current = getTier(points)
  const next = getNextTier(points)
  if (!next) return 100
  const range = next.min - current.min
  const progress = points - current.min
  return Math.min(100, Math.round((progress / range) * 100))
}
