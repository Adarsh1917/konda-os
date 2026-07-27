import "./Terminal.css";

import { useEffect, useRef } from "react";

import { useRuntime } from "../../runtime/useRuntime";

export default function Terminal() {
  const runtime = useRuntime();

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [runtime.outputs]);

  return (
    <div className="terminal">

      {runtime.outputs.map((line) => (
        <div
          key={line.id}
          className={`terminal-line ${line.type}`}
        >
          {line.text}
        </div>
      ))}

      <div ref={endRef} />

    </div>
  );
}