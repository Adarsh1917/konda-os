import "./NewFileDialog.css";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (fileName: string) => void;
};

const NewFileDialog = ({
  open,
  onClose,
  onCreate,
}: Props) => {
  const [fileName, setFileName] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!fileName.trim()) return;

    onCreate(fileName.trim());
    setFileName("");
    onClose();
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog">

        <h2>📄 Create New File</h2>

        <input
          value={fileName}
          onChange={(e) =>
            setFileName(e.target.value)
          }
          placeholder="example.py"
        />

        <div className="dialog-buttons">

          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={handleCreate}>
            Create
          </button>

        </div>

      </div>
    </div>
  );
};

export default NewFileDialog;