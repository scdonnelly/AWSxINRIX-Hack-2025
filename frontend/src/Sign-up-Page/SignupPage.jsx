import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css';


/**
 * Phase 1, Step 2: Sign Up Page (Route: /signup)
 * Focusing on the TEACHER flow first.
 */
const SignUpPage = () => {
  // --- State for Form Fields ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // To show error messages
  
  // --- Hook for Navigation ---
  // We use this to redirect the user after a successful signup
  const navigate = useNavigate();

  /**
   * This function runs when the user clicks the "Create Account" button.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the page from reloading
    setError(''); // Clear any old errors

    // --- 1. Validation ---
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Stop the function
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // --- 2. Simulate Sending Data to Backend ---
    // In a real hackathon, you'd send this to your Java backend.
    // For now, we just log it and pretend it worked!
    const teacherData = {
      fullName,
      email,
      password,
      role: 'teacher', // Hard-coded as requested
    };
    
    console.log('Simulating account creation with:', teacherData);
    
    // --- 3. Redirect on Success ---
    // As per your plan, redirect to the dashboard on success.
    console.log('Success! Redirecting to /dashboard...');
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-logo">HighView Portal</h1>
        <h2 className="auth-title">Create Your Teacher Account</h2>

        {/* --- The Sign Up Form --- */}
        <form onSubmit={handleSubmit}>
          
          {/* --- Full Name Field --- */}
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

          {/* --- Confirm Password Field --- */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* --- Show Errors (if any) --- */}
          {error && <p className="auth-error">{error}</p>}

          {/* --- Create Account Button --- */}
          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;