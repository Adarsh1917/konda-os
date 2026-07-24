import "./EditorPanel.css";

import { FileCode2 } from "lucide-react";

export default function EmptyEditor() {
  return (
    <div className="empty-editor">
      <FileCode2
        size={72}
        strokeWidth={1.5}
        className="empty-editor-icon"
      />

      <h2>Konda IDE</h2>

      <p>
        Open a file from the Explorer to start coding.
      </p>

      <div className="empty-editor-shortcuts">
        <div>
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>P</kbd>
          <span>Quick Open (Coming Soon)</span>
        </div>

        <div>
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>Shift</kbd>
          <span>+</span>
          <kbd>P</kbd>
          <span>Command Palette (Coming Soon)</span>
        </div>

        <div>
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>S</kbd>
          <span>Save File</span>
        </div>
      </div>
    </div>
  );
}