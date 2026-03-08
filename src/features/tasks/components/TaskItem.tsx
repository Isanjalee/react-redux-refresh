import React from "react";
import Button from "../../../shared/components/Button";
import { useAppSelector } from "../../../app/hooks";
import { selectTaskById } from "../tasksSelectors";

type Props = {
  taskId: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
};

const TaskItem = React.memo(function TaskItem({
  taskId,
  onToggle,
  onDelete,
  disabled = false,
}: Props) {
  const task = useAppSelector((state) => selectTaskById(state, taskId));

  if (!task) {
    return null;
  }

  return (
    <li className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={disabled}
          onChange={() => onToggle(taskId)}
          className="h-4 w-4"
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
        onClick={() => onDelete(taskId)}
        type="button"
        disabled={disabled}
      >
        Delete
      </Button>
    </li>
  );
});

export default TaskItem;
