"use client";

import { createContext, useContext, useState } from "react";

interface Toast {
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  toast: Toast | null;
  openToast: (data: Toast) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: null,
  openToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastContextType["toast"]>(null);

  const openToast = (data: Toast) => {
    setToast(data);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast, openToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};