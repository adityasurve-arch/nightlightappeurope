export const EVENTS = [
  {
    id: 'EVT001',
    brandName: 'The Malt Society',
    eventName: 'Cask No. 7 — Single Malt Discovery Evening',
    tagline: 'An intimate first-look. 40 seats only.',
    date: '2025-07-03',
    time: '20:00',
    venue: 'Le Cercle',
    address: '8 Rue du Faubourg Saint-Honoré, Paris 8e',
    dressCode: 'Smart casual',
    spotsTotal: 40,
    spotsLeft: 12,
    pointsForRsvp: 25,
    heroImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80',
    logoImage: 'https://images.unsplash.com/photo-1527767616-3ba1b1d0b42e?w=120&q=80',
    category: 'Whisky',
    targetTiers: ['Silver', 'Gold'],
    targetAgeGroups: ['25-34', '35-44'],
    description:
      'The Malt Society invites you to an exclusive first-look at Cask No. 7 — a limited single malt aged 12 years in French oak barrels. Three expressions poured blind, one evening, paired with light bites from the Le Cercle kitchen. Forty guests. No press.',
    whyInvited:
      'You were selected because your Nightlight activity shows a preference for premium whisky. This event was built for members who match that profile.',
  },
]

export function getEvent(id) {
  return EVENTS.find(e => e.id === id) ?? null
}
