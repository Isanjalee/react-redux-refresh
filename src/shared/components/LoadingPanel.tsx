type Props = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function LoadingPanel({
  title = "Loading",
  description = "Please wait while we prepare this view.",
  compact = false,
}: Props) {
  return (
    <div
      className={`rounded-3xl border border-dashed border-slate-300 bg-slate-50/90 text-center ${
        compact ? "px-4 py-8" : "px-6 py-12"
      }`}
    >
      <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-700 shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-teal-500" />
        Loading
      </div>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}
