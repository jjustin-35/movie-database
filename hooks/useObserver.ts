import { useEffect, useRef } from 'react';

const useObserver = <T extends HTMLElement>(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
) => {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    observer.observe(targetRef.current);
    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
};

export default useObserver;