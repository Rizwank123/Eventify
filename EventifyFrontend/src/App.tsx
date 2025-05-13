import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import EventCreationPage from './pages/organizer/EventCreationPage';
import EventUpdatePage from './pages/organizer/EventUpdatePage';
import SessionCreationPage from './pages/organizer/SessionCreationPage';
import EventListingPage from './pages/attendee/EventListingPage';
import RegistrationsPage from './pages/attendee/RegistrationsPage';
import NotificationsPage from './pages/common/NotificationsPage';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';
import MainLayout from './layouts/MainLayout';
import { Toaster } from './components/ui/Toaster';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* Common Routes */}
            <Route path="/dashboard" element={
              user?.role === 'ORGANIZER'
                ? <Navigate to="/organizer/events" />
                : <Navigate to="/attendee/events" />
            } />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Organizer Routes */}
            <Route element={<RoleRoute requiredRole="ORGANIZER" />}>
              <Route path="/organizer/events" element={<OrganizerDashboard />} />
              <Route path="/organizer/events/create" element={<EventCreationPage />} />
              <Route path="/organizer/events/update/:id" element={<EventUpdatePage />} />
              <Route path="/organizer/sessions/:eventId" element={<SessionCreationPage />} />
            </Route>

            {/* Attendee Routes */}
            <Route element={<RoleRoute requiredRole="ATTENDEE" />}>
              <Route path="/attendee/events" element={<EventListingPage />} />
              <Route path="/attendee/registrations" element={<RegistrationsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Redirect root to login or dashboard */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Catch all - redirect to dashboard or login */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;