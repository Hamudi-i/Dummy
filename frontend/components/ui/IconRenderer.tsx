"use client";

import React from "react";
import {
  Palette,
  Rocket,
  PenTool,
  BookOpen,
  Layers,
  Sparkles,
  Kanban,
  Zap,
  Brush,
  Compass,
  Layout,
  Shapes,
  FolderKanban,
  FileText,
  Briefcase,
  Cpu,
  Wand2,
} from "lucide-react";

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = "w-5 h-5",
}) => {
  switch (name.toLowerCase()) {
    case "palette":
    case "🎨":
      return <Palette className={className} />;
    case "rocket":
    case "🚀":
      return <Rocket className={className} />;
    case "pen-tool":
    case "pentool":
    case "✏️":
    case "🖋️":
      return <PenTool className={className} />;
    case "book-open":
    case "bookopen":
    case "📘":
      return <BookOpen className={className} />;
    case "layers":
    case "🦊":
      return <Layers className={className} />;
    case "kanban":
    case "folderkanban":
    case "📊":
      return <FolderKanban className={className} />;
    case "zap":
    case "⚡":
      return <Zap className={className} />;
    case "brush":
      return <Brush className={className} />;
    case "shapes":
      return <Shapes className={className} />;
    case "compass":
      return <Compass className={className} />;
    case "layout":
      return <Layout className={className} />;
    case "file-text":
    case "filetext":
      return <FileText className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "cpu":
      return <Cpu className={className} />;
    case "wand":
      return <Wand2 className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
