import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import ErrorBoundary from "./ErrorBoundary";
import { TelemetryProvider, useTelemetry } from "../telemetry/TelemetryProvider";

function Boom(): ReactElement {
  throw new Error("Boom goes the render");
}

function TelemetrySpy() {
  const { events } = useTelemetry();
  return <div>events:{events.length}</div>;
}

describe("ErrorBoundary", () => {
  it("captures render errors and logs telemetry", async () => {
    render(
      <TelemetryProvider>
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
        <TelemetrySpy />
      </TelemetryProvider>,
    );

    expect(await screen.findByText("We hit an unexpected error")).toBeInTheDocument();
    expect(screen.getByText("events:1")).toBeInTheDocument();
  });
});




