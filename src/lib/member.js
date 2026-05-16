const KEY = 'pernod_member'
const COMPANIONS_KEY = 'pernod_companions'

export function getMember() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveMember(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj))
}

export function clearMember() {
  localStorage.removeItem(KEY)
}

export function generateMemberId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `PRD-${rand(4)}-${rand(4)}`
}

export function updateMember(patch) {
  const current = getMember()
  if (!current) return
  saveMember({ ...current, ...patch })
}

// Companion tags: { [visitId]: [networkMemberId, ...] }
export function getCompanions() {
  try {
    const raw = localStorage.getItem(COMPANIONS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setVisitCompanions(visitId, memberIds) {
  const all = getCompanions()
  all[visitId] = memberIds
  localStorage.setItem(COMPANIONS_KEY, JSON.stringify(all))
}

export function clearCompanions() {
  localStorage.removeItem(COMPANIONS_KEY)
}
