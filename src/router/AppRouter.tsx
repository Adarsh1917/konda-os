import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../pages/HomePage";
import StudyPage from "../pages/StudyPage";
import CodePage from "../pages/CodePage";
import MemoryPage from "../pages/MemoryPage";
import FilesPage from "../pages/FilesPage";
import CalendarPage from "../pages/CalendarPage";

import ProgrammingPage from "../pages/ProgrammingPage";
import PythonPage from "../pages/PythonPage";
<Route path="/python" element={<PythonPage />} />

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/python" element={<PythonPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/study" element={<StudyPage />} />

        <Route path="/programming" element={<ProgrammingPage />} />

        <Route path="/code" element={<CodePage />} />
        <Route path="/memory" element={<MemoryPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;