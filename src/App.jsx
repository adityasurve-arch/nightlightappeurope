import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getMember, saveMember } from './lib/member'
import { LanguageProvider } from './lib/i18n'
import BottomNav from './components/BottomNav'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Rewards from './pages/Rewards'
import Venues from './pages/Venues'
import History from './pages/History'
import Profile from './pages/Profile'
import GroupOrder from './pages/GroupOrder'
import VenueDetail from './pages/VenueDetail'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import QuarterDashboard from './pages/QuarterDashboard'

// Public demo: no backend auth. Protected routes just need a member record in
// localStorage — if there isn't one yet (e.g. someone opened a deep link
// directly), provision the demo member so the whole app is explorable.
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

function RequireAuth({ children }) {
  if (!getMember()) saveMember(DEMO_MEMBER)
  return children
}

function ProtectedLayout({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      <div style={{ paddingBottom: '64px' }}>
        {children}
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <ProtectedLayout><Dashboard /></ProtectedLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/rewards"
            element={
              <RequireAuth>
                <ProtectedLayout><Rewards /></ProtectedLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/venues"
            element={
              <RequireAuth>
                <ProtectedLayout><Venues /></ProtectedLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/history"
            element={
              <RequireAuth>
                <ProtectedLayout><History /></ProtectedLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProtectedLayout><Profile /></ProtectedLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/order"
            element={
              <RequireAuth>
                <ProtectedLayout><GroupOrder /></ProtectedLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/venues/:id"
            element={
              <RequireAuth>
                <VenueDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:id"
            element={
              <RequireAuth>
                <EventDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/quarter"
            element={
              <RequireAuth>
                <div style={{ position: 'fixed', inset: 0, width: '100vw', overflowY: 'auto', zIndex: 100 }}>
                  <QuarterDashboard />
                </div>
              </RequireAuth>
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </div>
  )
}
