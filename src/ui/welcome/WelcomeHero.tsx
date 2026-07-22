import "./WelcomeHero.css";

const WelcomeHero = () => {
  return (
    <section className="welcome-hero">

      <div className="hero-orb">
        <div className="hero-ring ring1"></div>
        <div className="hero-ring ring2"></div>
        <div className="hero-core"></div>
      </div>

      <h1 className="hero-title">
        Welcome to <span>KONDA OS</span>
      </h1>

      <p className="hero-subtitle">
        Your Personal AI Operating System
      </p>

      <p className="hero-description">
        Study. Code. Create. Everything in one intelligent workspace.
      </p>

    </section>
  );
};

export default WelcomeHero;