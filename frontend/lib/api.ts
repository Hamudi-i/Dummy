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
export interface ApiWorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
}
export interface ApiWorkspaceInvite {
  id: string;
  workspaceId: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  token: string;
  expiresAt: string;
  createdAt: string;
  invitedBy?: {
    id: string;
    name?: string | null;
    email: string;
  };
}

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
  getWorkspaceMembers: (workspaceId: string) => request<{ count: number; data: ApiWorkspaceMember[] }>(`/api/workspaces/${workspaceId}/members`).then((r) => r.data),
  addWorkspaceMember: (workspaceId: string, userId: string, role: "ADMIN" | "MEMBER" = "MEMBER") => request<ApiWorkspaceMember>(`/api/workspaces/${workspaceId}/members`, { method: "POST", body: JSON.stringify({ userId, role }) }),
  updateWorkspaceMemberRole: (workspaceId: string, userId: string, role: "ADMIN" | "MEMBER") => request<ApiWorkspaceMember>(`/api/workspaces/${workspaceId}/members/${userId}`, { method: "PUT", body: JSON.stringify({ role }) }),
  removeWorkspaceMember: (memberId: string) => request<{ message: string }>(`/api/workspaces/members/${memberId}`, { method: "DELETE" }),
  getWorkspaceInvites: (workspaceId: string) => request<ApiWorkspaceInvite[]>(`/api/${workspaceId}/invites`),
  createWorkspaceInvite: (workspaceId: string, email: string, role: "ADMIN" | "MEMBER" = "MEMBER") => request<ApiWorkspaceInvite>(`/api/${workspaceId}/invites`, { method: "POST", body: JSON.stringify({ email, role }) }),
  revokeWorkspaceInvite: (inviteId: string) => request<{ message: string }>(`/api/invites/${inviteId}`, { method: "DELETE" }),
};
