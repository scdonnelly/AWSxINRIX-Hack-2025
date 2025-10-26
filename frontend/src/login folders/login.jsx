import React from 'react';
import { Link } from 'react-router-dom';
import './login.css'; // Use existing stylesheet in this folder

const LoginPage = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Log In</h2>
        
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
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