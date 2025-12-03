"use client";

import { useEffect, useState } from "react";

export default function useParallax(strength = 0.1) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handler = () => {
      setOffset(window.scrollY * strength);
    };
    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, [strength]);

  return offset;
}
