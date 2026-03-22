import {
  Suspense,
  lazy,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
} from "react";
import { useSearchParams } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TasksPagination from "./components/TasksPagination";
import TasksQueryToolbar from "./components/TasksQueryToolbar";
import Button from "../../shared/components/Button";
import LoadingPanel from "../../shared/components/LoadingPanel";
import RenderProfiler from "../../shared/components/RenderProfiler";
import { normalizeApiError } from "../../shared/api/apiErrors";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  tasksApi,
  useAddTaskMutation,
  useClearCompletedMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useToggleTaskMutation,
} from "./tasksApi";
import { hydrateTasksFromQuery } from "./tasksSlice";
import {
  selectIsTasksMutating,
  selectLastMutation,
  selectLastSyncedAt,
  selectTaskErrors,
} from "./tasksSelectors";
import { normalizeTaskListQuery } from "./taskUtils";
import type { TaskFilter, TaskListQuery } from "./types";

const TasksInsightsPanel = lazy(() => import("./components/TasksInsightsPanel"));
const DEFAULT_PAGE_SIZE = 5;

function getSearchParamFilter(value: string | null): TaskFilter {
  if (value === "active" || value === "completed") {
    return value;
  }

  return "all";
}

function getQueryFromSearchParams(searchParams: URLSearchParams): TaskListQuery {
  return normalizeTaskListQuery({
    page: Number.parseInt(searchParams.get("page") ?? "1", 10),
    pageSize: DEFAULT_PAGE_SIZE,
    search: searchParams.get("search") ?? "",
    filter: getSearchParamFilter(searchParams.get("filter")),
  });
}

