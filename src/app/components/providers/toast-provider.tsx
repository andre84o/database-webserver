"use client"
import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: string; message: string; type?: "info" | "error" | "success" };

const ToastContext = createContext<{
  push: (t: Omit<Toast, "id">) => void;
} | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [{ id, ...t }, ...s]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div aria-live="polite" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-md px-4 py-2 shadow-md text-sm ${t.type === 'error' ? 'bg-red-600 text-white' : t.type === 'success' ? 'bg-green-600 text-white' : 'bg-white text-black border'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
