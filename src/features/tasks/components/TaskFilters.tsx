import type { TaskFilter } from "../types";

type Props = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
};

const filters: { key: TaskFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function TaskFilters({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => {
        const active = value === f.key;

        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
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
