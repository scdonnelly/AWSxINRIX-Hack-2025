import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// --- Reuse the CSS from the Sign-up Page ---
import '../Sign-up-Page/SignupPage.css';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // --- Validation ---
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // --- Simulate saving the new password ---
    console.log('Simulating saving new password...');
    // In a real app, you'd send the new password to your backend here.

    setSuccessMessage('Password reset successfully! Redirecting to login...');

    // --- Redirect to Login Page after a short delay ---
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Wait 2 seconds before redirecting
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h1 className="auth-logo">HighView Portal</h1>
        <h2 className="auth-title">Reset Your Password</h2>

        {/* --- The Form --- */}
        <form onSubmit={handleSubmit}>
          {/* --- New Password Field --- */}
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              aria-describedby="passwordHelp"
            />
             <small id="passwordHelp" className="form-text text-muted" style={{ marginTop: '5px', fontSize: '0.8rem', color: '#6c757d' }}>Must be at least 6 characters.</small>
          </div>

          {/* --- Confirm New Password Field --- */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* --- Show Error or Success Message --- */}
          {error && <p className="auth-error">{error}</p>}
          {successMessage && <p className="auth-confirmation">{successMessage}</p>}

          {/* --- Reset Password Button --- */}
          {/* Disable button after success to prevent multiple clicks */}
          <button type="submit" className="auth-button" disabled={!!successMessage}>
            Reset Password
          </button>
        </form>

        {/* Optional: Link back to login if they didn't mean to reset */}
        <p className="auth-switch">
          Changed your mind? <Link to="/login">Back to Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;