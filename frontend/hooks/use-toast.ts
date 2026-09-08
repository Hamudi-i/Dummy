"use client";

import { toast as sonnerToast } from "sonner";

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: React.ReactNode;
}

export function toast({ title, description, variant }: ToastOptions) {
  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", {
      description,
    });
  }
  if (variant === "success") {
    return sonnerToast.success(title || "Success", {
      description,
    });
  }
  return sonnerToast(title || "", {
    description,
  });
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
}
