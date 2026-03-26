import { Outlet } from "react-router-dom";
import AppShell from "../shared/components/AppShell";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import { TelemetryProvider } from "../shared/telemetry/TelemetryProvider";

export default function App() {
  return (
    <TelemetryProvider>
      <AppShell>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </AppShell>
    </TelemetryProvider>
  );
}
