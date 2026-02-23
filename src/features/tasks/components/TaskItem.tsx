import classNames from "classnames";
import type { Task } from "../types";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className="item">
      <label className="item-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark ${task.title} as ${task.completed ? "not completed" : "completed"}`}
        />
        <span className={classNames("item-title", task.completed && "item-done")}>
          {task.title}
        </span>
      </label>

      <button className="btn btn-danger" onClick={() => onDelete(task.id)} type="button">
        Delete
      </button>
    </li>
  );
}