import TaskItem from "./TaskItem";
import type { Task } from "../types";

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function TaskList({
  tasks,
  onToggle,
  onDelete,
  disabled = false,
  emptyTitle = "No tasks yet",
  emptyDescription = "Add your first task to start building this workspace.",
}: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Empty state
        </p>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{emptyTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}
