import { useCallback, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import Button from "../../shared/components/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setFilter } from "./tasksSlice";
import {
  selectCanClearCompleted,
  selectHasLoadedTasks,
  selectIsTasksBusy,
  selectLastMutation,
  selectLastSyncedAt,
  selectTaskError,
  selectTaskFilter,
  selectTaskStats,
  selectVisibleTaskIds,
} from "./tasksSelectors";
import {
  addTask,
  clearCompleted,
  deleteTask,
  fetchTasks,
  toggleTask,
} from "./tasksThunks";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTaskFilter);
  const visibleTaskIds = useAppSelector(selectVisibleTaskIds);
  const stats = useAppSelector(selectTaskStats);
  const isBusy = useAppSelector(selectIsTasksBusy);
  const canClearCompleted = useAppSelector(selectCanClearCompleted);
  const error = useAppSelector(selectTaskError);
  const hasLoaded = useAppSelector(selectHasLoadedTasks);
  const lastSyncedAt = useAppSelector(selectLastSyncedAt);
  const lastMutation = useAppSelector(selectLastMutation);

  useEffect(() => {
    if (!hasLoaded) {
      dispatch(fetchTasks());
    }
  }, [dispatch, hasLoaded]);

  const onAdd = useCallback(
    (title: string) => {
      dispatch(addTask({ title }));
    },
    [dispatch],
  );

  const onToggle = useCallback(
    (id: string) => {
      dispatch(toggleTask({ id }));
    },
    [dispatch],
  );

  const onDelete = useCallback(
    (id: string) => {
      dispatch(deleteTask({ id }));
    },
    [dispatch],
  );

  const onClearCompleted = useCallback(() => {
    dispatch(clearCompleted());
  }, [dispatch]);

  const onFilterChange = useCallback(
    (nextFilter: typeof filter) => {
      dispatch(setFilter({ filter: nextFilter }));
    },
    [dispatch],
  );

  const showInitialLoading = isBusy && !hasLoaded;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              React Refresh - Tasks Day 5
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Total: <b>{stats.total}</b> | Active: <b>{stats.active}</b> |
              Completed: <b>{stats.completed}</b>
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-teal-700">
              Day 5 architecture: entity adapter, memoized selectors, focused
              thunks
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={onClearCompleted}
            disabled={!canClearCompleted || isBusy}
          >
            Clear completed
          </Button>
        </header>

        <main className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <TaskForm onAdd={onAdd} disabled={isBusy} />

          <div className="mt-6">
            <TaskFilters
              value={filter}
              onChange={onFilterChange}
              disabled={isBusy}
            />
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6">
            {showInitialLoading ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                Loading tasks...
              </div>
            ) : (
              <TaskList
                taskIds={visibleTaskIds}
                onToggle={onToggle}
                onDelete={onDelete}
                disabled={isBusy}
              />
            )}
          </div>
        </main>

        <footer className="mt-6 text-sm text-gray-500">
          Day 5 focus: normalized state, selector-driven rendering, Redux
          DevTools visibility, and cleaner async boundaries.
          {lastMutation && (
            <span className="block mt-2">
              Last mutation: <b>{lastMutation}</b>
            </span>
          )}
          {lastSyncedAt && (
            <span className="block mt-1">
              Last sync: <b>{new Date(lastSyncedAt).toLocaleTimeString()}</b>
            </span>
          )}
        </footer>
      </div>
    </div>
  );
}
