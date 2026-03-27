import React, { useId } from "react";
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
  const checkboxId = useId();
  const labelId = `${checkboxId}-label`;

  return (
    <li className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={task.completed}
          disabled={disabled}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4"
          aria-labelledby={labelId}
        />

        <label
          id={labelId}
          htmlFor={checkboxId}
          className={`cursor-pointer text-sm ${
            task.completed ? "line-through text-gray-500" : "text-gray-900"
          }`}
        >
          {task.title}
        </label>
      </div>

      <Button
        variant="danger"
        onClick={() => onDelete(task.id)}
        type="button"
        disabled={disabled}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </Button>
    </li>
  );
});

export default TaskItem;
