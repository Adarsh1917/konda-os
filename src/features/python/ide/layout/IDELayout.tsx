import "./IDELayout.css";

import ActivityBar from "../activitybar/ActivityBar";
import Sidebar from "../sidebar/Sidebar";
import EditorPanel from "../editor/EditorPanel";
import BottomPanel from "../bottompanel/BottomPanel";

import AIPanel from "../aipanel/AIPanel";

import ProjectHeader from "../project/ProjectHeader";
import StatusBar from "../statusbar/StatusBar";

export default function IDELayout() {
  return (
    <div className="ide-layout">
      <ProjectHeader />

      <div className="ide-main">
        <ActivityBar />

        <Sidebar />

        <main className="editor-wrapper">
          <EditorPanel />

          <BottomPanel />
        </main>

        <AIPanel />
      </div>

      <StatusBar />
    </div>
  );
}