import { lazy } from "react";

const TasksPage = lazy(() => import("./TasksPage"));

export const tasksRoute = {
  path: "/tasks",
  element: <TasksPage />,
  loadingLabel: "Loading the tasks workspace...",
};
