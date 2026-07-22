import { useState } from "react";
import Background from "../shared/Background";
import WelcomeHero from "./WelcomeHero";
import StartButton from "./StartButton";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  const [starting, setStarting] = useState(false);

  const handleStart = () => {
    setStarting(true);

    // Later we'll navigate to the Home Dashboard
    setTimeout(() => {
      console.log("Navigate to Home Dashboard");
    }, 1000);
  };

  return (
    <div className={`welcome-screen ${starting ? "starting" : ""}`}>
      <Background />

      <div className="welcome-overlay"></div>

      <main className="welcome-content">
        <WelcomeHero />

        <StartButton onStart={handleStart} />
      </main>
    </div>
  );
};

export default WelcomeScreen;