import TaskFilters from "./TaskFilters";
import Button from "../../../shared/components/Button";
import type { TaskFilter } from "../types";

type Props = {
  filter: TaskFilter;
  search: string;
  isBusy?: boolean;
  onFilterChange: (filter: TaskFilter) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
};

export default function TasksQueryToolbar({
  filter,
  search,
  isBusy = false,
  onFilterChange,
  onSearchChange,
  onReset,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Query controls
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Search tasks</span>
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by title..."
                disabled={isBusy}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-700"
              />
            </label>

            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                onClick={onReset}
                disabled={isBusy && !search && filter === "all"}
              >
                Reset query
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:min-w-[320px]">
          <p className="text-sm font-medium text-slate-700">Filter tasks</p>
          <div className="mt-2">
            <TaskFilters
              value={filter}
              onChange={onFilterChange}
              disabled={isBusy}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
