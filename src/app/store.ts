import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  devTools: import.meta.env.DEV
    ? {
        name: "React Redux Refresh - Day 5",
        trace: true,
        traceLimit: 25,
      }
    : false,
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
