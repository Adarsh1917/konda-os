import "./StartButton.css";

type StartButtonProps = {
  onStart: () => void;
};

const StartButton = ({ onStart }: StartButtonProps) => {
  return (
    <button className="start-button" onClick={onStart}>
      Get Started
    </button>
  );
};

export default StartButton;