export default function Terminal() {
  return (
    <div className="panel-view">
      <h3>Terminal</h3>

      <div className="terminal-window">
        <div className="terminal-line">
          Konda IDE Terminal
        </div>

        <div className="terminal-line">
          Python environment will appear here.
        </div>

        <div className="terminal-line terminal-cursor">
          >
        </div>
      </div>
    </div>
  );
}