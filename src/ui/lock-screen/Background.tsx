import "./Background.css";

const Background = () => {
  return (
    <div className="background">
      <div className="gradient"></div>

      <div className="glow glow1"></div>
      <div className="glow glow2"></div>
      <div className="glow glow3"></div>

      <div className="grid"></div>

      <div className="particles">
        {Array.from({ length: 40 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>
    </div>
  );
};

export default Background;