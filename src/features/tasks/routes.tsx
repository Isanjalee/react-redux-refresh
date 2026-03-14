import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import PageLoader from "../../shared/components/PageLoader";

const TasksPage = lazy(() => import("./TasksPage"));

export const tasksRoutePath = "/tasks";

export const tasksRoutes: RouteObject[] = [
  {
    path: "tasks",
    element: (
      <Suspense fallback={<PageLoader label="Loading the tasks workspace..." />}>
        <TasksPage />
      </Suspense>
    ),
  },
];
