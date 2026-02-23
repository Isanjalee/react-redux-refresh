import { useEffect, useMemo, useState } from "react";
import type { Task, TaskFilter } from "./types";
import { loadTasks, saveTasks } from "./storage";
import { filterTasks, makeId } from "./taskUtils";
import TaskForm from "./components/TaskForm";
import TaskFilters from "./components/TaskFilters";
import TaskList from "./components/TaskList";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filter, setFilter] = useState<TaskFilter>("all");

  // Persist tasks
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [tasks]);

  function addTask(title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: makeId(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">React Refresh — Tasks MVP</h1>
          <p className="subtitle">
            Total: <b>{stats.total}</b> · Active: <b>{stats.active}</b> · Completed:{" "}
            <b>{stats.completed}</b>
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={clearCompleted}
          disabled={stats.completed === 0}
          title="Remove all completed tasks"
        >
          Clear completed
        </button>
      </header>

      <main className="card">
        <TaskForm onAdd={addTask} />
        <TaskFilters value={filter} onChange={setFilter} />
        <TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} />
      </main>

      <footer className="footer">
        <p>
          Day 1 focus: state, props, lists/keys, controlled inputs, effects, localStorage,
          routing.
        </p>
      </footer>
    </div>
  );
}