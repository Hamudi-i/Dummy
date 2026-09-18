"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const values = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = values.get("accessToken");
    const refreshToken = values.get("refreshToken");
    const user = values.get("user");
    if (!accessToken || !refreshToken || !user) { router.replace("/login"); return; }
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", user);
    window.history.replaceState(null, "", "/auth/callback");
    router.replace("/workspace");
  }, [router]);
  return <div className="min-h-screen grid place-items-center font-body text-[#30312C]">Signing you in…</div>;
}
