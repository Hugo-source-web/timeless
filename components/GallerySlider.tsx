"use client";

import { useEffect, useRef, useState } from "react";
import { neue6 } from "@/app/fonts/neuePlak";
import useParallax from "./useParallax";

export default function GallerySlider({ images }: { images: string[] }) {
  // Duplicate edges for seamless infinite loop
  const extended = [images[images.length - 1], ...images, images[0]];

  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);

  // Handle infinite wrap-around
  useEffect(() => {
    if (!transition) return;

    if (index === extended.length - 1) {
      // fake last → real first
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 700);
    }

    if (index === 0) {
      // fake first → real last
      setTimeout(() => {
        setTransition(false);
        setIndex(extended.length - 2);
      }, 700);
    }
  }, [index, extended.length]);

  // Re-enable transition after teleporting
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true);
        });
      });
    }
  }, [transition]);

  return (
    <section className="w-full bg-black text-white">
      <h2 className={`${neue6.className} text-4xl font-semibold tracking-tight px-6 mb-12`}>
        GALERIA
      </h2>

      {/* FULL-WIDTH carousel container */}
      <div className="relative w-full h-[75vh] overflow-hidden">

        {/* TRACK */}
        <div
          className={`flex ${
            transition ? "transition-transform duration-700 ease-out" : ""
          }`}
          style={{
            transform: `translateX(calc(-${index * 80}vw + 10vw))`,
          }}
        >
          {extended.map((src, i) => (
            <div key={i} className="flex-shrink-0 w-[80vw] px-6">
              <img
                src={src}
                className="w-full h-[75vh] object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* NAV BUTTONS */}
        <button
          onClick={prev}
          className="absolute left-5 top-1/2 -translate-y-1/2 
            bg-white/25 hover:bg-white/40
            backdrop-blur-sm text-white text-4xl
            px-4 py-1 rounded-full transition"
        >
          ‹
        </button>

        <button
          onClick={next}
          className="absolute right-5 top-1/2 -translate-y-1/2 
            bg-white/25 hover:bg-white/40
            backdrop-blur-sm text-white text-4xl
            px-4 py-1 rounded-full transition"
        >
          ›
        </button>
      </div>
    </section>
  );
}
