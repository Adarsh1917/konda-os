import { useCallback, useEffect, useState } from "react";

interface UseEditorProps {
  activeFileId: string | null;
  content: string;
  onSave: (content: string) => void;
}

export function useEditor({
  activeFileId,
  content,
  onSave,
}: UseEditorProps) {
  const [value, setValue] = useState(content);
  const [isDirty, setIsDirty] = useState(false);

  /* ===========================
     Sync Editor
  =========================== */

  useEffect(() => {
    setValue(content);
    setIsDirty(false);
  }, [activeFileId, content]);

  /* ===========================
     Update
  =========================== */

  const updateValue = useCallback(
    (text: string) => {
      setValue(text);
      setIsDirty(text !== content);
    },
    [content]
  );

  /* ===========================
     Save
  =========================== */

  const save = useCallback(() => {
    if (!isDirty) return;

    onSave(value);
    setIsDirty(false);
  }, [isDirty, value, onSave]);

  /* ===========================
     Ctrl + S
  =========================== */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        save();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [save]);

  return {
    value,
    isDirty,
    updateValue,
    save,
  };
}