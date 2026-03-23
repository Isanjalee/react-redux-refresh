import { useMemo, useState } from "react";
import Button from "../../../shared/components/Button";
import { formatSchemaError } from "../../../shared/api/apiErrors";
import { safeParseTaskTitle } from "../taskSchemas";

type Props = {
  onAdd: (title: string) => void;
  disabled?: boolean;
};

export default function TaskForm({ onAdd, disabled = false }: Props) {
  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);

  const parsedTitle = useMemo(() => safeParseTaskTitle(title), [title]);
  const validationMessage =
    touched && !parsedTitle.success
      ? formatSchemaError(parsedTitle.error, "Task title is invalid")
      : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);

    if (!parsedTitle.success) {
      return;
    }

    onAdd(parsedTitle.data);
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
          disabled={disabled}
          placeholder="Add a task..."
          aria-invalid={Boolean(validationMessage)}
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
            validationMessage
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-black"
          }`}
        />

        {validationMessage && (
          <p className="mt-2 text-xs text-red-600">{validationMessage}</p>
        )}
      </div>

      <Button type="submit" disabled={disabled}>
        Add
      </Button>
    </form>
  );
}
