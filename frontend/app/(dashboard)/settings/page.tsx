"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Pencil,
  Lock,
  Mail,
  AtSign,
  ShieldCheck,
  Check,
  Upload,
  Bell,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications">("account");

  // Account Customization States
  const [fullName, setFullName] = useState("Natty Aman");
  const [username, setUsername] = useState("natty_colab");
  const [email, setEmail] = useState("natty@colab.studio");
  const [bio, setBio] = useState("Product Designer & Developer building collaborative tools.");
  const [profilePic, setProfilePic] = useState<string | null>("/fox.png");

  // Security States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification States
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [mentionAlerts, setMentionAlerts] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        toast.success("Profile Picture Updated!", {
          description: "Click Save Account Changes to finalize.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAccount = () => {
    toast.success("Account Updated", {
      description: `Saved profile changes for @${username}.`,
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Password Required", {
        description: "Please fill in all password fields.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New password and confirmation do not match.",
      });
      return;
    }
    toast.success("Password Changed", {
      description: "Your account security password has been updated.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none pt-6 sm:pt-8 max-w-4xl mx-auto">
      {/* Header Section with Blue Sketch Underline */}
      <div className="space-y-3">
        <div className="relative inline-block transform -rotate-1 sm:-rotate-1.5 origin-left">
          <h1 className="font-header text-4xl sm:text-[44px] font-extrabold text-[#30312C] tracking-tight relative z-10 leading-tight flex items-center space-x-3">
            <span>Account Settings</span>
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
          Manage your personal profile picture, username, email credentials, and security settings.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b-2 border-[#30312C]/15 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === "account"
              ? "bg-[#2c5e91] text-white shadow-[2px_2px_0px_#30312C]"
              : "bg-white text-[#30312C] hover:bg-[#FAF7EE]"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === "security"
              ? "bg-[#2c5e91] text-white shadow-[2px_2px_0px_#30312C]"
              : "bg-white text-[#30312C] hover:bg-[#FAF7EE]"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-header font-bold text-xs rounded-xl border border-[#30312C] transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === "notifications"
              ? "bg-[#2c5e91] text-white shadow-[2px_2px_0px_#30312C]"
              : "bg-white text-[#30312C] hover:bg-[#FAF7EE]"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Tab 1: Account & Profile Picture */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="relative bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-6 sm:p-8 shadow-[6px_6px_0px_#30312C] space-y-6">
            {/* Top Tape Accent */}
            <div
              className="absolute -top-3.5 left-10 w-20 h-5 bg-white/70 border border-black/15 shadow-2xs pointer-events-none rounded-xs backdrop-blur-[0.5px]"
              style={{ transform: "rotate(-3deg)" }}
            />

            {/* Profile Picture Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#30312C] bg-[#FAF7EE] shadow-[3px_3px_0px_#30312C] overflow-hidden flex items-center justify-center">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2c5e91] text-white font-header font-extrabold text-3xl flex items-center justify-center">
                      {fullName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Upload Button overlay */}
                <label
                  className="absolute bottom-0 right-0 p-2.5 bg-[#2c5e91] text-white rounded-full border-1.5 border-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] hover:scale-110 transition-transform cursor-pointer"
                  title="Upload New Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <h3 className="font-header text-xl font-extrabold text-[#30312C]">
                  Profile Picture
                </h3>
                <p className="font-body text-xs text-[#737067] max-w-sm">
                  Upload a photo to represent yourself across team workspaces and shared notebooks.
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-3 pt-1">
                  <label className="h-9 px-4 rounded-xl border-1.5 border-[#30312C] bg-white hover:bg-neutral-100 font-header font-bold text-xs text-[#30312C] shadow-[1.5px_1.5px_0px_#30312C] flex items-center space-x-2 cursor-pointer transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#2c5e91]" />
                    <span>Upload New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {profilePic && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePic(null);
                        toast.info("Profile Picture Removed");
                      }}
                      className="text-xs font-header font-bold text-rose-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-[#30312C]/20" />

            {/* Account Credentials Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-header font-bold text-xs text-[#30312C]">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-[#737067] pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="font-header font-bold text-xs text-[#30312C]">
                  Username
                </label>
                <div className="relative flex items-center">
                  <AtSign className="absolute left-3.5 w-4 h-4 text-[#737067] pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-header font-bold text-xs text-[#30312C]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-[#737067] pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-header font-bold text-xs text-[#30312C]">
                  Bio / Tagline
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell collaborators a little about yourself..."
                  rows={3}
                  className="w-full p-3 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveAccount}
              className="h-11 px-6 bg-[#2c5e91] hover:brightness-105 text-white font-header font-extrabold text-xs rounded-2xl border-1.5 border-[#30312C] shadow-[3px_3px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Account Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="relative bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-6 sm:p-8 shadow-[6px_6px_0px_#30312C] space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white rounded-2xl border border-[#30312C] shadow-[2px_2px_0px_#30312C]">
                <ShieldCheck className="w-6 h-6 text-[#2c5e91]" />
              </div>
              <div>
                <h3 className="font-header text-xl font-extrabold text-[#30312C]">
                  Change Password
                </h3>
                <p className="font-body text-xs text-[#737067]">
                  Keep your account secure with a strong password.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-header font-bold text-xs text-[#30312C]">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-header font-bold text-xs text-[#30312C]">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-header font-bold text-xs text-[#30312C]">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 bg-white border-1.5 border-[#30312C] rounded-2xl font-body text-xs text-[#30312C] focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-11 px-6 bg-[#2c5e91] hover:brightness-105 text-white font-header font-extrabold text-xs rounded-2xl border-1.5 border-[#30312C] shadow-[3px_3px_0px_#30312C] transition-all cursor-pointer flex items-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="relative bg-[#FAF7EE] border-2 border-[#30312C] rounded-[36px] p-6 sm:p-8 shadow-[6px_6px_0px_#30312C] space-y-5">
            <h3 className="font-header text-xl font-extrabold text-[#30312C]">
              Notification Preferences
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border-1.5 border-[#30312C] rounded-2xl shadow-xs">
                <div>
                  <h4 className="font-header font-bold text-sm text-[#30312C]">
                    Email Digests
                  </h4>
                  <p className="font-body text-xs text-[#737067]">
                    Receive weekly summaries of activity across your workspaces.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`w-12 h-6 rounded-full p-1 border border-[#30312C] transition-colors cursor-pointer flex items-center ${
                    emailNotifs ? "bg-[#2c5e91] justify-end" : "bg-neutral-200 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full border border-[#30312C] shadow-xs" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border-1.5 border-[#30312C] rounded-2xl shadow-xs">
                <div>
                  <h4 className="font-header font-bold text-sm text-[#30312C]">
                    Teammate Mention Notifications
                  </h4>
                  <p className="font-body text-xs text-[#737067]">
                    Get notified immediately when someone @mentions your username.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMentionAlerts(!mentionAlerts)}
                  className={`w-12 h-6 rounded-full p-1 border border-[#30312C] transition-colors cursor-pointer flex items-center ${
                    mentionAlerts ? "bg-[#2c5e91] justify-end" : "bg-neutral-200 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full border border-[#30312C] shadow-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
