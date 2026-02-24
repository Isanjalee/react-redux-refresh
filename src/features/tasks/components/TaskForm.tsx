import { useState } from "react";
import Button from "../../../shared/components/Button";

type Props = {
  onAdd: (title: string) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = title.trim();
  const showError = touched && trimmed.length === 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!trimmed) return;

    onAdd(trimmed);
    setTitle("");
    setTouched(false);
  }

  return (
    <form onSubmit={submit} className="flex gap-3">
      <div className="flex-1">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Add a task..."
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            showError
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-black"
          }`}
        />

        {showError && (
          <p className="mt-2 text-xs text-red-600">
            Task title cannot be empty
          </p>
        )}
      </div>

      <Button type="submit">Add</Button>
    </form>
  );
}
