import { useCallback } from "react";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import Button from "../../shared/components/Button";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addTask,
  clearCompleted,
  deleteTask,
  selectTaskFilter,
  selectTaskStats,
  selectVisibleTasks,
  setFilter,
  toggleTask,
} from "./tasksSlice";

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTaskFilter);
  const visibleTasks = useAppSelector(selectVisibleTasks);
  const stats = useAppSelector(selectTaskStats);

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              React Refresh - Tasks MVP
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Total: <b>{stats.total}</b> | Active: <b>{stats.active}</b> |
              Completed: <b>{stats.completed}</b>
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={onClearCompleted}
            disabled={stats.completed === 0}
          >
            Clear completed
          </Button>
        </header>

        <main className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <TaskForm onAdd={onAdd} />

          <div className="mt-6">
            <TaskFilters value={filter} onChange={onFilterChange} />
          </div>

          <div className="mt-6">
            <TaskList
              tasks={visibleTasks}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          </div>
        </main>

        <footer className="mt-6 text-sm text-gray-500">
          Day 3 focus: Redux Toolkit (slice, store, typed hooks, selectors).
        </footer>
      </div>
    </div>
  );
}
