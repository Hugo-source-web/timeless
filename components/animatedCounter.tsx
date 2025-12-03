"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  target,
  duration = 1500,
  suffix = "",
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const start = 0;
          const end = target;
          const increment = end / (duration / 16.6); // ~60fps

          let current = start;

          const animate = () => {
            current += increment;
            if (current >= end) {
              current = end;
              setValue(current);
            } else {
              setValue(current);
              requestAnimationFrame(animate);
            }
          };

          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {value.toFixed(1)}
      {suffix}
    </span>
  );
}
