import "./StatusBar.css";

interface StatusBarProps {
  language?: string;
  encoding?: string;
  lineEnding?: string;
  indentation?: string;
}

export default function StatusBar({
  language = "Python 3.13",
  encoding = "UTF-8",
  lineEnding = "LF",
  indentation = "Spaces:4",
}: StatusBarProps) {
  return (
    <footer className="statusbar">
      <div className="statusbar-left">
        <span>🐍 {language}</span>
        <span>{encoding}</span>
        <span>{lineEnding}</span>
        <span>{indentation}</span>
      </div>

      <div className="statusbar-right">
        <span className="status-ready">● Ready</span>
      </div>
    </footer>
  );
}