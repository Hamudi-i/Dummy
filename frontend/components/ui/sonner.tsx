"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#FAF7EE] group-[.toaster]:text-[#30312C] group-[.toaster]:border-[1.8px] group-[.toaster]:border-[#30312C] group-[.toaster]:shadow-[4px_4px_0px_#30312C] group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:font-body flex items-start gap-3",
          description: "group-[.toast]:text-[#737067] group-[.toast]:text-xs font-body mt-0.5",
          title: "group-[.toast]:font-header group-[.toast]:font-bold group-[.toast]:text-sm group-[.toast]:text-[#30312C]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:font-header group-[.toast]:font-bold group-[.toast]:border group-[.toast]:border-[#30312C]",
          cancelButton:
            "group-[.toast]:bg-neutral-200 group-[.toast]:text-[#30312C]",
          success:
            "group-[.toast]:bg-[#F4F9F4] group-[.toast]:border-emerald-600",
          error:
            "group-[.toast]:bg-[#FFF5F5] group-[.toast]:border-rose-600",
          info:
            "group-[.toast]:bg-[#F0F7FF] group-[.toast]:border-blue-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
