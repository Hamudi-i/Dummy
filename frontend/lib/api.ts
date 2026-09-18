const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
  return response;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithAuth(endpoint, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "The request could not be completed.");
  return body as T;
}

export interface ApiWorkspace { id: string; name: string; slug: string; description?: string | null; createdAt?: string; updatedAt?: string; documents?: ApiDocument[] }
export interface ApiDocument { id: string; workspaceId?: string; title: string; icon?: string | null; description?: string | null; pageCount?: number; status?: string; sortOrder?: number; plainText?: string | null; isArchived?: boolean; updatedAt?: string }
export interface ApiDocumentDraft { id: string; documentId: string; content: string; isUnsaved: boolean; createdAt: string; updatedAt: string }

export const api = {
  getWorkspaces: () => request<{ data: ApiWorkspace[] }>("/api/workspaces").then((r) => r.data),
  getWorkspace: (id: string) => request<ApiWorkspace>(`/api/workspaces/${id}`),
  createWorkspace: (data: Pick<ApiWorkspace, "name"> & Partial<ApiWorkspace>) => request<ApiWorkspace>("/api/workspaces", { method: "POST", body: JSON.stringify(data) }),
  updateWorkspace: (id: string, data: Partial<ApiWorkspace>) => request<ApiWorkspace>(`/api/workspaces/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteWorkspace: (id: string) => request<void>(`/api/workspaces/${id}`, { method: "DELETE" }),
  getDocuments: (workspaceId: string) => request<ApiDocument[]>(`/api/workspaces/${workspaceId}/documents`),
  getDocument: (id: string) => request<ApiDocument>(`/api/documents/${id}`),
  createDocument: (workspaceId: string, data: Pick<ApiDocument, "title"> & Partial<ApiDocument>) => request<ApiDocument>(`/api/workspaces/${workspaceId}/documents`, { method: "POST", body: JSON.stringify(data) }),
  updateDocument: (id: string, data: Partial<Pick<ApiDocument, "title" | "icon" | "plainText" | "description" | "pageCount" | "status" | "sortOrder">>) => request<ApiDocument>(`/api/documents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  archiveDocument: (id: string) => request<ApiDocument>(`/api/documents/${id}/archive`, { method: "PATCH" }),
  restoreDocument: (id: string) => request<ApiDocument>(`/api/documents/${id}/unarchive`, { method: "PATCH" }),
  deleteDocument: (id: string) => request<void>(`/api/documents/${id}`, { method: "DELETE" }),
  getDocumentDraft: (id: string) => request<ApiDocumentDraft>(`/api/documents/${id}/draft`),
  saveDocumentDraft: (id: string, content: string, isUnsaved = true) => request<ApiDocumentDraft>(`/api/documents/${id}/draft`, { method: "PUT", body: JSON.stringify({ content, isUnsaved }) }),
  deleteDocumentDraft: (id: string) => request<void>(`/api/documents/${id}/draft`, { method: "DELETE" }),
};
