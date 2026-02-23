import classNames from "classnames";
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
    <div className="filters" role="tablist" aria-label="Task filters">
      {filters.map((f) => (
        <button
          key={f.key}
          type="button"
          className={classNames("chip", value === f.key && "chip-active")}
          onClick={() => onChange(f.key)}
          role="tab"
          aria-selected={value === f.key}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}