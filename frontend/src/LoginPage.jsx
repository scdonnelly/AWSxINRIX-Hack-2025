import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login-Page/login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just log the values. Replace with real auth call later.
    // This prevents the page from reloading on submit.
    // Example: call fetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    // and then on success store token / navigate.
    // eslint-disable-next-line no-console
    console.log('Login submit', { email, password });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="login-button">Log In</button>

        <div className="login-links">
          {/* These links will work once we add more routes */}
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
