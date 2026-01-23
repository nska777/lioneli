"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function CallButton({
  onClick,
  children = "Заказать звонок",
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLButtonElement | null>(null);
  const shimmerRef = useRef<HTMLSpanElement | null>(null);
  const waveARef = useRef<HTMLSpanElement | null>(null);
  const waveBRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const shimmer = shimmerRef.current;
    const waveA = waveARef.current;
    const waveB = waveBRef.current;
    if (!root || !shimmer || !waveA || !waveB) return;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.set(shimmer, { xPercent: -140, autoAlpha: 0 });

      gsap.to(waveA, {
        xPercent: -18,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(waveB, {
        xPercent: 14,
        duration: 4.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      const onEnter = () => {
        gsap.set(shimmer, { xPercent: -140, autoAlpha: 1 });
        gsap.to(shimmer, {
          xPercent: 140,
          duration: 0.85,
          ease: "power3.out",
          onComplete: () => gsap.set(shimmer, { autoAlpha: 0 }),
        });
      };

      root.addEventListener("mouseenter", onEnter);
      return () => root.removeEventListener("mouseenter", onEnter);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <button
      ref={rootRef}
      onClick={onClick}
      className="
        relative isolate overflow-hidden cursor-pointer
        rounded-full px-5 py-[8px]
        text-[13px] tracking-[0.16em]
        shadow-[0_14px_35px_-26px_rgba(0,0,0,0.35)]
        transition
      "
      style={{
        background:
          "radial-gradient(120% 140% at 20% 0%, rgba(255,255,255,0.9), rgba(255,255,255,0) 55%), linear-gradient(180deg, #fbfaf7 0%, #f1eee7 100%)",
      }}
    >
      {/* 🔹 ТОНКАЯ ПРЕМИАЛЬНАЯ ОБВОДКА (hairline) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          padding: "0.5px",
          borderRadius: "9999px",
          background:
            "linear-gradient(180deg, rgba(216,180,106,0.65), rgba(216,180,106,0.25))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* ВНУТРЕННИЕ ВОЛНЫ */}
      <span
        ref={waveARef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 80% at 30% 40%, rgba(216,180,106,0.14), transparent 70%)",
          mixBlendMode: "multiply",
        }}
      />
      <span
        ref={waveBRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 90% at 70% 60%, rgba(181,137,74,0.12), transparent 72%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* SHIMMER */}
      <span
        ref={shimmerRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(216,180,106,0) 0%, rgba(216,180,106,0.22) 35%, rgba(255,255,255,0.55) 50%, rgba(216,180,106,0.22) 65%, rgba(216,180,106,0) 100%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* ТЕКСТ */}
      <span
        className="relative z-10 bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #b4872f 0%, #d9b56b 35%, #8f6a1f 100%)",
        }}
      >
        {children}
      </span>
    </button>
  );
}
