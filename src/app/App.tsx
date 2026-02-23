import { Routes, Route, Navigate } from "react-router-dom";
import { appRoutes } from "./routes";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={appRoutes.tasks} replace />} />
      <Route path={appRoutes.tasks} element={appRoutes.tasksElement} />
      <Route path="*" element={<Navigate to={appRoutes.tasks} replace />} />
    </Routes>
  );
}