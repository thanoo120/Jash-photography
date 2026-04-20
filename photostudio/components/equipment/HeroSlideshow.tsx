"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type HeroSlideshowProps = {
  images: string[];
  /** `light` = rounded card + soft shadow (home hero). `dark` = equipment page style. */
  variant?: "dark" | "light";
  className?: string;
  imageAlt?: string;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
  "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=1200&q=80",
  "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=1200&q=80",
];

export default function HeroSlideshow({
  images,
  variant = "dark",
  className,
  imageAlt = "Showcase",
}: HeroSlideshowProps) {
  const safeImages = useMemo(() => {
    const unique = Array.from(new Set(images.filter(Boolean)));
    return unique.length > 0 ? unique : FALLBACK_IMAGES;
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (safeImages.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeImages.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [safeImages]);

  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        isLight
          ? "h-[420px] sm:h-[520px] rounded-[2rem] border border-white/70 bg-obsidian-100 shadow-[0_24px_80px_rgba(17,24,39,0.18)]"
          : "h-[300px] sm:h-[360px] lg:h-[420px] rounded-sm border border-obsidian-800 bg-obsidian-900/60 shadow-2xl",
        className
      )}
    >
      {safeImages.map((src, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={`${src}-${index}`}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              isActive ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-105"
            }`}
          >
            <Image
              src={src}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        );
      })}

      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          isLight
            ? "bg-gradient-to-t from-obsidian-950/40 via-transparent to-transparent"
            : "bg-gradient-to-t from-obsidian-950/50 via-transparent to-transparent"
        )}
      />

      <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2">
        {safeImages.map((_, index) => (
          <span
            key={`dot-${index}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === activeIndex
                ? isLight
                  ? "w-7 bg-[#2D89C4]"
                  : "w-7 bg-gold-400"
                : isLight
                  ? "w-2 bg-white/70"
                  : "w-2 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
