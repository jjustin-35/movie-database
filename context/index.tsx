"use client";

import { ToastProvider } from "./toastContext";
import { WatchListProvider } from "./watchListContext";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <WatchListProvider>{children}</WatchListProvider>
    </ToastProvider>
  );
};

export default Provider;
