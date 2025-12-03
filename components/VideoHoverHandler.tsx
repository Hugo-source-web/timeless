"use client";

import { useEffect } from "react";

export default function VideoHoverHandler() {
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const video = (e.target as HTMLElement)
        ?.closest("a")
        ?.querySelector("video") as HTMLVideoElement | null;

      if (video) video.play().catch(() => {});
    };

    const handleMouseOut = (e: MouseEvent) => {
      const video = (e.target as HTMLElement)
        ?.closest("a")
        ?.querySelector("video") as HTMLVideoElement | null;

      if (video) video.pause();
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return null; // Invisible component
}
