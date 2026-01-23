"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  title: string;
  ctaLabel: string;
  href: string;
  image: string; // /hero/1.jpg
};

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export default function GSAPHeroSlider({
  slides = [
    {
      id: "s1",
      title: "СПАЛЬНЯ SALVADOR",
      ctaLabel: "В КАТАЛОГ",
      href: "/catalog?cat=bedroom",
      image: "/hero/1.jpg",
    },
    {
      id: "s2",
      title: "СПАЛЬНЯ AMBER",
      ctaLabel: "В КАТАЛОГ",
      href: "/catalog?cat=living",
      image: "/hero/2.jpg",
    },
    {
      id: "s3",
      title: "СПАЛЬНЯ SCANDY",
      ctaLabel: "В КАТАЛОГ",
      href: "/catalog?cat=office",
      image: "/hero/3.jpg",
    },
  ] as Slide[],
  autoMs = 5200,
}: {
  slides?: Slide[];
  autoMs?: number;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const autoRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  const [active, setActive] = useState(0);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  const go = (nextIdx: number) => {
    if (!rootRef.current) return;
    if (busyRef.current) return;
    busyRef.current = true;

    const root = rootRef.current;
    const prevIdx = active;
    const clamped = (nextIdx + slides.length) % slides.length;

    const prev = root.querySelector(
      `[data-slide="${prevIdx}"]`,
    ) as HTMLElement | null;
    const next = root.querySelector(
      `[data-slide="${clamped}"]`,
    ) as HTMLElement | null;

    if (!prev || !next) {
      setActive(clamped);
      busyRef.current = false;
      return;
    }

    // элементы внутри
    const prevImg = prev.querySelector("[data-img]") as HTMLElement | null;
    const nextImg = next.querySelector("[data-img]") as HTMLElement | null;
    const prevOverlay = prev.querySelector(
      "[data-overlay]",
    ) as HTMLElement | null;
    const nextOverlay = next.querySelector(
      "[data-overlay]",
    ) as HTMLElement | null;
    const nextTitle = next.querySelector("[data-title]") as HTMLElement | null;
    const nextBtn = next.querySelector("[data-btn]") as HTMLElement | null;

    // поднимаем next выше
    gsap.set(next, { zIndex: 2, opacity: 1, pointerEvents: "auto" });
    gsap.set(prev, { zIndex: 1, pointerEvents: "none" });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        // фиксируем состояния
        gsap.set(prev, { opacity: 0 });
        setActive(clamped);
        busyRef.current = false;
      },
    });

    // Начальные состояния next
    gsap.set(nextImg, { scale: 1.06, filter: "blur(6px)" });
    gsap.set(nextOverlay, { opacity: 0.35 });
    gsap.set([nextTitle, nextBtn], { y: 18, opacity: 0 });

    // Премиальный переход (без резких рамок)
    tl.to(prevImg, { scale: 1.02, duration: 0.45 }, 0)
      .to(prevOverlay, { opacity: 0.55, duration: 0.45 }, 0)
      .to(prev, { opacity: 0, duration: 0.55 }, 0.1)

      .to(
        nextImg,
        { scale: 1, filter: "blur(0px)", duration: 0.85, ease: "expo.out" },
        0.05,
      )
      .to(nextOverlay, { opacity: 0.55, duration: 0.7 }, 0.1)
      .to(nextTitle, { y: 0, opacity: 1, duration: 0.6 }, 0.22)
      .to(nextBtn, { y: 0, opacity: 1, duration: 0.55 }, 0.3);

    tlRef.current?.kill();
    tlRef.current = tl;
  };

  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  const stopAuto = () => {
    if (autoRef.current) window.clearInterval(autoRef.current);
    autoRef.current = null;
  };

  const startAuto = () => {
    stopAuto();
    if (reducedMotion) return;
    autoRef.current = window.setInterval(() => {
      // не дергаем, если уже идет анимация
      if (!busyRef.current) next();
    }, autoMs);
  };

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    // initial show
    const root = rootRef.current;
    slides.forEach((_, i) => {
      const el = root.querySelector(
        `[data-slide="${i}"]`,
      ) as HTMLElement | null;
      if (!el) return;
      gsap.set(el, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 2 : 1 });
    });

    // микро-въезд контента на первом
    if (!reducedMotion) {
      const first = root.querySelector(
        `[data-slide="0"]`,
      ) as HTMLElement | null;
      const img = first?.querySelector("[data-img]") as HTMLElement | null;
      const overlay = first?.querySelector(
        "[data-overlay]",
      ) as HTMLElement | null;
      const title = first?.querySelector("[data-title]") as HTMLElement | null;
      const btn = first?.querySelector("[data-btn]") as HTMLElement | null;

      gsap.set(img, { scale: 1.06, filter: "blur(6px)" });
      gsap.set(overlay, { opacity: 0.35 });
      gsap.set([title, btn], { y: 18, opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(
          img,
          { scale: 1, filter: "blur(0px)", duration: 1.0, ease: "expo.out" },
          0,
        )
        .to(overlay, { opacity: 0.55, duration: 0.7 }, 0.1)
        .to(title, { y: 0, opacity: 1, duration: 0.6 }, 0.22)
        .to(btn, { y: 0, opacity: 1, duration: 0.55 }, 0.3);
    }

    startAuto();
    return () => {
      stopAuto();
      tlRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <section className="w-full">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        {/* сам слайдер — широкий, под меню */}
        <div
          ref={rootRef}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          className={cn(
            "relative overflow-hidden rounded-[22px]",
            "border border-black/10 bg-white",
            "shadow-[0_20px_60px_rgba(0,0,0,0.12)]",
            "h-[420px] md:h-[520px]",
            "cursor-pointer select-none",
          )}
        >
          {/* slides stack */}
          {slides.map((s, i) => (
            <div
              key={s.id}
              data-slide={i}
              className="absolute inset-0 opacity-0"
              aria-hidden={i !== active}
            >
              {/* image */}
              <div className="absolute inset-0">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  priority={i === 0}
                  className="object-cover"
                />
                <div
                  data-img
                  className="absolute inset-0"
                  // этот слой нужен чтобы анимировать scale/blur без дерганий Image
                  style={{
                    backgroundImage: `url(${s.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform: "translateZ(0)",
                  }}
                />
              </div>

              {/* overlay (премиальный) */}
              <div
                data-overlay
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.20) 100%)",
                }}
              />

              {/* content */}
              <div className="relative z-10 flex h-full items-center justify-center px-5 md:px-10">
                <div className="text-center">
                  <h2
                    data-title
                    className={cn(
                      "text-white font-semibold",
                      "tracking-[0.06em] uppercase",
                      "text-[28px] md:text-[44px] leading-[1.05]",
                      "drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                    )}
                  >
                    {s.title}
                  </h2>

                  <div className="mt-5 flex justify-center">
                    <Link
                      data-btn
                      href={s.href}
                      className={cn(
                        "inline-flex items-center justify-center",
                        "rounded-2xl px-6 py-3",
                        "bg-white/85 backdrop-blur-xl",
                        "border border-white/30",
                        "shadow-[0_16px_45px_rgba(0,0,0,0.25)]",
                        "text-black",
                        "text-[12px] md:text-[13px] tracking-[0.18em] uppercase",
                        "transition",
                        "cursor-pointer",
                      )}
                    >
                      {s.ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20",
              "h-11 w-11 rounded-full",
              "bg-white/75 backdrop-blur-xl",
              "border border-white/30",
              "shadow-[0_16px_45px_rgba(0,0,0,0.22)]",
              "grid place-items-center",
              "hover:bg-white/85 transition",
              "cursor-pointer",
            )}
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft className="h-5 w-5 text-black/80" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-20",
              "h-11 w-11 rounded-full",
              "bg-white/75 backdrop-blur-xl",
              "border border-white/30",
              "shadow-[0_16px_45px_rgba(0,0,0,0.22)]",
              "grid place-items-center",
              "hover:bg-white/85 transition",
              "cursor-pointer",
            )}
            aria-label="Следующий слайд"
          >
            <ChevronRight className="h-5 w-5 text-black/80" />
          </button>

          {/* dots */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition",
                  i === active
                    ? "bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.25)]"
                    : "bg-white/45 hover:bg-white/70",
                  "cursor-pointer",
                )}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
