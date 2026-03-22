import Button from "../../../shared/components/Button";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
};

export default function TasksPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  isFetching = false,
  onPageChange,
}: Props) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Pagination
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {totalItems === 0
              ? "No matching tasks in this query yet."
              : `Showing ${start}-${end} of ${totalItems} matching tasks.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isFetching}
          >
            Previous
          </Button>
          <div className="min-w-[120px] text-center text-sm font-medium text-slate-700">
            Page {page} of {totalPages}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
