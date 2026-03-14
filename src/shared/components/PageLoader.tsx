type Props = {
  label?: string;
};

export default function PageLoader({
  label = "Loading feature...",
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
          React Redux Refresh
        </p>
        <h2 className="mt-3 text-xl font-semibold text-gray-900">
          Preparing the next screen
        </h2>
        <p className="mt-2 text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}
