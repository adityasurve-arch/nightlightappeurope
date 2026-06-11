// Simulated Nightlight member registry
// In production these would come from a real member API

export const NETWORK_MEMBERS = [
  { id: 'NM001', firstName: 'Sofia',   lastName: 'Reyes',     city: 'Paris', tier: 'Silver', memberId: 'NL-2201-4490' },
  { id: 'NM002', firstName: 'Luca',    lastName: 'Ferrari',   city: 'Paris',     tier: 'Bronze', memberId: 'NL-3310-8821' },
  { id: 'NM003', firstName: 'Camille', lastName: 'Moreau',    city: 'Paris',     tier: 'Gold',   memberId: 'NL-1102-5567' },
  { id: 'NM004', firstName: 'Felix',   lastName: 'Gruber',    city: 'Paris',    tier: 'Silver', memberId: 'NL-4409-2231' },
  { id: 'NM005', firstName: 'Inês',    lastName: 'Carvalho',  city: 'Paris',    tier: 'Bronze', memberId: 'NL-5503-9912' },
  { id: 'NM006', firstName: 'Rafael',  lastName: 'Domínguez', city: 'Paris', tier: 'Bronze', memberId: 'NL-2289-1104' },
  { id: 'NM007', firstName: 'Marco',   lastName: 'Ricci',     city: 'Paris',     tier: 'Silver', memberId: 'NL-3341-6673' },
  { id: 'NM008', firstName: 'Théo',    lastName: 'Laurent',   city: 'Paris',     tier: 'Bronze', memberId: 'NL-1178-3345' },
  { id: 'NM009', firstName: 'Anna',    lastName: 'Hofmann',   city: 'Paris',    tier: 'Gold',   memberId: 'NL-4412-7780' },
  { id: 'NM010', firstName: 'Miguel',  lastName: 'Santos',    city: 'Paris',    tier: 'Silver', memberId: 'NL-5534-4421' },
  { id: 'NM011', firstName: 'Elena',   lastName: 'Conti',     city: 'Paris',     tier: 'Bronze', memberId: 'NL-3367-0098' },
  { id: 'NM012', firstName: 'Giulia',  lastName: 'Martini',   city: 'Paris',     tier: 'Silver', memberId: 'NL-3398-2256' },
  { id: 'NM013', firstName: 'Priya',   lastName: 'Mehta',     city: 'Paris', tier: 'Bronze', memberId: 'NL-2244-5539' },
]

export const TIER_COLORS = {
  Bronze: '#C4843A',
  Silver: '#8C9FD4',
  Gold:   '#C4A93A',
}

export function findMembers(query) {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return NETWORK_MEMBERS.filter(m =>
    m.firstName.toLowerCase().includes(q) ||
    m.lastName.toLowerCase().includes(q) ||
    m.memberId.toLowerCase().includes(q)
  )
}
