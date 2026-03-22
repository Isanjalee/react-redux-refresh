import React from "react";
import Button from "../../../shared/components/Button";
import type { Task } from "../types";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
};

const TaskItem = React.memo(function TaskItem({
  task,
  onToggle,
  onDelete,
  disabled = false,
}: Props) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:bg-gray-100">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={disabled}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4"
          aria-label={task.title}
        />

        <span
          className={`text-sm ${
            task.completed ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {task.title}
        </span>
      </label>

      <Button
        variant="danger"
        onClick={() => onDelete(task.id)}
        type="button"
        disabled={disabled}
      >
        Delete
      </Button>
    </li>
  );
});

export default TaskItem;
