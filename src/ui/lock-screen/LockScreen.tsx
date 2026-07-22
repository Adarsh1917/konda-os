import { useState } from "react";
import Background from "./Background";
import Clock from "./Clock";
import DateDisplay from "./DateDisplay";
import UnlockHint from "./UnlockHint";
import "./LockScreen.css";

const LockScreen = () => {
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = () => {
    setUnlocking(true);

    // Later we'll navigate to the Welcome Screen
    setTimeout(() => {
      console.log("Navigate to Welcome Screen");
    }, 1200);
  };

  return (
    <div className={`lock-screen ${unlocking ? "unlocking" : ""}`}>
      <Background />

      <div className="overlay"></div>

      <main className="lock-content">

        <div className="logo-section">
          <div className="logo-orb"></div>

          <h2>KONDA OS</h2>

          <p>Your Personal AI Operating System</p>
        </div>

        <Clock />

        <DateDisplay />

        <UnlockHint onUnlock={handleUnlock} />

      </main>
    </div>
  );
};

export default LockScreen;