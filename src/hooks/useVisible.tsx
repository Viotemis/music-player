import React, { useState, useEffect, useRef } from "react";

interface Args extends IntersectionObserverInit {}

export default function useVisible(
  ref: React.MutableRefObject<HTMLElement>,
  { root = null, threshold = 0, rootMargin = "0%", ...options }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const updateObserver = ([e]: IntersectionObserverEntry[]) => {
      if (entry === undefined || e.isIntersecting !== entry.isIntersecting) {
        setEntry(e);
      }
    };
    const observer = new IntersectionObserver(updateObserver, {
      root,
      threshold,
      rootMargin,
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref, root, threshold, rootMargin, options]);

  return entry;
}
