import { useState } from "react";

import "./BottomPanel.css";

import Terminal from "./Terminal";
import Problems from "./Problems";
import Output from "./Output";
import DebugConsole from "./DebugConsole";

type PanelTab =
  | "terminal"
  | "problems"
  | "output"
  | "debug";

export default function BottomPanel() {
  const [activeTab, setActiveTab] =
    useState<PanelTab>("terminal");

  return (
    <div className="bottom-panel">
      <div className="bottom-tabs">
        <button
          className={
            activeTab === "terminal"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("terminal")
          }
        >
          Terminal
        </button>

        <button
          className={
            activeTab === "problems"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("problems")
          }
        >
          Problems
        </button>

        <button
          className={
            activeTab === "output"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("output")
          }
        >
          Output
        </button>

        <button
          className={
            activeTab === "debug"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("debug")
          }
        >
          Debug Console
        </button>
      </div>

      <div className="bottom-content">
        {activeTab === "terminal" && (
          <Terminal />
        )}

        {activeTab === "problems" && (
          <Problems />
        )}

        {activeTab === "output" && (
          <Output />
        )}

        {activeTab === "debug" && (
          <DebugConsole />
        )}
      </div>
    </div>
  );
}