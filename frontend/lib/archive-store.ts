"use client";

export interface ArchivedItem {
  id: string;
  title: string;
  type: "workspace" | "notebook";
  icon?: string;
  description?: string;
  archivedAt: string;
  workspaceId?: string;
}

const STORAGE_KEY = "colab_archived_items";

const DEFAULT_ARCHIVED: ArchivedItem[] = [
  {
    id: "archived-1",
    title: "Legacy Brand System Q1",
    type: "workspace",
    icon: "Folder",
    description: "Former brand design system assets and initial wireframes.",
    archivedAt: "Archived 3 days ago",
  },
  {
    id: "archived-2",
    title: "Deprecating V1 APIs & Endpoints",
    type: "notebook",
    icon: "BookOpen",
    description: "Historical technical debt notes and v1 migration guide.",
    archivedAt: "Archived 1 week ago",
    workspaceId: "ws-design-system",
  },
];

export function getArchivedItems(): ArchivedItem[] {
  if (typeof window === "undefined") return DEFAULT_ARCHIVED;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARCHIVED));
      return DEFAULT_ARCHIVED;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_ARCHIVED;
  }
}

export function archiveItem(item: Omit<ArchivedItem, "archivedAt">) {
  if (typeof window === "undefined") return;
  const items = getArchivedItems();
  const newItem: ArchivedItem = {
    ...item,
    archivedAt: "Just now",
  };
  const updated = [newItem, ...items.filter((i) => i.id !== item.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function restoreItem(id: string): ArchivedItem | undefined {
  if (typeof window === "undefined") return;
  const items = getArchivedItems();
  const found = items.find((i) => i.id === id);
  const updated = items.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return found;
}

export function deleteArchivedItem(id: string) {
  if (typeof window === "undefined") return;
  const items = getArchivedItems();
  const updated = items.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
