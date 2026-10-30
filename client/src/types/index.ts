export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export type TaskStatus = "pending" | "completed";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  user: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
}

export interface TaskResponse {
  success: boolean;
  message: string;
  task: Task;
}

export interface MessageResponse {
  success: boolean;
  message: string;
}