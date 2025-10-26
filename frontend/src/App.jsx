import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import SignUpPage from './Sign-up-Page/SignupPage.jsx';
import LoginPage from './Login-Page/LoginPage.jsx'; 
import TeacherDashboard from './Teacher-Dashboard/TeacherDashboard.jsx';
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