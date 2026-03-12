import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

const rootReducer = combineReducers({
  tasks: tasksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: import.meta.env.DEV
      ? {
          name: "React Redux Refresh - Day 6",
          trace: true,
          traceLimit: 25,
        }
      : false,
  });
}

export const store = createAppStore();

// Types for TS
export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore["dispatch"];
