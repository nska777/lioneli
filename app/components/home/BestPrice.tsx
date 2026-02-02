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

type BestPriceUIItem = {
  id: string;
  title: string;
  href: string;
  image: string;

  price_rub: number;
  price_uzs: number;

  old_price_rub?: number | null;
  old_price_uzs?: number | null;

  discountPercent?: number | null;

  badge: string; // “Лучшая цена”
  skuLabel?: string | null;

  // ✅ как в BestSellers (Хит продаж): 1 строка капсом, без "• cat"
  brandLine?: string | null;
};

function calcOldFromDiscount(price: number, discountPercent?: number | null) {
  if (!discountPercent || discountPercent <= 0) return null;
  const d = discountPercent / 100;
  const old = price / (1 - d);
  if (!isFinite(old)) return null;
  return Math.round(old);
}

function safeNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// ✅ стабильно в рамках сессии, но рандом на новый заход (как BestSellers)
function getSessionPick(key: string): string[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(String);
  } catch {
    return null;
  }
}
function setSessionPick(key: string, ids: string[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(ids));
  } catch {}
}

function shuffle<T>(arr: T[], seed: number) {
  const a = [...arr];
  let s = seed >>> 0;
  const rnd = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toCapsLabel(v?: string | null) {
  const s = (v ?? "").trim();
  if (!s) return null;

  const low = s.toLowerCase();
  // алиасы как у тебя
  if (low === "scandi") return "SCANDY";
  if (low === "skandy") return "SCANDY";

  return s.toUpperCase();
}

function BestPriceBadge({
  text,
  discountPercent,
}: {
  text: string;
  discountPercent?: number | null;
}) {
  return (
    <span className="relative inline-flex h-7 items-center overflow-hidden rounded-[12px] px-3">
      {/* green radial base */}
      <span
        className="absolute inset-0 rounded-[12px]"
        style={{
          background:
            "radial-gradient(120% 140% at 30% 20%, #E8FFF2 0%, #BFF7D6 28%, #57E39A 55%, #17B868 78%, #0C7F45 100%)",
        }}
      />

      {/* inner gloss */}
      <span
        className="absolute inset-[1px] rounded-[11px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.10))",
        }}
      />

      {/* edge + shadow */}
      <span
        className="absolute inset-0 rounded-[12px]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(120,255,190,0.85), 0 10px 28px rgba(12,127,69,0.28)",
        }}
      />

      {/* shine on hover */}
      <span
        className="pointer-events-none absolute -left-[60%] top-0 h-full w-[60%] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.70) 50%, transparent 100%)",
          transform: "skewX(-20deg)",
        }}
      />

      {/* text */}
      <span className="relative z-10 inline-flex items-center text-[12px] font-semibold tracking-[0.04em] text-[#064B2A]">
        {text}
        {discountPercent ? (
          <span className="ml-2 text-[#064B2A]/80">−{discountPercent}%</span>
        ) : null}
      </span>
    </span>
  );
}

