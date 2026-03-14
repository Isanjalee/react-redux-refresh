import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { tasksRoutePath, tasksRoutes } from "../features/tasks/routes";

export const appRoutePaths = {
  home: "/",
  tasks: tasksRoutePath,
};

export const appRouter = createBrowserRouter([
  {
    path: appRoutePaths.home,
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={appRoutePaths.tasks} replace />,
      },
      ...tasksRoutes,
      {
        path: "*",
        element: <Navigate to={appRoutePaths.tasks} replace />,
      },
    ],
  },
]);
