import React from "react";
import type { Task } from "../types";
import Button from "../../../shared/components/Button";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const TaskItem = React.memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: Props) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 hover:bg-gray-100 transition">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
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

      <Button variant="danger" onClick={() => onDelete(task.id)} type="button">
        Delete
      </Button>
    </li>
  );
});

export default TaskItem;
