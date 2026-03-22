export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export type TaskFilter = "all" | "active" | "completed";

export type TaskListQuery = {
  page: number;
  pageSize: number;
  search: string;
  filter: TaskFilter;
};

export type TaskCounts = {
  total: number;
  active: number;
  completed: number;
};

export type TaskPage = {
  items: Task[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  filter: TaskFilter;
  search: string;
  counts: TaskCounts;
};

export type TaskRequestStatus = "idle" | "loading" | "succeeded" | "failed";

export type TaskMutationType =
  | "addTask"
  | "toggleTask"
  | "deleteTask"
  | "clearCompleted"
  | null;

export type TasksRequestMap = {
  mutate: TaskRequestStatus;
};

export type TasksErrorMap = {
  mutate: string | null;
};
