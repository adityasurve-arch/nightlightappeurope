import { Navigate } from 'react-router-dom'

// Public demo: there is no OAuth round-trip, so this route just sends anyone
// who lands here into the app. RequireAuth provisions a demo member.
export default function AuthCallback() {
  return <Navigate to="/dashboard" replace />
}
