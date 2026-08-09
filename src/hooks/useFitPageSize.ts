"use client";

import { useEffect, useState, type RefObject } from "react";

import { cardsPerRow, DEFAULT_LIMIT } from "@/utils/globalUtils";

function estimateFromWindow() {
  if (typeof window === "undefined") return DEFAULT_LIMIT;
  return cardsPerRow(window.innerWidth - 32);
}

export default function useFitPageSize(ref: RefObject<HTMLElement | null>) {
  const [pageSize, setPageSize] = useState(estimateFromWindow);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = (width: number) => {
      setPageSize(cardsPerRow(width));
    };

    update(element.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? element.clientWidth;
      update(width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return pageSize;
}
