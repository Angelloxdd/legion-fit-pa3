import type {
  AuthResponse,
  MessageResponse,
  TaskResponse,
  TasksResponse,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Revisa que el backend esté encendido.",
      0,
    );
  }

  const data = (await response.json()) as T & {
    message?: string;
  };

  if (!response.ok) {
    throw new ApiError(
      data.message ?? "Ocurrió un error en la solicitud.",
      response.status,
    );
  }

  return data;
}

export const api = {
  register(name: string, email: string, password: string) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getTasks(token: string) {
    return request<TasksResponse>("/tasks", {}, token);
  },

  createTask(
    token: string,
    title: string,
    description: string,
  ) {
    return request<TaskResponse>(
      "/tasks",
      {
        method: "POST",
        body: JSON.stringify({ title, description }),
      },
      token,
    );
  },

  deleteTask(token: string, id: string) {
    return request<MessageResponse>(
      `/tasks/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      token,
    );
  },
};