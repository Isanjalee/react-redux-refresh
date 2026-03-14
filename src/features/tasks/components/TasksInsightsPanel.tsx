type Props = {
  total: number;
  active: number;
  completed: number;
  lastMutation: string | null;
  lastSyncedAt: number | null;
};

function StatTile({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold leading-none text-slate-900">
        {value}
      </p>
    </div>
  );
}

function InsightCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[180px] flex-col rounded-[26px] border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-200/70">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-700">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="mt-5 flex-1">{children}</div>
    </section>
  );
}

export default function TasksInsightsPanel({
  total,
  active,
  completed,
  lastMutation,
  lastSyncedAt,
}: Props) {
  return (
    <aside className="mt-6 px-1">
      <div className="grid gap-4 lg:grid-cols-3">
        <InsightCard eyebrow="Workspace" title="Task stats">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            <StatTile label="Total" value={total} />
            <StatTile label="Active" value={active} />
            <StatTile label="Completed" value={completed} />
          </div>
        </InsightCard>

        <InsightCard eyebrow="Mutation" title="Latest activity">
          <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm leading-6 text-slate-600">
              {lastMutation
                ? "The most recent task action has been recorded below."
                : "No mutations have been recorded in this session yet."}
            </p>
            <p className="mt-4 text-base font-semibold text-slate-900">
              {lastMutation ? (
                <>
                  Last mutation: <b>{lastMutation}</b>
                </>
              ) : (
                "Waiting for the first change"
              )}
            </p>
          </div>
        </InsightCard>

        <InsightCard eyebrow="Sync" title="Persistence status">
          <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm leading-6 text-slate-600">
              {lastSyncedAt
                ? "The local persistence layer completed its latest sync at the time below."
                : "The workspace is waiting for the first successful sync."}
            </p>
            <p className="mt-4 text-base font-semibold text-slate-900">
              {lastSyncedAt ? (
                <>
                  Last sync: <b>{new Date(lastSyncedAt).toLocaleTimeString()}</b>
                </>
              ) : (
                "Sync pending"
              )}
            </p>
          </div>
        </InsightCard>
      </div>
    </aside>
  );
}
