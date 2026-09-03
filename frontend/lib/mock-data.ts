export interface WorkspaceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  notebookCount: number;
  lastUpdated: string;
  badgeLabel: string;
  badgeStyle: string; // Tailwind class string for light transparent badge background & text color
  previewGradient: string; // Gradient style for the rectangular picture preview
  rotation?: string; // Slight random tilt class (e.g. -rotate-1.5, rotate-1)
}

export interface NotebookItem {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  icon: string;
  pageCount: number;
  lastEdited: string;
  status: "active" | "draft" | "archived";
}

export const INITIAL_WORKSPACES: WorkspaceItem[] = [
  {
    id: "ws-design-system",
    title: "Design System & UI",
    description: "Component libraries, brand color tokens, typography scales, and visual guidelines.",
    icon: "🎨",
    color: "#2c5e91",
    notebookCount: 3,
    lastUpdated: "2 hours ago",
    badgeLabel: "Design System",
    badgeStyle: "bg-[#2c5e91]/15 text-[#2c5e91] border-[#2c5e91]/30",
    previewGradient: "from-[#2c5e91]/20 via-[#fdd355]/20 to-[#FAF7EE]",
    rotation: "-rotate-1.5",
  },
  {
    id: "ws-product-roadmap",
    title: "Product Roadmap Q4",
    description: "Feature specs, user stories, Sprint planning canvases, and release milestones.",
    icon: "🚀",
    color: "#fdd355",
    notebookCount: 4,
    lastUpdated: "Yesterday",
    badgeLabel: "Roadmap",
    badgeStyle: "bg-[#fdd355]/30 text-[#856404] border-[#fdd355]/50",
    previewGradient: "from-[#fdd355]/30 via-[#e48358]/20 to-[#FAF7EE]",
    rotation: "rotate-1",
  },
  {
    id: "ws-creative-lab",
    title: "Creative Brainstorming",
    description: "Hand-drawn wireframes, mood boards, rapid prototypes, and team sketches.",
    icon: "✏️",
    color: "#e48358",
    notebookCount: 2,
    lastUpdated: "3 days ago",
    badgeLabel: "Creative Lab",
    badgeStyle: "bg-[#e48358]/15 text-[#c25a2e] border-[#e48358]/30",
    previewGradient: "from-[#e48358]/25 via-[#2c5e91]/15 to-[#FAF7EE]",
    rotation: "-rotate-1",
  },
];

export const INITIAL_NOTEBOOKS: NotebookItem[] = [
  {
    id: "nb-components",
    workspaceId: "ws-design-system",
    title: "Button & Modal Specifications",
    description: "Detailed hand-drawn specs for sketch borders, organic radii, and interaction states.",
    icon: "📘",
    pageCount: 12,
    lastEdited: "10 mins ago",
    status: "active",
  },
  {
    id: "nb-tokens",
    workspaceId: "ws-design-system",
    title: "Color Tokens & Typography",
    description: "Bricolage Grotesque and Be Vietnam Pro font hierarchy and CSS variable definitions.",
    icon: "🎨",
    pageCount: 6,
    lastEdited: "1 hour ago",
    status: "active",
  },
  {
    id: "nb-illustrations",
    workspaceId: "ws-design-system",
    title: "Mascots & Vector Assets",
    description: "Fox mascot illustrations, hand-drawn arrows, signs, and background patterns.",
    icon: "🦊",
    pageCount: 8,
    lastEdited: "Yesterday",
    status: "active",
  },
  {
    id: "nb-sprint-q4",
    workspaceId: "ws-product-roadmap",
    title: "Sprint 14 User Stories",
    description: "Collaborative whiteboard canvas for story points, user feedback, and blockers.",
    icon: "📊",
    pageCount: 15,
    lastEdited: "3 hours ago",
    status: "active",
  },
  {
    id: "nb-architecture",
    workspaceId: "ws-product-roadmap",
    title: "App Router Page Architecture",
    description: "Dynamic routing layout specs, Next.js server/client component boundaries.",
    icon: "⚡",
    pageCount: 5,
    lastEdited: "2 days ago",
    status: "active",
  },
  {
    id: "nb-[#30312C]-sketches",
    workspaceId: "ws-creative-lab",
    title: "Hand-Drawn Layout Exploration",
    description: "Organic sketch borders, hand-drawn signboards, and paper texture overlays.",
    icon: "🖋️",
    pageCount: 20,
    lastEdited: "Just now",
    status: "active",
  },
];
