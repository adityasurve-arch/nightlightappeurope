// Simulated Pernod Network member registry
// In production these would come from a real member API

export const NETWORK_MEMBERS = [
  { id: 'NM001', firstName: 'Sofia',   lastName: 'Reyes',     city: 'Barcelona', tier: 'Silver', memberId: 'PRD-2201-4490' },
  { id: 'NM002', firstName: 'Luca',    lastName: 'Ferrari',   city: 'Milan',     tier: 'Bronze', memberId: 'PRD-3310-8821' },
  { id: 'NM003', firstName: 'Camille', lastName: 'Moreau',    city: 'Paris',     tier: 'Gold',   memberId: 'PRD-1102-5567' },
  { id: 'NM004', firstName: 'Felix',   lastName: 'Gruber',    city: 'Vienna',    tier: 'Silver', memberId: 'PRD-4409-2231' },
  { id: 'NM005', firstName: 'Inês',    lastName: 'Carvalho',  city: 'Lisbon',    tier: 'Bronze', memberId: 'PRD-5503-9912' },
  { id: 'NM006', firstName: 'Rafael',  lastName: 'Domínguez', city: 'Barcelona', tier: 'Bronze', memberId: 'PRD-2289-1104' },
  { id: 'NM007', firstName: 'Marco',   lastName: 'Ricci',     city: 'Milan',     tier: 'Silver', memberId: 'PRD-3341-6673' },
  { id: 'NM008', firstName: 'Théo',    lastName: 'Laurent',   city: 'Paris',     tier: 'Bronze', memberId: 'PRD-1178-3345' },
  { id: 'NM009', firstName: 'Anna',    lastName: 'Hofmann',   city: 'Vienna',    tier: 'Gold',   memberId: 'PRD-4412-7780' },
  { id: 'NM010', firstName: 'Miguel',  lastName: 'Santos',    city: 'Lisbon',    tier: 'Silver', memberId: 'PRD-5534-4421' },
  { id: 'NM011', firstName: 'Elena',   lastName: 'Conti',     city: 'Milan',     tier: 'Bronze', memberId: 'PRD-3367-0098' },
  { id: 'NM012', firstName: 'Giulia',  lastName: 'Martini',   city: 'Milan',     tier: 'Silver', memberId: 'PRD-3398-2256' },
  { id: 'NM013', firstName: 'Priya',   lastName: 'Mehta',     city: 'Barcelona', tier: 'Bronze', memberId: 'PRD-2244-5539' },
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
