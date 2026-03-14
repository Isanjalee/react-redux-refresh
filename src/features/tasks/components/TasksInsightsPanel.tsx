type Props = {
  total: number;
  active: number;
  completed: number;
  lastMutation: string | null;
  lastSyncedAt: number | null;
};

export default function TasksInsightsPanel({
  total,
  active,
  completed,
  lastMutation,
  lastSyncedAt,
}: Props) {
  return (
    <aside className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm sm:grid-cols-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Workspace stats
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Total <b>{total}</b> | Active <b>{active}</b> | Completed <b>{completed}</b>
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Latest mutation
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {lastMutation ? (
            <>
              Last mutation: <b>{lastMutation}</b>
            </>
          ) : (
            "No mutations yet in this session."
          )}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
          Sync status
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {lastSyncedAt ? (
            <>
              Last sync: <b>{new Date(lastSyncedAt).toLocaleTimeString()}</b>
            </>
          ) : (
            "Waiting for the first successful sync."
          )}
        </p>
      </div>
    </aside>
  );
}
