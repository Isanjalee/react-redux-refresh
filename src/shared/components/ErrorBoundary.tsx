import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useTelemetry } from "../telemetry/TelemetryProvider";

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-10 text-center"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-red-700">
              Something went wrong
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              We hit an unexpected error
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              {this.state.error?.message ?? "Please reload the page and try again."}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reload app
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const { logEvent } = useTelemetry();

  return (
    <ErrorBoundaryBase
      fallback={fallback}
      onError={(error, info) => {
        logEvent({
          type: "ui.error_boundary",
          message: error.message,
          severity: "error",
          source: "ErrorBoundary",
          details: { stack: error.stack, componentStack: info.componentStack },
        });
      }}
    >
      {children}
    </ErrorBoundaryBase>
  );
}
