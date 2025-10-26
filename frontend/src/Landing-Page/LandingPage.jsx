import { Link } from 'react-router-dom';
import './LandingPage.css'; // We'll create this CSS file next

/**
 * Phase 1, Step 1: Landing Page (Route: /)
 * Inspiration: Clean, visual, and simple (like Class Dojo)
 */
const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Top navigation bar */}
      <header className="landing-header">
        <h1 className="logo">HighView Connect</h1>
        <nav className="header-nav">
          <Link to="/login" className="nav-button btn-secondary">Login</Link>
          <Link to="/signup" className="nav-button btn-primary">Sign Up</Link>
        </nav>
      </header>

      {/* Main hero section */}
      <main className="hero-section">
        <div className="hero-content">
          {/* Clear headline as requested in your plan */}
          <h2 className="hero-headline">Welcome to the HighView Portal</h2>
          <p className="hero-subtext">
            Track your engagement, see your progress, and connect with 
            opportunities—all in one place.
          </p>
          {/* Prominent buttons as requested in your plan */}
          <div className="hero-cta-buttons">
            <Link to="/signup" className="cta-button btn-primary">Get Started</Link>
            <Link to="/login" className="cta-button btn-secondary">I Already Have an Account</Link>
          </div>
        </div>
        <div className="hero-image-placeholder">
          {/* You can replace this div with an <img /> tag or an SVG graphic */}
          <div className="placeholder-text">Hero Image/Graphic</div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;