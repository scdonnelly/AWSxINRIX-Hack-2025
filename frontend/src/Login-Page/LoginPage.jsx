import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// --- IMPORTANT: We re-use the CSS from the Sign-up Page ---
import '../Sign-up-Page/SignupPage.css'; 

/**
 * Phase 1, Step 3: Login Page (Route: /login)
 * Styled to match the SignUpPage.
 */
const LoginPage = () => {
  // --- State for Form Fields ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // --- Hook for Navigation ---
  const navigate = useNavigate();

  /**
   * This function runs when the user clicks the "Log In" button.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the page from reloading
    setError(''); // Clear any old errors

    // --- 1. Validation (simple) ---
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // --- 2. Simulate Sending Data to Backend ---
    // In a real hackathon, you'd check if this user exists.
    const loginData = { email, password };
    console.log('Simulating login with:', loginData);

    // --- 3. Redirect on Success ---
    // As per your plan, redirect to the dashboard.
    // Here you would also check the user's role (Teacher, Student, etc.)
    console.log('Success! Redirecting to /dashboard...');
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        {/* --- Uses the same class names as Sign Up --- */}
        <h1 className="auth-logo">HighView Connect</h1>
        <h2 className="auth-title">Log In to Your Account</h2>

        {/* --- The Login Form --- */}
        <form onSubmit={handleSubmit}>

          {/* --- Email Address Field --- */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* --- Password Field --- */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* --- Show Errors (if any) --- */}
          {error && <p className="auth-error">{error}</p>}

          {/* --- Log In Button --- */}
          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        {/* --- Links at the bottom --- */}
        <p className="auth-switch" style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/forgot-password" style={{ display: 'block', marginBottom: '10px' }}>
            Forgot Password?
          </Link>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;