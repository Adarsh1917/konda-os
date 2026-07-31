import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AIProvider } from "./core/ai/providers/AIProvider";

import "./styles/variables.css";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AIProvider>
      <App />
    </AIProvider>
  </React.StrictMode>
);