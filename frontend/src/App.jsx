import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Badges from './pages/Badges';
import Dashboard from './pages/Dashboard';
import LogSugar from './pages/LogSugar';
import InsightResult from './pages/InsightResult';
import History from './pages/History';
import Profile from './pages/Profile';
import HealthSync from './pages/HealthSync';
import Login from './pages/Login';
import Signup from './pages/Signup';

function ProtectedRoute({ children }) {
  const { isAuthenticated, onboarded } = useAuth();
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/welcome" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a35',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/onboarding"
          element={
            <AuthRoute>
              <Onboarding />
            </AuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogSugar />} />
          <Route path="insight" element={<InsightResult />} />
          <Route path="history" element={<History />} />
          <Route path="health" element={<HealthSync />} />
          <Route path="profile" element={<Profile />} />
          <Route path="badges" element={<Badges />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
