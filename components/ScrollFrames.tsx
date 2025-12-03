"use client";

import { useEffect, useRef, useState } from "react";

type ScrollFramesProps = {
  framePath: string; // e.g. "/frames/corvette360/frame"
  frameCount: number; // e.g. 120
  fileExtension?: string; // "jpg" or "png"
  scrollHeight?: number; // vh
};

export function ScrollFrames({
  framePath,
  frameCount,
  fileExtension = "jpg",
  scrollHeight = 250,
}: ScrollFramesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const index = String(i).padStart(3, "0"); // frame0001.jpg format
      img.src = `${framePath}${index}.${fileExtension}`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };

      loadedImages.push(img);
    }
  }, [frameCount, framePath, fileExtension]);

  // Draw on scroll
useEffect(() => {
  if (!loaded) return;

  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;

  const aspect = images[0].height / images[0].width;
  canvas.height = canvas.width * aspect;

  const container = canvas.parentElement?.parentElement; // outer <div style={{ height: ... }}>
  if (!container) return;

  const handleScroll = () => {
    const rect = container.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // Before entering the sticky zone → show first frame
    if (rect.top > 0) {
      ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
      return;
    }

    // After leaving the sticky zone → show last frame
    if (Math.abs(rect.top) >= rect.height - viewHeight) {
      const lastFrame = images[frameCount - 1];
      ctx.drawImage(lastFrame, 0, 0, canvas.width, canvas.height);
      return;
    }

    // Inside the scrolling area → scrub normally
    const progress =
      Math.abs(rect.top) / (rect.height - viewHeight);

    const clamped = Math.min(Math.max(progress, 0), 1);

    const frameIndex = Math.floor(clamped * (frameCount - 1));
    ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
  };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
    }, [loaded, images, frameCount]);

  return (
    <div style={{ height: `${scrollHeight}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center justify-center bg-black">
        <canvas ref={canvasRef} className="max-w-[90vw] max-h-[90vh]" />
      </div>
    </div>
  );
}
