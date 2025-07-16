"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/context/toastContext";

const Toast = () => {
  const { toast } = useToast();

  if (!toast) return null;

  const bgColor = toast.type === "success" ? "bg-green-500" : "bg-red-500";
  const icon =
    toast.type === "success" ? (
      <CheckCircle className="w-6 h-6 text-white" />
    ) : (
      <XCircle className="w-6 h-6 text-white" />
    );

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md z-50">
      <div className={`${bgColor} shadow-lg rounded-lg p-4 flex items-center gap-2`}>
        {icon}
        <p className="text-sm text-white">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
