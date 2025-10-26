import { Link } from 'react-router-dom';
import './LandingPage.css';
import heroImage from '../assets/my-hero-image.png'; // Make sure this path is correct!

const LandingPage = () => {
  return (
    <div className="landing-container">
      
      {/* --- THIS IS THE MISSING PART --- */}
      <header className="landing-header">
        <h1 className="logo">HighView Portal</h1>
        <nav className="header-nav">
          <Link to="/login" className="nav-button btn-secondary">Login</Link>
          <Link to="/signup" className="nav-button btn-primary">Sign Up</Link>
        </nav>
      </header>
      {/* ------------------------------- */}

      {/* Main hero section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2 className="hero-headline">Welcome to the HighView Portal</h2>
          <p className="hero-subtext">
            Track your engagement, see your progress, and connect with 
            opportunities all in one place.
          </p>
          <div className="hero-cta-buttons">
            <Link to="/signup" className="cta-button btn-primary">Get Started</Link>
            <Link to="/login" className="cta-button btn-secondary">I Already Have an Account</Link>
          </div>
        </div>
        
        {/* You can now delete this placeholder div */}
        {/* <div className="hero-image-placeholder">
          <div className="placeholder-text">Hero Image/Graphic</div>
        </div> */}
        
        {/* And just keep your new image tag */}
        <img src={heroImage} className="hero-image" alt="HighView students" />

      </main>
    </div>
  );
};

export default LandingPage;