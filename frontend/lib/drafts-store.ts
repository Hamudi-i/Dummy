export interface DraftItem {
  id: string;
  notebookId: string;
  workspaceId: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  lastEdited: string;
  isUnsaved: boolean;
}

const STORAGE_KEY = "colab_drafts";

export const getDrafts = (): DraftItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [
        {
          id: "draft-1",
          notebookId: "nb-components",
          workspaceId: "ws-design-system",
          title: "Button & Modal Specifications",
          description: "Unsaved modifications to sketch border rules and radius specs.",
          icon: "book-open",
          content: "📐 Component Specifications & Guidelines\n\n- Primary Accent: #fdd355\n- Brand Blue: #2c5e91\n- Border Rules: Solid 1.8px #30312C sketch borders\n- Typography: Bricolage Grotesque for headers and Be Vietnam Pro for body.",
          lastEdited: "5 mins ago",
          isUnsaved: true,
        },
        {
          id: "draft-2",
          notebookId: "nb-tokens",
          workspaceId: "ws-design-system",
          title: "Color Tokens & Typography Draft",
          description: "Preliminary ideas for dark mode brand accent colors.",
          icon: "palette",
          content: "🎨 Color Token Ideas:\n- Brand Yellow: #fdd355\n- Primary Blue: #2c5e91\n- Dark Sketch Border: #30312C\nDrafting revised contrast guidelines for dark mode themes.",
          lastEdited: "15 mins ago",
          isUnsaved: true,
        },
        {
          id: "draft-3",
          notebookId: "nb-sprint14",
          workspaceId: "ws-product-roadmap",
          title: "Sprint 14 Retrospective & Q4 Milestones",
          description: "WIP discussion points and action items for team review.",
          icon: "layout",
          content: "🚀 Sprint 14 Retrospective:\n1. Improved canvas toolbar latency by 40%\n2. Fixed TipTap mark toggling on empty selections\n3. Need to finalize collaborative cursor color palette.",
          lastEdited: "32 mins ago",
          isUnsaved: true,
        },
        {
          id: "draft-4",
          notebookId: "nb-ai-spec",
          workspaceId: "ws-mobile-v2",
          title: "AI Co-pilot Integration Architecture",
          description: "Drafting WebSocket payload structure for real-time AI suggestions.",
          icon: "sparkles",
          content: "🤖 AI Assistant Spec:\nImplement streaming completion handler over WebSocket with instant canvas block insertion and inline prompt triggers.",
          lastEdited: "1 hour ago",
          isUnsaved: true,
        },
      ];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const saveDraft = (draft: DraftItem) => {
  if (typeof window === "undefined") return;
  const drafts = getDrafts();
  const index = drafts.findIndex((d) => d.notebookId === draft.notebookId);
  if (index >= 0) {
    drafts[index] = draft;
  } else {
    drafts.unshift(draft);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export const removeDraft = (notebookId: string) => {
  if (typeof window === "undefined") return;
  const drafts = getDrafts().filter((d) => d.notebookId !== notebookId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

const SAVED_NOTEBOOKS_PREFIX = "colab_saved_notebook_";

export const getSavedNotebookContent = (notebookId: string, defaultContent: string): string => {
  if (typeof window === "undefined") return defaultContent;
  try {
    const saved = localStorage.getItem(`${SAVED_NOTEBOOKS_PREFIX}${notebookId}`);
    return saved !== null ? saved : defaultContent;
  } catch (e) {
    return defaultContent;
  }
};

export const saveNotebookContent = (notebookId: string, content: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${SAVED_NOTEBOOKS_PREFIX}${notebookId}`, content);
  } catch (e) {
    console.error("Failed to save notebook content", e);
  }
};
