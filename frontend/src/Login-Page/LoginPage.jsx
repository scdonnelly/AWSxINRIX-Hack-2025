import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// --- THIS IS THE CORRECTED IMPORT PATH ---
import '../Sign-up-Page/SignupPage.css'; 

const LoginPage = () => {
  // --- State for Form Fields ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); 
    setError(''); 

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    console.log('Simulating login with:', { email, password });
    console.log('Success! Redirecting to /dashboard...');
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-logo">HighView Portal</h1>
        <h2 className="auth-title">Log In to Your Account</h2>

        <form onSubmit={handleSubmit}>
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

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

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