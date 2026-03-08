export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export type TaskFilter = "all" | "active" | "completed";

export type TaskRequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type TaskMutationType =
  | "addTask"
  | "toggleTask"
  | "deleteTask"
  | "clearCompleted"
  | null;

export type TasksRequestMap = {
  fetch: TaskRequestStatus;
  mutate: TaskRequestStatus;
};

export type TasksErrorMap = {
  fetch: string | null;
  mutate: string | null;
};
