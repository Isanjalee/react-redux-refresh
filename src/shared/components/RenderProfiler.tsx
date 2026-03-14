import { Profiler } from "react";
import type { ProfilerOnRenderCallback, ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
};

function isProfilingEnabled() {
  return import.meta.env.DEV && import.meta.env.MODE !== "test";
}

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  if (!isProfilingEnabled()) {
    return;
  }

  console.info(
    `[Profiler] ${id} ${phase} | actual ${actualDuration.toFixed(2)}ms | base ${baseDuration.toFixed(2)}ms | start ${startTime.toFixed(2)} | commit ${commitTime.toFixed(2)}`,
  );
};

export default function RenderProfiler({ id, children }: Props) {
  if (!isProfilingEnabled()) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
}
