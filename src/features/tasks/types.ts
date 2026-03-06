export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export type TaskFilter = "all" | "active" | "completed";

export type TaskRequestStatus = "idle" | "loading" | "succeeded" | "failed";
