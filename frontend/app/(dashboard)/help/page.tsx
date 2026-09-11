"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  Keyboard,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Users,
  Send,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "getting-started" | "canvas" | "collaboration";
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "canvas",
    question: "How do drafts work in Co-Lab?",
    answer:
      "When editing a notebook canvas, any unsaved text or drawings automatically save into your Drafts vault (`/drafts`). Clicking 'Save Changes' in the document toolbar commits your edits and clears the unsaved status badge.",
  },
  {
    id: "faq-2",
    category: "collaboration",
    question: "How do I share a workspace or canvas with team members?",
    answer:
      "Click the 'Share' button on the document toolbar or notebook header. Enter the team member's email address or click 'Copy Link' to share full access with custom view or edit permissions.",
  },
  {
    id: "faq-3",
    category: "getting-started",
    question: "Can I restore archived workspaces and notebooks?",
    answer:
      "Yes! Navigate to the Archive page (`/archive`). From there you can search, filter, and click 'Restore' on any archived item to return it to your active workspace.",
  },
  {
    id: "faq-4",
    category: "collaboration",
    question: "What do the collaborator circles on the canvas mean?",
    answer:
      "The profile circles pushed to the right of your document canvas indicate online teammates currently viewing or editing the same notebook with live online status dots.",
  },
];

const SHORTCUTS = [
  { key: "Cmd / Ctrl + S", action: "Save changes to notebook" },
  { key: "Cmd / Ctrl + N", action: "Create a new sketch / notebook" },
  { key: "Cmd / Ctrl + Shift + P", action: "Open Share Modal" },
  { key: "Cmd / Ctrl + K", action: "Focus Quick Search input" },
  { key: "Cmd / Ctrl + B", action: "Toggle Bold text formatting" },
  { key: "Cmd / Ctrl + I", action: "Toggle Italic text formatting" },
  { key: "Cmd / Ctrl + U", action: "Toggle Underline text formatting" },
  { key: "Cmd / Ctrl + /", action: "Open Keyboard Shortcuts & Help" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");
  const [supportMessage, setSupportMessage] = useState("");

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error("Message Required", {
        description: "Please enter your message or feedback.",
      });
      return;
    }
    toast.success("Support Request Sent", {
      description: "Our studio team received your message and will respond shortly!",
    });
    setSupportMessage("");
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none pt-6 sm:pt-8 max-w-5xl mx-auto">
      {/* Header with BLUE SVG Underline */}
      <div className="space-y-3">
        <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
          <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
            <HelpCircle className="w-10 h-10 text-[#2c5e91]" />
            <span>Help & Documentation</span>
          </h1>
          {/* Blue Hand-Drawn Underline SVG */}
          <svg
            viewBox="0 0 240 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -bottom-2.5 left-0 w-full h-3.5 pointer-events-none z-0"
          >
            <line
              x1="2"
              y1="6"
              x2="238"
              y2="6"
              stroke="#2c5e91"
              strokeWidth="9"
              strokeLinecap="round"
              strokeOpacity="0.75"
            />
          </svg>
        </div>
        <p className="font-body text-sm text-[#737067] max-w-xl">
          Everything you need to master Co-Lab: guides, keyboard shortcuts, canvas tips, and studio support.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737067]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles or guides..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-[2px_2px_0px_#30312C]"
          />
        </div>

        <div className="flex items-center space-x-2">
          {[
            { id: "all", label: "All Topics" },
            { id: "getting-started", label: "Getting Started" },
            { id: "canvas", label: "Canvas & Drafts" },
            { id: "collaboration", label: "Team & Sharing" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#2c5e91] text-white shadow-[1.5px_1.5px_0px_#30312C]"
                  : "bg-white text-[#30312C] hover:bg-[#FAF7EE]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: FAQs & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: FAQ Accordion */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-header text-xl font-extrabold text-[#30312C] flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#2c5e91]" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-[28px] p-8 text-center text-[#737067] font-body text-xs">
                No help articles matching "{searchQuery}". Try a different keyword!
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="relative bg-white border-2 border-[#30312C] rounded-[24px] overflow-hidden shadow-[4px_4px_0px_#30312C] transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-5 text-left font-header font-bold text-sm text-[#30312C] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7EE]/60 transition-colors"
                    >
                      <span className="flex items-center space-x-2.5">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#737067] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#737067] shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-[#30312C]/10 bg-[#FAF7EE]/30 font-body text-xs text-[#55534c] leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Keyboard Shortcuts Card */}
        <div className="space-y-6">
          <div className="relative bg-[#FAF7EE] border-2 border-[#30312C] rounded-[32px] p-6 shadow-[5px_5px_0px_#30312C] space-y-4">
            {/* Top Tape Accent */}
            <div
              className="absolute -top-3 left-8 w-16 h-4 bg-white/70 border border-black/15 shadow-2xs pointer-events-none rounded-xs backdrop-blur-[0.5px]"
              style={{ transform: "rotate(-4deg)" }}
            />

            <h3 className="font-header text-lg font-extrabold text-[#30312C] flex items-center space-x-2 pt-1">
              <Keyboard className="w-5 h-5 text-[#2c5e91]" />
              <span>Keyboard Shortcuts</span>
            </h3>

            <div className="space-y-2.5">
              {SHORTCUTS.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between p-2.5 bg-white border border-[#30312C] rounded-xl shadow-2xs"
                >
                  <span className="font-body text-xs text-[#55534c]">
                    {s.action}
                  </span>
                  <code className="px-2 py-1 bg-[#FAF7EE] border border-[#30312C] rounded-md font-mono text-[11px] font-bold text-[#30312C] shadow-2xs shrink-0">
                    {s.key}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Contact / Ask Studio Support Form */}
      <div className="relative bg-white border-2 border-[#30312C] rounded-[36px] p-6 sm:p-8 shadow-[6px_6px_0px_#30312C] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#FAF7EE] rounded-2xl border border-[#30312C] shadow-[2px_2px_0px_#30312C]">
            <MessageSquare className="w-6 h-6 text-[#2c5e91]" />
          </div>
          <div>
            <h3 className="font-header text-xl font-extrabold text-[#30312C]">
              Need Additional Help?
            </h3>
            <p className="font-body text-xs text-[#737067]">
              Send a quick message to our studio support team and we will assist you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendSupport} className="space-y-4 pt-2">
          <textarea
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Describe your issue or feature request..."
            rows={3}
            className="w-full p-3 bg-[#FAF7EE] border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-10 px-5 bg-[#2c5e91] hover:brightness-105 text-white font-header font-bold text-xs rounded-xl border-1.5 border-[#30312C] shadow-[2px_2px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
