import { useMemo, useState } from "react";
import { useTelemetry } from "../telemetry/TelemetryProvider";

const severityStyles = {
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-700",
} as const;

export default function DiagnosticsPanel() {
  const { events, clearEvents, dismissEvent } = useTelemetry();
  const [open, setOpen] = useState(false);

  const summary = useMemo(() => {
    const errorCount = events.filter((event) => event.severity === "error").length;
    return {
      total: events.length,
      errorCount,
    };
  }, [events]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Diagnostics
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {summary.total} event{summary.total === 1 ? "" : "s"} · {summary.errorCount} error
            {summary.errorCount === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
        >
          {open ? "Hide" : "View"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-slate-500">No recent telemetry events.</p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`rounded-xl border px-3 py-3 text-xs ${
                  severityStyles[event.severity]
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                      {event.type}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {event.message}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissEvent(event.id)}
                    className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-700"
                  >
                    Dismiss
                  </button>
                </div>
                {event.details && (
                  <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 bg-white/70 px-2 py-2 text-[11px] text-slate-600">
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                )}
              </div>
            ))
          )}

          {events.length > 0 && (
            <button
              type="button"
              onClick={clearEvents}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-800"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
