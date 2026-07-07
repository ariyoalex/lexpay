const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

type RefreshCallback = () => Promise<string | null>;

let onRefreshFailed: (() => void) | null = null;
let refreshHandler: RefreshCallback | null = null;

export function setRefreshHandler(handler: RefreshCallback) {
  refreshHandler = handler;
}

export function setOnRefreshFailed(callback: () => void) {
  onRefreshFailed = callback;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

async function tryRefresh(): Promise<string | null> {
  if (!refreshHandler) return null;
  return refreshHandler();
}

export async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && token) {
    const newToken = await tryRefresh();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      onRefreshFailed?.();
      throw new ApiError("Unauthorized", 401);
    }
  }

  if (!res.ok) {
    let errorData: any;
    try {
      errorData = await res.json();
    } catch {
      errorData = { message: res.statusText };
    }
    throw new ApiError(errorData?.message || res.statusText, res.status, errorData);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export function get<T = any>(endpoint: string, params?: Record<string, string>) {
  const searchParams = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<T>(`${endpoint}${searchParams}`, { method: "GET" });
}

export function post<T = any>(endpoint: string, body?: any) {
  return request<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function put<T = any>(endpoint: string, body?: any) {
  return request<T>(endpoint, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function del<T = any>(endpoint: string) {
  return request<T>(endpoint, { method: "DELETE" });
}