function getEmptyStateCopy(query: TaskListQuery) {
  if (query.search) {
    return {
      title: "No matching results",
      description: `No tasks matched "${query.search}" for the current filter. Try a broader search or reset the query.`,
    };
  }

  if (query.filter === "active") {
    return {
      title: "No active tasks",
      description:
        "Everything is completed right now. Add another task or switch filters to inspect finished work.",
    };
  }

  if (query.filter === "completed") {
    return {
      title: "No completed tasks",
      description:
        "Completed items will appear here after tasks are checked off.",
    };
  }

  return {
    title: "No tasks yet",
    description:
      "Add your first task to start building this workspace and tracking progress.",
  };
}

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => getQueryFromSearchParams(searchParams), [searchParams]);
  const deferredQuery = useDeferredValue(query);
  const prefetchTasksPage = tasksApi.usePrefetch("getTasks");
  const isMutating = useAppSelector(selectIsTasksMutating);
  const taskErrors = useAppSelector(selectTaskErrors);
  const lastSyncedAt = useAppSelector(selectLastSyncedAt);
  const lastMutation = useAppSelector(selectLastMutation);
  const {
    data: taskPage,
    error: fetchError,
    isError: isFetchError,
    isFetching,
    isLoading,
    refetch,
  } = useGetTasksQuery(deferredQuery);
  const [runAddTask] = useAddTaskMutation();
  const [runToggleTask] = useToggleTaskMutation();
  const [runDeleteTask] = useDeleteTaskMutation();
  const [runClearCompleted] = useClearCompletedMutation();

  useEffect(() => {
    if (taskPage) {
      dispatch(hydrateTasksFromQuery({ tasks: taskPage.items }));
    }
  }, [dispatch, taskPage]);

  useEffect(() => {
    if (!taskPage) {
      return;
    }

    if (taskPage.hasNextPage) {
      prefetchTasksPage({ ...query, page: taskPage.page + 1 }, { force: false });
    }

    if (taskPage.hasPreviousPage) {
      prefetchTasksPage({ ...query, page: taskPage.page - 1 }, { force: false });
    }
  }, [prefetchTasksPage, query, taskPage]);

  const updateQueryParams = useCallback(
    (updates: Partial<TaskListQuery>) => {
      const nextQuery = normalizeTaskListQuery({
        ...query,
        ...updates,
      });
      const nextParams = new URLSearchParams();

      if (nextQuery.page > 1) {
        nextParams.set("page", String(nextQuery.page));
      }

      if (nextQuery.filter !== "all") {
        nextParams.set("filter", nextQuery.filter);
      }

      if (nextQuery.search) {
        nextParams.set("search", nextQuery.search);
      }

      setSearchParams(nextParams, { replace: true });
    },
    [query, setSearchParams],
  );

  const onAdd = useCallback(
    (title: string) => {
      void runAddTask({ title, view: query });
    },
    [query, runAddTask],
  );

  const onToggle = useCallback(
    (id: string) => {
      void runToggleTask({ id, view: query });
    },
    [query, runToggleTask],
  );

  const onDelete = useCallback(
    (id: string) => {
      void runDeleteTask({ id, view: query });
    },
    [query, runDeleteTask],
  );

  const onClearCompleted = useCallback(() => {
    void runClearCompleted();
  }, [runClearCompleted]);

  const onFilterChange = useCallback(
    (nextFilter: TaskFilter) => {
      updateQueryParams({ filter: nextFilter, page: 1 });
    },
    [updateQueryParams],
  );

  const onSearchChange = useCallback(
    (search: string) => {
      updateQueryParams({ search, page: 1 });
    },
    [updateQueryParams],
  );

  const onPageChange = useCallback(
    (page: number) => {
      updateQueryParams({ page });
    },
    [updateQueryParams],
  );

  const onResetQuery = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const showInitialLoading = (isLoading || isFetching) && !taskPage;
  const showRefreshingState = isFetching && Boolean(taskPage);
  const mutationError = taskErrors.mutate;
  const queryError = isFetchError
    ? normalizeApiError(fetchError, "Task request failed")
    : null;
  const error = mutationError ?? queryError;
  const showBlockingQueryError = Boolean(queryError && !taskPage);
  const emptyState = getEmptyStateCopy(query);
  const isInteractionLocked = isMutating || showInitialLoading;
  const stats = taskPage?.counts ?? { total: 0, active: 0, completed: 0 };
  const tasks = taskPage?.items ?? [];
  const canClearCompleted = stats.completed > 0;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-slate-200 px-1 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            Tasks Feature
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            React Refresh Tasks Workspace
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Total: <b>{stats.total}</b> | Active: <b>{stats.active}</b> |
            Completed: <b>{stats.completed}</b>
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-teal-700">
            Day 10 architecture: URL-driven query state, paginated RTK Query caches,
            adjacent-page prefetching, and scalable list-screen UX
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end sm:pt-4">
          {showRefreshingState && (
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-teal-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
              Syncing latest changes
            </div>
          )}

          <Button
            variant="secondary"
            onClick={onClearCompleted}
            disabled={!canClearCompleted || isInteractionLocked}
          >
            Clear completed
          </Button>
        </div>
      </header>

      <main className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <TaskForm onAdd={onAdd} disabled={isInteractionLocked} />

        <div className="mt-6">
          <TasksQueryToolbar
            filter={query.filter}
            search={query.search}
            isBusy={isFetching}
            onFilterChange={onFilterChange}
            onSearchChange={onSearchChange}
            onReset={onResetQuery}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Query: <b>{query.filter}</b>
            {query.search ? (
              <>
                {" "}| Search: <b>{query.search}</b>
              </>
            ) : null}
          </div>

          {taskPage && (
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="text-left text-sm font-medium text-teal-700 transition hover:text-teal-900 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {isFetching ? "Refreshing..." : "Refresh tasks"}
            </button>
          )}
        </div>

        {error && !showBlockingQueryError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-700">
                  Request issue
                </p>
                <p className="mt-2 leading-6">{error}</p>
              </div>
              {queryError && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Retry sync
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {showInitialLoading ? (
            <LoadingPanel
              compact
              title="Loading tasks..."
              description="Loading the first page of the workspace and restoring the active query."
            />
          ) : showBlockingQueryError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-700">
                Initial sync failed
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                We couldn't load this task query
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                {queryError}
              </p>
              <div className="mt-6 flex justify-center">
                <Button type="button" onClick={() => void refetch()} disabled={isFetching}>
                  Try again
                </Button>
              </div>
            </div>
          ) : (
            <>
              <RenderProfiler id="TasksList">
                <TaskList
                  tasks={tasks}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  disabled={isMutating}
                  emptyTitle={emptyState.title}
                  emptyDescription={emptyState.description}
                />
              </RenderProfiler>

              {taskPage && (
                <TasksPagination
                  page={taskPage.page}
                  totalPages={taskPage.totalPages}
                  totalItems={taskPage.totalItems}
                  pageSize={taskPage.pageSize}
                  isFetching={isFetching}
                  onPageChange={onPageChange}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Suspense
        fallback={
          <div className="mt-6 px-1">
            <LoadingPanel
              compact
              title="Loading workspace insights"
              description="Preparing sync and mutation metadata for this feature."
            />
          </div>
        }
      >
        <RenderProfiler id="TasksInsightsPanel">
          <TasksInsightsPanel
            total={stats.total}
            active={stats.active}
            completed={stats.completed}
            lastMutation={lastMutation}
            lastSyncedAt={lastSyncedAt}
          />
        </RenderProfiler>
      </Suspense>
    </div>
  );
}
