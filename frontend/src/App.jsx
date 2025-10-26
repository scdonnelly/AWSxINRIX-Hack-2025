import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing-Page/LandingPage.jsx';
import SignUpPage from './Sign-up-Page/SignupPage.jsx'; 
import './App.css';

// Import other pages as you build them
// import LoginPage from './components/public/LoginPage';
// import SignUpPage from './components/public/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Pages --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* <-- 2. ADD THIS ROUTE */}

        {/* --- Protected Pages (for later) --- */}
        {/* <Route path="/dashboard" element={<TeacherDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;