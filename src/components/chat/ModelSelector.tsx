type ModelType = "gemini" | "local";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
}

function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <div className="model-selector">
      <label htmlFor="model-select">AI Model:</label>

      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) =>
          onModelChange(e.target.value as ModelType)
        }
      >
        <option value="gemini">✨ Gemini</option>
        <option value="local" disabled>
          🖥 Local AI (Coming Soon)
        </option>
      </select>
    </div>
  );
}

export default ModelSelector;