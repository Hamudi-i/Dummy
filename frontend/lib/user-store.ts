"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "./api";

export interface UserProfile {
  id?: string;
  fullName: string;
  username: string;
  email: string;
  bio: string;
  profilePic: string | null;
}

const DEFAULT_PROFILE: UserProfile = {
  id: "usr-default",
  fullName: "Natty Aman",
  username: "CoLab_User",
  email: "natty@colab.studio",
  bio: "Product Designer & Developer building collaborative tools.",
  profilePic: "/fox.png",
};

const PROFILE_STORAGE_KEY = "colab_user_profile";
const USER_EVENT_NAME = "colab_profile_updated";

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Check legacy 'user' key if stored during login
    const legacyUser = localStorage.getItem("user");
    if (legacyUser) {
      const parsed = JSON.parse(legacyUser);
      return {
        id: parsed.id || DEFAULT_PROFILE.id,
        fullName: parsed.name || DEFAULT_PROFILE.fullName,
        username: parsed.username || DEFAULT_PROFILE.username,
        email: parsed.email || DEFAULT_PROFILE.email,
        bio: parsed.bio || DEFAULT_PROFILE.bio,
        profilePic: parsed.avatarUrl || parsed.profilePic || DEFAULT_PROFILE.profilePic,
      };
    }
  } catch (err) {
    console.error("Error loading profile from localStorage:", err);
  }
  return DEFAULT_PROFILE;
}

export async function saveUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
  const current = getUserProfile();
  const newProfile: UserProfile = {
    ...current,
    ...updated,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      // Sync legacy 'user' key for backend compatibility
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: newProfile.id,
          name: newProfile.fullName,
          username: newProfile.username,
          email: newProfile.email,
          bio: newProfile.bio,
          avatarUrl: newProfile.profilePic,
        })
      );
      window.dispatchEvent(new Event(USER_EVENT_NAME));
    } catch (err) {
      console.error("Error saving profile to localStorage:", err);
    }
  }

  // Backend Integration Hook:
  // If backend is active (token exists), send PUT /api/users/:id or PUT /api/auth/me
  if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
    try {
      await fetchWithAuth(`/api/users/${newProfile.id || "me"}`, {
        method: "PUT",
        body: JSON.stringify({
          name: newProfile.fullName,
          username: newProfile.username,
          email: newProfile.email,
          bio: newProfile.bio,
          avatarUrl: newProfile.profilePic,
        }),
      });
    } catch (apiErr) {
      // Backend is optional for now (UI-first fallback)
      console.warn("Backend profile sync pending integration:", apiErr);
    }
  }

  return newProfile;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setProfile(getUserProfile());

    const handleUpdate = () => {
      setProfile(getUserProfile());
    };

    window.addEventListener(USER_EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(USER_EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    profile,
    updateProfile: saveUserProfile,
  };
}
