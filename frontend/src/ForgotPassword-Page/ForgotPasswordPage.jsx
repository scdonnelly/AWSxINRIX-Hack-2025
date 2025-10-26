import { useState } from 'react';
import { Link } from 'react-router-dom';
// --- Reuse the CSS from the Sign-up Page ---
import '../Sign-up-Page/SignupPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // To show confirmation/error

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    // --- Simulate sending the reset link ---
    console.log(`Simulating sending password reset link to: ${email}`);
    // Display the confirmation message
    setMessage(`If an account exists for ${email}, a password reset link has been sent.`);
    setEmail(''); // Clear the input after submission
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-logo">HighView Portal</h1>
        <h2 className="auth-title">Forgot Password</h2>

        {/* --- Instructional Message --- */}
        <p className="auth-message">
          Enter the email address associated with your account, and we'll send you a link to reset your password.
        </p>

        {/* --- The Form --- */}
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
              aria-describedby="emailHelp" // For accessibility
            />
            <small id="emailHelp" className="form-text text-muted" style={{ marginTop: '5px', fontSize: '0.8rem', color: '#6c757d' }}>We'll never share your email with anyone else.</small>
          </div>

          {/* --- Show Confirmation/Error Message --- */}
          {message && <p className="auth-confirmation">{message}</p>}

          {/* --- Send Reset Link Button --- */}
          <button type="submit" className="auth-button">
            Send Reset Link
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;