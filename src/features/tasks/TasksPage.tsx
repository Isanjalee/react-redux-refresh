import { useCallback, useMemo, useState } from "react";
import type { Task, TaskFilter } from "./types";
import { filterTasks, makeId } from "./taskUtils";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";
import { useLocalStorageState } from "../../shared/hooks/useLocalStorageState";
import Button from "../../shared/components/Button";

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>(
    "rr_refresh_tasks_v2",
    [],
  );

  const [filter, setFilter] = useState<TaskFilter>("all");

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter),
    [tasks, filter],
  );

  const stats = useMemo(() => {
    let completed = 0;
    for (const t of tasks) if (t.completed) completed++;

    return {
      total: tasks.length,
      completed,
      active: tasks.length - completed,
    };
  }, [tasks]);

  const addTask = useCallback(
    (title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;

      const newTask: Task = {
        id: makeId(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      setTasks((prev) => [newTask, ...prev]);
    },
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      );
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [setTasks],
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, [setTasks]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              React Refresh — Tasks MVP
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Total: <b>{stats.total}</b> · Active: <b>{stats.active}</b> ·
              Completed: <b>{stats.completed}</b>
            </p>
          </div>

          <Button
            variant="secondary"
            onClick={clearCompleted}
            disabled={stats.completed === 0}
          >
            Clear completed
          </Button>
        </header>

        {/* Card */}
        <main className="mt-8 rounded-2xl bg-white p-6 shadow-md">
          <TaskForm onAdd={addTask} />

          <div className="mt-6">
            <TaskFilters value={filter} onChange={setFilter} />
          </div>

          <div className="mt-6">
            <TaskList
              tasks={visibleTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </div>
        </main>

        <footer className="mt-6 text-sm text-gray-500">
          Day 2 focus: custom hooks, memoization, reusable components.
        </footer>
      </div>
    </div>
  );
}
