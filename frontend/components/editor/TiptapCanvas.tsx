"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Underline from "@tiptap/extension-underline";
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
        // Disable built-in undoRedo since Yjs handles collaborative undo/redo
        undoRedo: false,
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      ...(provider
        ? [
            CollaborationCursor.configure({
              provider,
              user,
            }),
          ]
        : []),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
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
