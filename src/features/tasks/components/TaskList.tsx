import TaskItem from "./TaskItem";

type Props = {
  taskIds: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
};

export default function TaskList({
  taskIds,
  onToggle,
  onDelete,
  disabled = false,
}: Props) {
  if (taskIds.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
        No tasks here. Add your first one.
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Task list">
      {taskIds.map((taskId) => (
        <TaskItem
          key={taskId}
          taskId={taskId}
          onToggle={onToggle}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </ul>
  );
}
