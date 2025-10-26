import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import SignUpPage from './Sign-up-Page/SignupPage.jsx';
import LoginPage from './Login-Page/LoginPage.jsx';
import ForgotPasswordPage from './ForgotPassword-Page/ForgotPasswordPage.jsx';
import ResetPasswordPage from './Reset-Password-Page/ResetPasswordPage.jsx';
import TeacherDashboard from './Teacher-Dashboard/TeacherDashboard.jsx';

// Import the new components for nested routes
import DashboardHome from './Teacher-Dashboard/components/DashboardHome.jsx';
import StudentsTab from './Teacher-Dashboard/components/StudentsTab.jsx';
import AttendanceTab from './Teacher-Dashboard/components/AttendanceTab.jsx';
import LeaderboardTab from './Teacher-Dashboard/components/LeaderboardTab.jsx';
import EventsTab from './Teacher-Dashboard/components/EventsTab.jsx';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Pages --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* --- Protected Pages --- */}
        <Route path="/dashboard" element={<TeacherDashboard />}> {/* Layout Route */}
          {/* Nested Routes - these render inside TeacherDashboard's <Outlet /> */}
          <Route index element={<DashboardHome />} /> {/* Default page at /dashboard */}
          <Route path="students" element={<StudentsTab />} /> {/* Renders at /dashboard/students */}
          <Route path="attendance" element={<AttendanceTab />} /> {/* Renders at /dashboard/attendance */}
          <Route path="leaderboard" element={<LeaderboardTab />} /> {/* Renders at /dashboard/leaderboard */}
          <Route path="events" element={<EventsTab />} /> {/* Renders at /dashboard/events */}
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;