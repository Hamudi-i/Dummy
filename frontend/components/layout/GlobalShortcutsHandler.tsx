"use client";

import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export function GlobalShortcutsHandler() {
  useKeyboardShortcuts();
  return null;
}
