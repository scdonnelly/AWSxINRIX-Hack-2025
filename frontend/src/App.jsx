import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './Sign-up-Page/SignupPage.jsx';
import LoginPage from './Login-Page/LoginPage.jsx'; // <-- 1. IMPORT IT
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Pages --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* <-- 2. ADD THIS ROUTE */}
        
        {/* --- Protected Pages --- */}
        <Route path="/dashboard" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;