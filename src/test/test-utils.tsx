import type { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { createAppStore } from "../app/store";
import type { AppStore, RootState } from "../app/store";
import { TelemetryProvider } from "../shared/telemetry/TelemetryProvider";

type RenderOptions = {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  route?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createAppStore(preloadedState),
    route = "/tasks",
  }: RenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <TelemetryProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </TelemetryProvider>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper }),
  };
}
