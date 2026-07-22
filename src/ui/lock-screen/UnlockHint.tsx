import "./UnlockHint.css";

type UnlockHintProps = {
  onUnlock: () => void;
};

const UnlockHint = ({ onUnlock }: UnlockHintProps) => {
  return (
    <div className="unlock-container" onClick={onUnlock}>
      <p className="unlock-text">
        Click Anywhere To Continue
      </p>
    </div>
  );
};

export default UnlockHint;