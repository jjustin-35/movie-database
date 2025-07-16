import { useCallback, useRef } from "react";

const useObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit
) => {
  const observer = useRef(null);

  return useCallback((node: HTMLElement) => {
    if (!node) {
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    observer.current = new window.IntersectionObserver(callback, options);
    observer.current.observe(node);
  }, [callback, options]);
};

export default useObserver;
