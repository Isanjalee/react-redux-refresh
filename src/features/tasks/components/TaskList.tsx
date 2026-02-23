import type { Task } from "../types";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return <div className="empty">No tasks here. Add your first one ✨</div>;
  }

  return (
    <ul className="list" aria-label="Task list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}