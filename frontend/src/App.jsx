import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import SignUpPage from './Sign-up-Page/SignupPage.jsx';
import LoginPage from './Login-Page/LoginPage.jsx';
import ForgotPasswordPage from './ForgotPassword-Page/ForgotPasswordPage.jsx';
import ResetPasswordPage from './Reset-Password-Page/ResetPasswordPage.jsx';
import TeacherDashboard from './Teacher-Dashboard/TeacherDashboard.jsx';
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
        <Route path="/reset-password" element={<ResetPasswordPage />} /> {/* <-- 2. ADD ROUTE */}
        
        {/* --- Protected Pages --- */}
        <Route path="/dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;