"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useParams } from "next/navigation";
import { INITIAL_WORKSPACES, INITIAL_NOTEBOOKS } from "@/lib/mock-data";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { saveDraft, removeDraft, getDrafts, getSavedNotebookContent, saveNotebookContent } from "@/lib/drafts-store";
import { api, ApiWorkspaceMember, ApiWorkspaceInvite } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { TiptapCanvas } from "@/components/editor/TiptapCanvas";
import {
  Eye,
  Pencil,
  CheckCircle2,
  Link as LinkIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const AVATAR_COLORS = [
  "bg-[#2c5e91] text-white",
  "bg-[#fdd355] text-[#30312C]",
  "bg-emerald-500 text-white",
  "bg-purple-600 text-white",
  "bg-rose-500 text-white",
];

export default function NotebookEditorPage() {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) || "ws-design-system";
  const notebookId = (params?.notebookId as string) || "nb-components";

  const fallbackWorkspace =
    INITIAL_WORKSPACES.find((w) => w.id === workspaceId) || INITIAL_WORKSPACES[0];
  const fallbackNotebook =
    INITIAL_NOTEBOOKS.find((n) => n.id === notebookId) || INITIAL_NOTEBOOKS[0];

  const [workspaceTitle, setWorkspaceTitle] = useState(fallbackWorkspace.title);
  const [notebookTitle, setNotebookTitle] = useState(fallbackNotebook.title);
  const [notebookDesc, setNotebookDesc] = useState(fallbackNotebook.description);
  const [notebookIcon, setNotebookIcon] = useState(fallbackNotebook.icon);

  const DEFAULT_NOTEBOOK_CONTENT =
    notebookId === "nb-components"
      ? "<h1>📐 Component Specifications & Guidelines</h1><ul><li><strong>Primary Accent:</strong> #fdd355</li><li><strong>Brand Blue:</strong> #2c5e91</li><li><strong>Border Rules:</strong> Solid 1.8px #30312C sketch borders</li><li><strong>Typography:</strong> Bricolage Grotesque for headers and Be Vietnam Pro for body.</li></ul><p>Type here to start editing your notebook canvas...</p>"
      : `<h1>${fallbackNotebook.title}</h1><p><em>${fallbackNotebook.description}</em></p><hr /><p>Type here to start editing your notebook canvas...</p>`;

  const [content, setContent] = useState(DEFAULT_NOTEBOOK_CONTENT);
  const [isSaved, setIsSaved] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [members, setMembers] = useState<ApiWorkspaceMember[]>([]);
  const [invites, setInvites] = useState<ApiWorkspaceInvite[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Current logged in user & token for WebSockets
  const [currentUserId, setCurrentUserId] = useState("");
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<{ name: string; color: string }>({
    name: "You",
    color: "#2c5e91",
  });
  const [liveCollaborators, setLiveCollaborators] = useState<Array<{ name: string; color: string }>>([]);

  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    (process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL.replace(/^http/, "ws").replace(/\/$/, "")}/collaboration`
      : "ws://localhost:5000/collaboration");

  useEffect(() => {
    try {
      const t = localStorage.getItem("accessToken") || "";
      setToken(t);

      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id || parsed.userId) {
          setCurrentUserId(parsed.id || parsed.userId);
        }
        const name = parsed.name || parsed.email?.split("@")[0] || "Collaborator";
        const charSum = (parsed.id || parsed.email || name)
          .split("")
          .reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
        const colorPalette = ["#2c5e91", "#e48358", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"];
        setCurrentUser({
          name,
          color: colorPalette[charSum % colorPalette.length],
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const loadMembersAndInvites = useCallback(async () => {
    try {
      const [membersRes, invitesRes] = await Promise.allSettled([
        api.getWorkspaceMembers(workspaceId),
        api.getWorkspaceInvites(workspaceId),
      ]);
      if (membersRes.status === "fulfilled" && Array.isArray(membersRes.value)) {
        setMembers(membersRes.value);
      }
      if (invitesRes.status === "fulfilled" && Array.isArray(invitesRes.value)) {
        setInvites(invitesRes.value);
      }
    } catch {
      // background fetch fail ignored
    }
  }, [workspaceId]);

  useEffect(() => {
    setMounted(true);

    // 1. Fetch workspace details
    api.getWorkspace(workspaceId).then((ws) => {
      if (ws?.name) setWorkspaceTitle(ws.name);
    }).catch(() => {
      // fallback
    });

    // 2. Fetch document details
    api.getDocument(notebookId).then((doc) => {
      if (doc?.title) setNotebookTitle(doc.title);
      if (doc?.description) setNotebookDesc(doc.description);
      if (doc?.icon) setNotebookIcon(doc.icon);

      // Check unsaved draft first
      const existingDrafts = getDrafts();
      const activeDraft = existingDrafts.find((d) => d.notebookId === notebookId);
      if (activeDraft && activeDraft.content) {
        setContent(activeDraft.content);
        setIsSaved(false);
      } else if (doc?.plainText) {
        setContent(doc.plainText);
        setIsSaved(true);
      } else {
        const saved = getSavedNotebookContent(notebookId, DEFAULT_NOTEBOOK_CONTENT);
        setContent(saved);
        setIsSaved(true);
      }
    }).catch(() => {
      const existingDrafts = getDrafts();
      const activeDraft = existingDrafts.find((d) => d.notebookId === notebookId);
      if (activeDraft && activeDraft.content) {
        setContent(activeDraft.content);
        setIsSaved(false);
      } else {
        const saved = getSavedNotebookContent(notebookId, DEFAULT_NOTEBOOK_CONTENT);
        setContent(saved);
        setIsSaved(true);
      }
    });

    // 3. Load workspace members & invites
    loadMembersAndInvites();
  }, [workspaceId, notebookId, DEFAULT_NOTEBOOK_CONTENT, loadMembersAndInvites]);

  const handleContentChange = (newHtml: string) => {
    setContent(newHtml);
    setIsSaved(false);
    saveDraft({
      id: `draft-${notebookId}`,
      notebookId,
      workspaceId,
      title: notebookTitle,
      description: notebookDesc,
      icon: notebookIcon,
      content: newHtml,
      lastEdited: "Just now",
      isUnsaved: true,
    });
  };

  const handleSave = async () => {
    try {
      await api.updateDocument(notebookId, { plainText: content });
    } catch (error) {
      toast.error("Notebook was not saved", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      return;
    }
    setIsSaved(true);
    saveNotebookContent(notebookId, content);
    removeDraft(notebookId);
    toast.success("Notebook Saved!", {
      description: `Changes saved to "${notebookTitle}".`,
    });
  };

  const handleSendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Email Required", {
        description: "Please enter an email address to send an invitation.",
      });
      return;
    }
    setIsInviting(true);
    try {
      await api.createWorkspaceInvite(workspaceId, email, "MEMBER");
      toast.success("Invite Dispatched", {
        description: `Invitation sent to ${email}`,
      });
      setInviteEmail("");
      await loadMembersAndInvites();
    } catch (error: any) {
      toast.error("Invite Failed", {
        description: error?.message || "Unable to send invite. Please try again.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (member: ApiWorkspaceMember, newRole: string) => {
    const memberName = member.user.name || member.user.email;
    try {
      if (newRole === "remove") {
        await api.removeWorkspaceMember(member.id);
        toast.success("Member Removed", {
          description: `${memberName} was removed from the workspace.`,
        });
      } else {
        await api.updateWorkspaceMemberRole(workspaceId, member.userId, newRole as "ADMIN" | "MEMBER");
        toast.success("Role Updated", {
          description: `Updated role for ${memberName}.`,
        });
      }
      await loadMembersAndInvites();
    } catch (error: any) {
      toast.error("Action Failed", {
        description: error?.message || "Could not update member",
      });
    }
  };

  const handleRevokeInvite = async (inviteId: string, email: string) => {
    try {
      await api.revokeWorkspaceInvite(inviteId);
      toast.success("Invite Revoked", {
        description: `Invitation for ${email} was revoked.`,
      });
      await loadMembersAndInvites();
    } catch (error: any) {
      toast.error("Revoke Failed", {
        description: error?.message || "Could not revoke invitation",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn select-none pt-6 sm:pt-8">
      {/* Breadcrumbs & Header Section */}
      <div className="space-y-3">
        {/* Breadcrumb Trail */}
        <div className="flex items-center space-x-2 text-xs font-body text-[#737067]">
          <Link href="/workspace" className="hover:text-primary transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <Link
            href={`/workspace/${workspaceId}`}
            className="hover:text-primary transition-colors"
          >
            {workspaceTitle}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#30312C]">{notebookTitle}</span>
        </div>

        {/* Title Header with SVG Underline & Collaborator Profile Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
            <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
              <span className="text-[#30312C]">
                <IconRenderer name={notebookIcon} className="w-9 h-9 text-[#30312C]" />
              </span>
              <span>{notebookTitle}</span>
              {!isSaved && (
                <span className="px-2.5 py-0.5 text-[11px] font-header font-bold text-amber-900 bg-amber-100 border border-amber-400 rounded-full flex items-center space-x-1 translate-y-0.5">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Unsaved Draft</span>
                </span>
              )}
            </h1>
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
                stroke="#fdd355"
                strokeWidth="9"
                strokeLinecap="round"
                strokeOpacity="0.65"
              />
            </svg>
          </div>

          {/* Collaborator Profile Badges (Aligned on header line, dynamically populated from live peers or workspace members) */}
          <div className="flex items-center space-x-3 shrink-0">
            {liveCollaborators.length > 0 ? (
              liveCollaborators.slice(0, 4).map((collab, idx) => {
                const initial = (collab.name || "U")[0].toUpperCase();
                return (
                  <div
                    key={`${collab.name}-${idx}`}
                    className="relative group cursor-pointer"
                    title={`${collab.name} (Active in notebook)`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FAF7EE] border-2 border-[#30312C] shadow-[2.5px_2px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                      <div
                        className="w-full h-full font-header font-extrabold text-base sm:text-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: collab.color }}
                      >
                        {initial}
                      </div>
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs animate-pulse"
                      title="Active in notebook"
                    />
                  </div>
                );
              })
            ) : members.length > 0 ? (
              members.slice(0, 3).map((m, idx) => {
                const initial = (m.user.name || m.user.email || "U")[0].toUpperCase();
                const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                const displayName = m.user.name || m.user.email;
                return (
                  <div
                    key={m.id}
                    className="relative group cursor-pointer"
                    title={`${displayName} (${m.role.toLowerCase()})`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FAF7EE] border-2 border-[#30312C] shadow-[2.5px_2px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                      <div className={`w-full h-full ${colorClass} font-header font-extrabold text-base sm:text-lg flex items-center justify-center`}>
                        {initial}
                      </div>
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                      title="Workspace member"
                    />
                  </div>
                );
              })
            ) : (
              /* Fallback avatar */
              <div className="relative group cursor-pointer" title="Active Collaborator">
                <div className="w-12 h-12 rounded-full bg-[#FAF7EE] border-2 border-[#30312C] shadow-[2.5px_2px_0px_#30312C] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                  <div className="w-full h-full bg-[#2c5e91] text-white font-header font-extrabold text-base sm:text-lg flex items-center justify-center">
                    C
                  </div>
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                  title="Online"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Outer Wrapper with Top Margin & Corner Tapes */}
      <div className="relative mt-14 w-full max-w-[1024px] mx-auto">
        {/* Left Tape Accent */}
        <div
          className="absolute -top-3 -left-7 w-[46px] h-[20px] bg-white/60 border border-black/10 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.12)] pointer-events-none z-30 rounded-xs backdrop-blur-[0.5px]"
          style={{ transform: "rotate(-40deg)" }}
        />

        {/* Right Tape Accent */}
        <div
          className="absolute -top-3 -right-7 w-[46px] h-[20px] bg-white/60 border border-black/10 shadow-[0px_6px_0px_0px_rgba(0,0,0,0.12)] pointer-events-none z-30 rounded-xs backdrop-blur-[0.5px]"
          style={{ transform: "rotate(40deg)" }}
        />

        {/* Editable White Document Container with Tiptap Canvas */}
        <div className="w-full bg-white min-h-[720px] lg:min-h-[820px] border-r-[4px] border-b-[5px] border-[#E5E7EB] rounded-tl-[60px] sm:rounded-tl-[80px] rounded-tr-[50px] sm:rounded-tr-[70px] rounded-br-[50px] sm:rounded-br-[70px] rounded-bl-[60px] sm:rounded-bl-[80px] shadow-[8px_8px_6px_3px_rgba(27,28,28,0.25)] flex flex-col transition-all overflow-visible">
          <TiptapCanvas
            docId={`notebook-${notebookId}`}
            initialContent={content}
            isSaved={isSaved}
            onSave={handleSave}
            onExport={() =>
              toast.success("Export Complete", {
                description: `"${notebookTitle}" exported successfully!`,
              })
            }
            onShare={() => setIsShareModalOpen(true)}
            onContentChange={handleContentChange}
            token={token}
            wsUrl={wsUrl}
            user={currentUser}
            onCollaboratorsChange={setLiveCollaborators}
          />
        </div>
      </div>

      {/* Share Modal Backdrop - Portal to document.body for 100% full-site blur including Navbar & Sidebar */}
      {isShareModalOpen &&
        mounted &&
        createPortal(
          <div
            onClick={() => setIsShareModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn"
          >
            {/* Heavily Rounded White Modal Card with Black Border, Center Top Tape, & Strong Black Shadow */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF7EE] border-2 border-[#30312C] rounded-[48px] p-8 max-w-lg w-full shadow-[8px_8px_0px_#30312C] space-y-5 relative animate-scaleUp cursor-default"
            >
              {/* Tilted Center Top Tape Accent */}
              <div
                className="absolute -top-3.5 left-1/2 w-16 h-6 bg-white/80 border border-black/15 shadow-[0px_3px_6px_rgba(0,0,0,0.15)] pointer-events-none z-30 rounded-xs"
                style={{ transform: "translateX(-50%) rotate(-4deg)" }}
              />

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-header font-extrabold text-2xl text-[#30312C] tracking-tight">
                    Share with the Collective
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs font-body text-[#66645e]">
                    <Eye className="w-3.5 h-3.5 text-[#30312C]" />
                    <span>Anyone with the link can view</span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-[#30312C] flex items-center justify-center text-[#30312C] hover:bg-white transition-colors cursor-pointer font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Email Invite Input */}
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#66645e]">
                  <Pencil className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendInvite();
                    }
                  }}
                  placeholder="Invite others by email..."
                  className="w-full pl-10 pr-24 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
                <button
                  type="button"
                  disabled={isInviting}
                  onClick={handleSendInvite}
                  className="absolute right-1.5 px-4 py-1.5 bg-primary text-white font-header font-bold text-xs rounded-xl border border-[#30312C] shadow-[1px_1px_0px_#30312C] hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isInviting ? "Inviting..." : "Invite"}
                </button>
              </div>

              {/* Current Members List */}
              <div className="space-y-3 pt-1 max-h-[220px] overflow-y-auto pr-1">
                <span className="font-body text-xs text-[#807d74] font-medium tracking-wide">
                  Current Members ({members.length})
                </span>

                <div className="space-y-3">
                  {members.length > 0 ? (
                    members.map((member, idx) => {
                      const isOwner = member.role === "OWNER";
                      const isYou = member.userId === currentUserId;
                      const initial = (member.user.name || member.user.email || "U")[0].toUpperCase();
                      const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                      const displayName = member.user.name || member.user.email.split("@")[0];

                      return (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/60 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-9 h-9 rounded-full ${colorClass} font-header font-bold text-xs flex items-center justify-center border border-[#30312C]`}>
                              {initial}
                            </div>
                            <div>
                              <h4 className="font-header font-bold text-xs text-[#30312C]">
                                {displayName} {isYou ? "(You)" : ""}
                              </h4>
                              <p className="font-body text-[11px] text-[#737067]">
                                {isOwner ? "Owner • " : ""}{member.user.email}
                              </p>
                            </div>
                          </div>

                          {/* Right Column: Owner badge or role select */}
                          {isOwner ? (
                            <div className="flex items-center space-x-1.5 text-xs font-header font-bold text-[#30312C]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                              <span>Owner</span>
                            </div>
                          ) : (
                            <select
                              value={member.role}
                              onChange={(e) => handleRoleChange(member, e.target.value)}
                              className="bg-white border border-[#30312C] font-header font-bold text-xs text-[#30312C] rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
                            >
                              <option value="MEMBER">Member</option>
                              <option value="ADMIN">Admin</option>
                              <option value="remove">Remove</option>
                            </select>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 font-body text-xs text-[#737067]">
                      No members loaded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Invites (if any) */}
              {invites.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-[#30312C]/10 max-h-[140px] overflow-y-auto pr-1">
                  <span className="font-body text-xs text-[#807d74] font-medium tracking-wide">
                    Pending Invites ({invites.length})
                  </span>
                  <div className="space-y-2">
                    {invites.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/40 border border-[#30312C]/10 text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-full bg-amber-100 text-[#30312C] font-header font-bold text-xs flex items-center justify-center border border-[#30312C]/40">
                            {inv.email[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-header font-bold text-[#30312C] block text-[11px]">
                              {inv.email}
                            </span>
                            <span className="font-body text-[10px] text-[#737067]">
                              Pending invite ({inv.role.toLowerCase()})
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRevokeInvite(inv.id, inv.email)}
                          className="font-header font-bold text-[11px] text-red-600 hover:text-red-700 px-2 py-0.5 rounded hover:bg-red-50 cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dashed Line Divider */}
              <div className="border-t-2 border-dashed border-[#30312C]/20 pt-1" />

              {/* Bottom Copy Link Section (Unbuttoned, pure icon + text) */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setLinkCopied(true);
                    toast.info("Link Copied", {
                      description: "Notebook link copied to clipboard!",
                    });
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="text-[#30312C] hover:text-primary font-header font-bold text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4 text-[#30312C]" />
                  <span>{linkCopied ? "Link copied to clipboard!" : "Copy link"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
