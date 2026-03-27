import type { TaskFilter } from "../types";

type Props = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
  disabled?: boolean;
};

const filters: { key: TaskFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function TaskFilters({
  value,
  onChange,
  disabled = false,
}: Props) {
  return (
    <div className="flex gap-2" role="group" aria-label="Task filters">
      {filters.map((f) => {
        const active = value === f.key;

        return (
          <button
            key={f.key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(f.key)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
