import { API_URL, REQUEST_TIMEOUT_MS } from "@/config";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Thin fetch wrapper used by every Redux thunk.
 * Backend responds with { success, message, data } — this returns `data` when present.
 */
export async function apiRequest(path, { method = "GET", body, params, headers, signal } = {}) {
  const url = new URL(API_URL + path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  signal?.addEventListener("abort", () => controller.abort());

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || json?.success === false) {
      throw new ApiError(json?.message || `Request failed (${res.status})`, res.status, json);
    }
    return json?.data ?? json;
  } catch (err) {
    if (err.name === "AbortError") throw new ApiError("Request timed out", 408);
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiRequest(path, { ...options, method: "POST", body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};

// Shape errors for createAsyncThunk's rejectWithValue (must be serializable)
export const toRejectValue = (err) => ({
  message: err?.message || "Something went wrong",
  status: err?.status ?? null,
});
