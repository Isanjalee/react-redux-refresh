import { Suspense } from "react";
import PageLoader from "../shared/components/PageLoader";
import { tasksRoute } from "../features/tasks/routes";

function withRouteFallback(element: React.JSX.Element, label: string) {
  return (
    <Suspense fallback={<PageLoader label={label} />}>
      {element}
    </Suspense>
  );
}

export const appRoutes = {
  tasks: tasksRoute.path,
  tasksElement: withRouteFallback(tasksRoute.element, tasksRoute.loadingLabel),
};
