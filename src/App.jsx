import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getMember } from './lib/member'
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

function RequireAuth({ children }) {
  return getMember() ? children : <Navigate to="/" replace />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </div>
  )
}
