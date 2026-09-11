"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";

interface KeyboardShortcutsOptions {
  onOpenCreateNotebook?: () => void;
  onOpenShareModal?: () => void;
  onSaveNotebook?: () => void;
}

export function useKeyboardShortcuts(options?: KeyboardShortcutsOptions) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Avoid triggering when user is typing in form inputs, textareas, or contentEditable except inside editor for specific actions
      const target = e.target as HTMLElement;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Cmd/Ctrl + K -> Focus Search
      if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput =
          (document.getElementById("colab-top-search-input") as HTMLInputElement | null) ||
          document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        if (searchInput) {
          searchInput.focus();
          if (typeof searchInput.select === "function") {
            searchInput.select();
          }
        }
      }

      // Cmd/Ctrl + / -> Keyboard Shortcuts Help
      if (isCmdOrCtrl && (e.key === "/" || e.key === "?")) {
        e.preventDefault();
        router.push("/help");
        toast.info("Keyboard Shortcuts Help", {
          description: "Opened Help & Documentation page.",
        });
      }

      // Cmd/Ctrl + Shift + P -> Share Modal
      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "p") {
        e.preventDefault();
        if (options?.onOpenShareModal) {
          options.onOpenShareModal();
        } else {
          toast.info("Share Canvas", {
            description: "Opening workspace & canvas share link generator...",
          });
        }
      }

      // Cmd/Ctrl + N -> Create New Notebook / Sketch (unless inside input)
      if (isCmdOrCtrl && !isInput && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (options?.onOpenCreateNotebook) {
          options.onOpenCreateNotebook();
        } else {
          router.push("/notebooks");
          toast.info("New Sketch", {
            description: "Opening Notebooks workspace to create a new canvas.",
          });
        }
      }

      // Cmd/Ctrl + S -> Save Changes
      if (isCmdOrCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (options?.onSaveNotebook) {
          options.onSaveNotebook();
        } else {
          toast.success("Changes Saved", {
            description: "All workspace drafts and edits are up to date.",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, router]);
}
