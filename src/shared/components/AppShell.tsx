import type { PropsWithChildren } from "react";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/80 px-6 py-6 shadow-sm backdrop-blur-sm sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
                React Redux Refresh
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Day 7 Production Frontend Architecture
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                We are evolving the task app toward a larger-scale React setup with
                lazy delivery, feature-level routing, stronger boundaries, and
                performance-minded structure.
              </p>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-900 shadow-sm">
              <p className="font-semibold">Phase 3 focus</p>
              <p className="mt-1 text-teal-800">
                Shared route shell and reusable loading states
              </p>
            </div>
          </div>
        </header>

        <div className="rounded-[32px] border border-white/70 bg-white/88 shadow-xl shadow-slate-200/70 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
