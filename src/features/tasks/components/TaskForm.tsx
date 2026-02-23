import { useState } from "react";

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
    <form className="row" onSubmit={submit}>
      <div className="field">
        <input
          className={`input ${showError ? "input-error" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Add a task (e.g., Revise useEffect)"
          aria-label="Task title"
        />
        {showError && <div className="error">Task title cannot be empty.</div>}
      </div>

      <button className="btn" type="submit">
        Add
      </button>
    </form>
  );
}