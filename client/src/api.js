const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: { ...JSON_HEADERS, ...(options.headers || {}) },
    ...options
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMessage = payload?.message || "Request failed.";
    throw new Error(errorMessage);
  }

  return payload;
}

export function login(credentials) {
  return request("/api/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function register(payload) {
  return request("/api/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return request("/api/logout", { method: "POST" });
}

export function getCurrentUser() {
  return request("/api/session");
}

export function listTodos() {
  return request("/api/todos");
}

export function createTodo(payload) {
  return request("/api/todos", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function toggleTodo(id) {
  return request(`/api/todos/${id}/toggle`, { method: "PATCH" });
}

export function removeTodo(id) {
  return request(`/api/todos/${id}`, { method: "DELETE" });
}