export default function BestPrice({
  title = "Лучшая цена",
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

  const list = useMemo<BestPriceUIItem[]>(() => {
    const all = (CATALOG_MOCK ?? []) as any[];

    const isBest = (p: any) => {
      const b = String(p.badge || "").toLowerCase();
      return b.includes("лучшая") || b.includes("best");
    };

    const need = Math.min(10, all.length);
    const best = all.filter(isBest);
    const used = new Set(best.map((p: any) => String(p.id)));
    const extra = all.filter((p: any) => !used.has(String(p.id)));

    const sessionKey = "lioneto_bestprice_pick_v2";
    let pickedIds: string[] | null = null;

    if (typeof window !== "undefined") {
      pickedIds = getSessionPick(sessionKey);
      if (!pickedIds) {
        const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
        const bestShuffled = shuffle(
          best.map((p: any) => String(p.id)),
          seed,
        );
        const extraShuffled = shuffle(
          extra.map((p: any) => String(p.id)),
          seed ^ 0x9e3779b9,
        );

        const ids = [...bestShuffled, ...extraShuffled].slice(0, need);
        setSessionPick(sessionKey, ids);
        pickedIds = ids;
      }
    }

    const byId = new Map(all.map((p: any) => [String(p.id), p]));
    const picked =
      pickedIds?.map((id) => byId.get(String(id))).filter(Boolean) ??
      [...best, ...extra].slice(0, need);

    return picked.map((p: any, idx: number) => {
      const discountPercent =
        typeof p.discountPercent === "number"
          ? p.discountPercent
          : idx % 3 === 0
            ? 20
            : idx % 5 === 0
              ? 35
              : null;

      const price_rub = safeNumber(p.price_rub ?? p.priceRUB ?? 0);
      const price_uzs = safeNumber(p.price_uzs ?? p.priceUZS ?? 0);

      const line =
        toCapsLabel(p.collection ?? null) ||
        toCapsLabel(p.brand ?? null) ||
        null;

      return {
        id: String(p.id),
        title: String(p.title ?? ""),
        href: `/product/${p.id}`,
        image: String(p.image ?? ""),

        price_rub,
        price_uzs,

        old_price_rub:
          (p as any).old_price_rub ?? (p as any).oldPriceRUB ?? null,
        old_price_uzs:
          (p as any).old_price_uzs ?? (p as any).oldPriceUZS ?? null,

        discountPercent,
        badge: "Лучшая цена",
        skuLabel: p.sku ? String(p.sku) : `ID: ${p.id}`,
        brandLine: line,
      };
    });
  }, []);

  // ✅ pages
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const calcPages = () => {
      const w = window.innerWidth;
      const perView = w >= 1024 ? 3 : w >= 768 ? 2 : 1;
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
      window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
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
          onStart: () => {
            actions.style.pointerEvents = "auto";
          },
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
          onComplete: () => {
            actions.style.pointerEvents = "none";
          },
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
        <div data-reveal="viewport" className={cn("mt-8 overflow-hidden")}>
          <div
            ref={trackRef}
            className="flex gap-6 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          >
            {list.map((p, idx) => {
              const price = currency === "RUB" ? p.price_rub : p.price_uzs;
              const oldRaw =
                currency === "RUB" ? p.old_price_rub : p.old_price_uzs;
              const oldCalc =
                oldRaw ?? calcOldFromDiscount(price, p.discountPercent);
              const old = oldCalc && oldCalc > price ? oldCalc : null;

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
                    "w-[260px] sm:w-[270px] md:w-[300px] lg:w-[360px]",
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-col h-full",
                      "border border-black/10 bg-white",
                      "rounded-[22px]",
                      "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
                      "transition",
                      "group-hover:-translate-y-[2px]",
                      "group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.10)]",
                    )}
                  >
                    <div className="relative overflow-hidden rounded-[22px]">
                      {/* ✅ premium green badge */}
                      <div className="absolute left-3 top-3 z-10">
                        <BestPriceBadge
                          text={p.badge}
                          discountPercent={p.discountPercent}
                        />
                      </div>

                      {/* actions */}
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

                      {/* image */}
                      <div className="relative aspect-[4/3] bg-white px-3 py-2">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                          priority={idx < 6}
                        />
                      </div>
                    </div>

                    {/* ✅ content — подсушено, без лишнего “воздуха” */}
                    <div className="px-5 pt-3 pb-3 min-h-[112px]">
                      <div className="flex items-baseline gap-3">
                        <div className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                          {formatPrice(price, currency)}
                        </div>
                        {old ? (
                          <div className="text-[12px] text-black/40 line-through">
                            {formatPrice(old, currency)}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-1.5 text-[13px] leading-snug text-black/70 line-clamp-2">
                        {p.title}
                      </div>

                      <div className="mt-2 text-[10px] tracking-[0.18em] uppercase text-black/40">
                        {p.brandLine ?? "—"}
                      </div>
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
