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
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
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
  };
  wsUrl?: string; // Optional Hocuspocus WebSocket URL from backend
}

export function TiptapCanvas({
  docId,
  initialContent = "",
  isSaved,
  onSave,
  onExport,
  onShare,
  onContentChange,
  user = { name: "Natty", color: "#2c5e91" },
  wsUrl,
}: TiptapCanvasProps) {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const isInitialSyncRef = React.useRef(true);

  // Maintain a persistent Yjs document for CRDT state
  const ydoc = useMemo(() => new Y.Doc(), [docId]);

  // Connect to Hocuspocus server when wsUrl is provided by backend
  useEffect(() => {
    if (!wsUrl) return;

    const hocuspocusProvider = new HocuspocusProvider({
      url: wsUrl,
      name: docId,
      document: ydoc,
    });

    setProvider(hocuspocusProvider);

    return () => {
      hocuspocusProvider.destroy();
    };
  }, [wsUrl, docId, ydoc]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable built-in undoRedo only when Yjs provider is active
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
              user,
            }),
          ]
        : []),
    ],
    content: initialContent,
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
  });

  // Keep TipTap canvas content synced when draft or saved content is loaded
  useEffect(() => {
    if (!editor || !initialContent) return;
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
  }, [editor, initialContent]);

  return (
    <div className="w-full bg-white flex flex-col min-h-[720px] lg:min-h-[820px]">
      {/* Dynamic Toolbar */}
      <EditorToolbar
        editor={editor}
        isSaved={isSaved}
        onSave={onSave}
        onExport={onExport}
        onShare={onShare}
      />

      {/* Inset Dashed Divider Line */}
      <div className="px-6 sm:px-10">
        <div className="border-b-2 border-dashed border-[#30312C]/20 w-full" />
      </div>

      {/* Tiptap Rich Text Canvas Editor */}
      <div className="px-6 sm:px-10 pb-10 pt-5 flex-1 bg-white cursor-text" onClick={() => editor?.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
