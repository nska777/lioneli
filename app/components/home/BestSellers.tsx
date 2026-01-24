"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useRegionLang } from "@/app/context/region-lang";
import ProductActions from "@/app/catalog/ProductActions"; // ⚠️ поправь путь если надо
import { CATALOG_MOCK } from "@/app/lib/mock/catalog-products"; // ⚠️ поправь путь если надо

gsap.registerPlugin(ScrollTrigger);

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function formatPrice(value: number, currency: "RUB" | "UZS") {
  try {
    const locale = currency === "RUB" ? "ru-RU" : "uz-UZ";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return currency === "RUB"
      ? `${Math.round(value).toLocaleString("ru-RU")} ₽`
      : `${Math.round(value).toLocaleString("ru-RU")} сум`;
  }
}

type HitUIItem = {
  id: string;
  title: string;
  href: string;
  image: string;
  price_rub: number;
  price_uzs: number;
  badge: string; // ✅ всегда “Хит продаж”
  skuLabel?: string; // если хочешь оставить, можно не показывать
};

export default function BestSellers({
  title = "Хит продаж",
}: {
  title?: string;
}) {
  const { region } = useRegionLang();
  const currency: "RUB" | "UZS" = region === "ru" ? "RUB" : "UZS";

  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // ✅ гарантируем, что слайдер всегда работает (>= 12)
  const list = useMemo<HitUIItem[]>(() => {
    const all = (CATALOG_MOCK ?? []) as any[];

    const isHit = (p: any) => {
      const b = String(p.badge || "").toLowerCase();
      return b.includes("хит") || b.includes("bestseller");
    };

    const hits = all.filter(isHit);
    const need = 12;

    const used = new Set(hits.map((p: any) => String(p.id)));
    const extra = all.filter((p: any) => !used.has(String(p.id)));

    const merged = [...hits, ...extra].slice(0, Math.min(need, all.length));

    return merged.map((p: any) => ({
      id: String(p.id),
      title: p.title,
      href: `/product/${p.id}`,
      image: p.image,
      price_rub: Number(p.price_rub ?? 0),
      price_uzs: Number(p.price_uzs ?? 0),
      badge: "Хит продаж", // ✅ ВЕЗДЕ
      skuLabel: `ID: ${p.id}`,
    }));
  }, []);

  // ✅ pages
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const calcPages = () => {
      const w = window.innerWidth;
      const perView = w >= 1024 ? 4 : w >= 768 ? 2 : 1;
      const newPages = Math.max(1, Math.ceil(list.length / perView));
      setPages(newPages);
      setPage((p) => Math.min(p, newPages - 1));
    };

    calcPages();
    window.addEventListener("resize", calcPages);
    return () => window.removeEventListener("resize", calcPages);
  }, [list.length]);

  // ✅ slide
  useLayoutEffect(() => {
    if (!rootRef.current || !trackRef.current) return;

    const card = trackRef.current.querySelector(
      "[data-card]",
    ) as HTMLElement | null;
    if (!card) return;

    const gap = 24;
    const cw = card.getBoundingClientRect().width;
    const perView =
      window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1;

    const shift = page * perView * (cw + gap);

    if (reducedMotion) {
      gsap.set(trackRef.current, { x: -shift });
      return;
    }

    gsap.to(trackRef.current, { x: -shift, duration: 0.9, ease: "expo.out" });
  }, [page, reducedMotion, list.length]);

  // ✅ hover actions show/hide
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;
    const cards = Array.from(
      root.querySelectorAll("[data-card]"),
    ) as HTMLElement[];
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const actions = card.querySelector(
        "[data-actions]",
      ) as HTMLElement | null;
      if (!actions) return;

      gsap.set(actions, {
        autoAlpha: 0,
        y: 10,
        filter: "blur(8px)",
        pointerEvents: "none",
      });

      const enter = () => {
        if (reducedMotion) {
          gsap.set(actions, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
          actions.style.pointerEvents = "auto";
          return;
        }
        gsap.to(actions, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.28,
          ease: "power3.out",
          onStart: () => (actions.style.pointerEvents = "auto"),
        });
      };

      const leave = () => {
        if (reducedMotion) {
          gsap.set(actions, { autoAlpha: 0, y: 10, filter: "blur(8px)" });
          actions.style.pointerEvents = "none";
          return;
        }
        gsap.to(actions, {
          autoAlpha: 0,
          y: 10,
          filter: "blur(8px)",
          duration: 0.22,
          ease: "power2.out",
          onComplete: () => (actions.style.pointerEvents = "none"),
        });
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);

      cleanups.push(() => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [list.length, reducedMotion]);

  // ✅ reveal
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (reducedMotion) return;

    const root = rootRef.current;

    const header = root.querySelector(
      "[data-reveal='header']",
    ) as HTMLElement | null;
    const viewport = root.querySelector(
      "[data-reveal='viewport']",
    ) as HTMLElement | null;
    const dots = root.querySelector(
      "[data-reveal='dots']",
    ) as HTMLElement | null;
    const wind = root.querySelector("[data-wind]") as HTMLElement | null;

    const cards = Array.from(
      root.querySelectorAll("[data-card]"),
    ) as HTMLElement[];

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });

    if (header) gsap.set(header, { autoAlpha: 0, y: 18, filter: "blur(10px)" });
    if (viewport)
      gsap.set(viewport, {
        autoAlpha: 0,
        y: 22,
        filter: "blur(12px)",
        clipPath: "inset(0 0 18% 0 round 18px)",
      });
    if (dots) gsap.set(dots, { autoAlpha: 0, y: 10, filter: "blur(8px)" });
    if (wind) gsap.set(wind, { xPercent: -140, autoAlpha: 0 });
    if (cards.length) gsap.set(cards, { y: 10, filter: "blur(6px)" });

    tl.to(
      wind,
      { autoAlpha: 1, xPercent: 140, duration: 0.85, ease: "expo.out" },
      0,
    )
      .to(
        header,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
        },
        0.08,
      )
      .to(
        viewport,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          clipPath: "inset(0 0 0% 0 round 18px)",
          duration: 0.75,
          ease: "expo.out",
        },
        0.12,
      )
      .to(
        cards,
        {
          y: 0,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.06,
        },
        0.22,
      )
      .to(
        dots,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        },
        0.35,
      );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === root) st.kill();
      });
    };
  }, [reducedMotion, list.length]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(pages - 1, p + 1));

  return (
    <section ref={rootRef} className="w-full bg-white relative overflow-hidden">
      {/* wind */}
      <div
        data-wind
        className="pointer-events-none absolute inset-y-0 -left-[40%] w-[180%]"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.78) 45%, rgba(255,255,255,0) 100%)",
          mixBlendMode: "soft-light",
        }}
      />

      <div className="mx-auto w-full max-w-[1200px] px-4 py-12">
        {/* header */}
        <div
          data-reveal="header"
          className="flex items-center justify-between gap-4"
        >
          <h2 className="text-[30px] md:text-[36px] font-semibold tracking-[-0.02em] text-black">
            {title}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={page === 0}
              className={cn(
                "h-10 w-10 rounded-full grid place-items-center",
                "border border-black/10 bg-white",
                "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
                "transition cursor-pointer",
                page === 0
                  ? "opacity-40 cursor-default"
                  : "hover:bg-black/[0.03]",
              )}
              aria-label="Назад"
            >
              <ChevronLeft className="h-5 w-5 text-black/70" />
            </button>

            <button
              onClick={next}
              disabled={page >= pages - 1}
              className={cn(
                "h-10 w-10 rounded-full grid place-items-center",
                "border border-black/10 bg-white",
                "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
                "transition cursor-pointer",
                page >= pages - 1
                  ? "opacity-40 cursor-default"
                  : "hover:bg-black/[0.03]",
              )}
              aria-label="Вперёд"
            >
              <ChevronRight className="h-5 w-5 text-black/70" />
            </button>
          </div>
        </div>

        {/* viewport */}
        <div
          data-reveal="viewport"
          className={cn("mt-8 overflow-hidden", "pr-0 lg:pr-[110px]")}
        >
          <div
            ref={trackRef}
            className="flex gap-6 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            {list.map((p, idx) => {
              const value = currency === "RUB" ? p.price_rub : p.price_uzs;

              // ✅ snapshot для wishlist
              const snapshot = {
                title: p.title,
                href: p.href,
                imageUrl: p.image,
                sku: p.skuLabel ?? null,
                price_uzs: p.price_uzs,
                price_rub: p.price_rub,
              };

              return (
                <Link
                  key={`${p.id}-${idx}`}
                  href={p.href}
                  data-card
                  className={cn(
                    "group block shrink-0 cursor-pointer",
                    "w-[260px] sm:w-[270px] md:w-[300px] lg:w-[282px]",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col h-full",
                      "border border-black/10 bg-white",
                      "rounded-t-[22px] rounded-b-[14px]",
                      "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
                      "transition",
                    )}
                  >
                    <div className="relative overflow-hidden rounded-t-[22px]">
                      {/* ✅ badge — всегда */}
                      <div className="absolute left-2 top-2 z-10">
                        <span
                          className={cn(
                            "inline-flex items-center",
                            "h-7 px-3 rounded-[12px]",
                            "bg-white/88 backdrop-blur-xl",
                            "border border-amber-400/70",
                            "text-[12px] font-medium text-amber-700",
                            "shadow-[0_14px_40px_rgba(0,0,0,0.18)]",
                          )}
                        >
                          {p.badge}
                        </span>
                      </div>

                      {/* ✅ actions via ProductActions */}
                      <div
                        data-actions
                        className="absolute right-2 top-2 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <ProductActions
                          id={p.id}
                          snapshot={snapshot}
                          onOpenSpecs={() => {
                            window.location.href = p.href;
                          }}
                        />
                      </div>

                      <div className="relative aspect-[4/3] bg-black/[0.02] flex-shrink-0">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          priority={idx < 6}
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.88) 100%)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="px-5 pt-4 pb-5 flex flex-col justify-between min-h-[148px]">
                      <div>
                        <div className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                          {formatPrice(value, currency)}
                        </div>

                        <div className="mt-2 text-[14px] leading-snug text-black/70 line-clamp-2">
                          {p.title}
                        </div>
                      </div>

                      {/* ✅ визуально убрано ID (как ты хотел позже) */}
                      <div className="mt-2 text-[12px] text-transparent">—</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* dots */}
        <div data-reveal="dots" className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition cursor-pointer",
                i === page
                  ? "bg-black/70 shadow-[0_0_0_4px_rgba(0,0,0,0.08)]"
                  : "bg-black/15 hover:bg-black/30",
              )}
              aria-label={`Страница ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
