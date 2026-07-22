import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">

      <div className="hero-left">

        <p className="hero-greeting">
          👋 Good Morning
        </p>

        <h1>
          Welcome back to <span>KONDA OS</span>
        </h1>

        <p className="hero-description">
          Study, Code, Create and Organize everything from one AI workspace.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Start Chat
          </button>

          <button className="secondary-btn">
            Explore
          </button>
        </div>

      </div>

      <div className="hero-right">

        <div className="ai-orb">

          <div className="ring ring1"></div>

          <div className="ring ring2"></div>

          <div className="core"></div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;