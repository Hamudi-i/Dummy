"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Signing you in…");

  useEffect(() => {
    try {
      // 1. Check both search query string and URL hash fragment
      const rawHash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(rawHash);
      const searchParams = new URLSearchParams(window.location.search);

      // Check for errors returned by Google or backend
      const error =
        searchParams.get("error_description") ||
        searchParams.get("error") ||
        hashParams.get("error_description") ||
        hashParams.get("error");

      if (error) {
        console.error("[OAuth Callback Error]:", error);
        setStatusMessage(`Authentication error: ${error}`);
        setTimeout(() => {
          router.replace(`/login?error=${encodeURIComponent(error)}`);
        }, 1200);
        return;
      }

      // Check for access/refresh tokens
      const accessToken = hashParams.get("accessToken") || searchParams.get("accessToken");
      const refreshToken = hashParams.get("refreshToken") || searchParams.get("refreshToken");
      const user = hashParams.get("user") || searchParams.get("user");

      if (accessToken && refreshToken && user) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", user);

        // Perform clean navigation to workspace
        window.location.replace("/workspace");
        return;
      }

      // 2. If Google redirected directly to this frontend callback with ?code=...
      const code = searchParams.get("code") || hashParams.get("code");
      const state = searchParams.get("state") || hashParams.get("state");

      if (code) {
        setStatusMessage("Completing authorization with server…");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const stateParam = state ? `&state=${encodeURIComponent(state)}` : "";
        window.location.replace(
          `${apiUrl}/api/auth/oauth/google/callback?code=${encodeURIComponent(code)}${stateParam}`
        );
        return;
      }

      // 3. Fallback if no credentials or code were present
      console.warn("[OAuth Callback] Missing tokens or code in callback URL:", window.location.href);
      router.replace("/login?error=No+authentication+credentials+received");
    } catch (err: any) {
      console.error("[OAuth Callback Exception]:", err);
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F5EC] flex flex-col items-center justify-center p-4 font-comic select-none">
      <div className="bg-white border-2 border-[#30312C] rounded-2xl shadow-[4px_4px_0px_#30312C] p-8 flex flex-col items-center space-y-4 max-w-sm text-center">
        <div className="w-10 h-10 border-4 border-[#2c5e91] border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-bold text-[#30312C]">{statusMessage}</p>
        <p className="text-xs text-[#75726B]">Please wait while we connect your workspace...</p>
      </div>
    </div>
  );
}
