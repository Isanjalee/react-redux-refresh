import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { tasksApi } from "../features/tasks/tasksApi";
import tasksReducer from "../features/tasks/tasksSlice";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  [tasksApi.reducerPath]: tasksApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createAppStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tasksApi.middleware),
    devTools: import.meta.env.DEV
      ? {
          name: "React Redux Refresh - Day 9",
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
