/**
 * API client — uses relative URLs so Vite proxies /api to Drupal.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = Array.isArray(body.errors) ? body.errors : [body.message ?? response.statusText];
    throw new ApiError(errors.join(" "), response.status, errors);
  }
  return body as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: { Accept: "application/json" },
  });
  return parseResponse<T>(response);
}

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return parseResponse<T>(response);
}

export async function apiPatch<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return parseResponse<T>(response);
}
