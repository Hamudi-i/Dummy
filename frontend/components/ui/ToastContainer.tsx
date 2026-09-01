"use client";

import React from 'react';
import { ToastMessage } from '@/app/types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#FBF8EF] border-[1.5px] border-[#30312C] rounded-[10px] p-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-start space-x-2 max-w-sm animate-bounceOnce"
        >
          <span className="text-lg">✏️</span>
          <div>
            <div className="font-school font-bold text-[14px] text-[#30312C]">
              {toast.title}
            </div>
            <div className="text-[12.5px] font-comic text-[#55524B]">
              {toast.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
