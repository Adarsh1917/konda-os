import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  language?: string;
  onChange: (value: string) => void;
}

export default function MonacoEditor({
  value,
  language = "python",
  onChange,
}: MonacoEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      theme="vs-dark"
      options={{
        minimap: {
          enabled: true,
        },
        fontSize: 14,
        fontLigatures: true,
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderWhitespace: "selection",
        tabSize: 4,
        insertSpaces: true,
        smoothScrolling: true,
        cursorBlinking: "blink",
      }}
    />
  );
}