"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Collaboration from "@tiptap/extension-collaboration";
import { CollaborationCursor } from "./collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { EditorToolbar } from "./EditorToolbar";

interface TiptapCanvasProps {
  docId: string;
  initialContent?: string;
  isSaved: boolean;
  onSave: () => void;
  onExport: () => void;
  onShare: () => void;
  onContentChange: (content: string) => void;
  user?: {
    name: string;
    color: string;
    avatarUrl?: string | null;
  };
  token?: string;
  wsUrl?: string; // Hocuspocus WebSocket URL from backend
  onCollaboratorsChange?: (users: Array<{ name: string; color: string; avatarUrl?: string | null }>) => void;
}

export function TiptapCanvas({
  docId,
  initialContent = "",
  isSaved,
  onSave,
  onExport,
  onShare,
  onContentChange,
  user = { name: "Natty", color: "#2c5e91", avatarUrl: null },
  token,
  wsUrl,
  onCollaboratorsChange,
}: TiptapCanvasProps) {
  const isInitialSyncRef = React.useRef(true);

  // Maintain a persistent Yjs document for CRDT state
  const ydoc = useMemo(() => new Y.Doc(), [docId]);

  // Connect to Hocuspocus server when wsUrl and token are available
  const provider = useMemo(() => {
    if (!wsUrl || !token || typeof window === "undefined") return null;

    try {
      const p = new HocuspocusProvider({
        url: wsUrl,
        name: docId,
        document: ydoc,
        token,
        onAuthenticationFailed: (data) => {
          console.warn("[collaboration] Authentication failed:", data);
        },
      });
      return p;
    } catch (e) {
      console.warn("[collaboration] Provider init error:", e);
      return null;
    }
  }, [wsUrl, token, docId, ydoc]);

  useEffect(() => {
    return () => {
      provider?.destroy();
    };
  }, [provider]);

  // Update local awareness when user details (name, color, avatarUrl) change
  useEffect(() => {
    if (provider?.awareness && user) {
      provider.awareness.setLocalStateField("user", user);
    }
  }, [provider, user]);

  // Track live connected peers via Yjs awareness
  useEffect(() => {
    if (!provider || !provider.awareness) return;

    const awareness = provider.awareness;
    const handleAwareness = () => {
      const states = awareness.getStates();
      const userMap = new Map<string, { name: string; color: string; avatarUrl?: string | null }>();
      states.forEach((state) => {
        if (state.user?.name) {
          userMap.set(state.user.name, {
            name: state.user.name,
            color: state.user.color || "#2c5e91",
            avatarUrl: state.user.avatarUrl || null,
          });
        }
      });
      if (onCollaboratorsChange) {
        onCollaboratorsChange(Array.from(userMap.values()));
      }
    };

    awareness.on("change", handleAwareness);
    handleAwareness();

    return () => {
      awareness.off("change", handleAwareness);
    };
  }, [provider, onCollaboratorsChange]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          // Disable built-in undoRedo when Yjs collaboration provider is active
          undoRedo: provider ? false : undefined,
        }),
        Underline,
        Highlight.configure({
          multicolor: true,
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph", "image"],
        }),
        Image.configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            class:
              "max-w-[400px] sm:max-w-[480px] max-h-[360px] w-auto h-auto object-contain rounded-2xl border-2 border-[#30312C] shadow-[3.5px_3.5px_0px_#30312C] my-4 mx-auto block transition-all cursor-pointer hover:scale-[1.01] ProseMirror-selectednode:ring-4 ProseMirror-selectednode:ring-primary ProseMirror-selectednode:border-primary ProseMirror-selectednode:shadow-[5px_5px_0px_#30312C]",
          },
        }),
        ...(provider
          ? [
            Collaboration.configure({
              document: ydoc,
            }),
            CollaborationCursor.configure({
              provider,
              user: {
                name: user.name,
                color: user.color,
              },
            }),
          ]
          : []),
      ],
      content: provider ? undefined : initialContent,
      onUpdate: ({ editor, transaction }) => {
        // Ignore programmatic initial content loads or transactions without document changes
        if (isInitialSyncRef.current || !transaction.docChanged) return;
        const html = editor.getHTML();
        onContentChange(html);
      },
      editorProps: {
        attributes: {
          class:
            "prose max-w-none focus:outline-none min-h-[440px] text-[#30312C] font-body text-base leading-relaxed p-2",
        },
      },
    },
    [provider, docId, user?.name, user?.color]
  );

  // When collaborative provider syncs with Hocuspocus:
  // If the CRDT state is empty on server, seed with initialContent
  useEffect(() => {
    if (!provider || !editor) return;

    const handleSynced = () => {
      const fragment = ydoc.getXmlFragment("default");
      if (fragment.length === 0 && initialContent && editor.isEmpty) {
        isInitialSyncRef.current = true;
        editor.commands.setContent(initialContent);
        setTimeout(() => {
          isInitialSyncRef.current = false;
        }, 150);
      } else {
        isInitialSyncRef.current = false;
      }
    };

    if (provider.isSynced) {
      handleSynced();
    } else {
      provider.on("synced", handleSynced);
    }

    return () => {
      provider.off("synced", handleSynced);
    };
  }, [provider, editor, initialContent, ydoc]);

  // Fallback for non-collaborative local editing
  useEffect(() => {
    if (provider || !editor || !initialContent) return;
    if (editor.getHTML() !== initialContent && !editor.isFocused) {
      isInitialSyncRef.current = true;
      editor.commands.setContent(initialContent);
      const timer = setTimeout(() => {
        isInitialSyncRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    } else {
      isInitialSyncRef.current = false;
    }
  }, [provider, editor, initialContent]);

  return (
    <div className="w-full bg-white flex flex-col min-h-[720px] lg:min-h-[820px] rounded-tl-[60px] sm:rounded-tl-[80px] rounded-tr-[50px] sm:rounded-tr-[70px] rounded-br-[50px] sm:rounded-br-[70px] rounded-bl-[60px] sm:rounded-bl-[80px]">
      {/* Dynamic Toolbar */}
      <EditorToolbar
        editor={editor}
        isSaved={isSaved}
        onSave={onSave}
        onExport={onExport}
        onShare={onShare}
      />

      {/* Tiptap Rich Text Canvas Editor */}
      <div className="px-8 sm:px-12 pb-10 pt-6 flex-1 bg-white cursor-text rounded-b-[50px] sm:rounded-b-[70px]" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
