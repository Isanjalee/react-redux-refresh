import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type TelemetrySeverity = "info" | "warning" | "error";

export type TelemetryEvent = {
  id: string;
  type: string;
  message: string;
  severity: TelemetrySeverity;
  source?: string;
  timestamp: number;
  details?: Record<string, unknown>;
};

type TelemetryContextValue = {
  events: TelemetryEvent[];
  logEvent: (event: Omit<TelemetryEvent, "id" | "timestamp">) => void;
  clearEvents: () => void;
  dismissEvent: (id: string) => void;
};

const TelemetryContext = createContext<TelemetryContextValue | undefined>(
  undefined,
);

function createTelemetryEvent(
  event: Omit<TelemetryEvent, "id" | "timestamp">,
): TelemetryEvent {
  return {
    ...event,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}

export function TelemetryProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);

  const logEvent = useCallback(
    (event: Omit<TelemetryEvent, "id" | "timestamp">) => {
      setEvents((current) => {
        const next = [createTelemetryEvent(event), ...current];
        return next.slice(0, 25);
      });
    },
    [],
  );

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const dismissEvent = useCallback((id: string) => {
    setEvents((current) => current.filter((event) => event.id !== id));
  }, []);

  const value = useMemo(
    () => ({ events, logEvent, clearEvents, dismissEvent }),
    [events, logEvent, clearEvents, dismissEvent],
  );

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within TelemetryProvider");
  }

  return context;
}
