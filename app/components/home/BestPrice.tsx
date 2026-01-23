"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  ListChecks,
} from "lucide-react";

import { useRegionLang } from "../../context/region-lang";
import { useShopState } from "../../context/shop-state";

gsap.registerPlugin(ScrollTrigger);

type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type BestPriceItem = {
  id: string;
  title: string;
  subtitle?: string;
  sku?: string;
  href?: string;

  image: StrapiImage;

  price_uzs: number;
  price_rub: number;

  old_price_uzs?: number | null;
  old_price_rub?: number | null;

  discountPercent?: number | null; // если есть, но нет old_price — посчитаем
};

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

function pickPrice(item: BestPriceItem, region: "uz" | "ru") {
  return region === "ru" ? item.price_rub : item.price_uzs;
}
function pickOldPriceRaw(item: BestPriceItem, region: "uz" | "ru") {
  const v = region === "ru" ? item.old_price_rub : item.old_price_uzs;
  return typeof v === "number" ? v : null;
}
function calcOldFromDiscount(price: number, discountPercent?: number | null) {
  if (!discountPercent || discountPercent <= 0) return null;
  const d = discountPercent / 100;
  const old = price / (1 - d);
  if (!isFinite(old)) return null;
  return Math.round(old);
}

// ✅ fallback (БЕЗ ДУБЛЕЙ — иначе будет ошибка key)
const fallbackItems: BestPriceItem[] = [
  {
    id: "bp-1",
    title: "Шкаф Makassar — лучшая цена",
    sku: "Арт. MR7116",
    href: "/product/makassar-wardrobe",
    image: { url: "/mock/bed-1.jpg", alternativeText: "Makassar" },
    price_rub: 158674,
    old_price_rub: 198674,
    price_uzs: 23800000,
    old_price_uzs: 29800000,
  },
  {
    id: "bp-2",
    title: "Кровать 160x200 Modena",
    sku: "Арт. KP6820",
    href: "/product/modena-160",
    image: { url: "/mock/bed-2.jpg", alternativeText: "Modena" },
    price_rub: 147274,
    old_price_rub: 179900,
    price_uzs: 22100000,
    old_price_uzs: 27000000,
  },
  {
    id: "bp-3",
    title: "Кровать 140x200 Signoria",
    subtitle: "Бежевая роза",
    href: "/product/signoria-140",
    image: { url: "/mock/bed-3.jpg", alternativeText: "Signoria" },
    price_rub: 70704,
    old_price_rub: 141408,
    price_uzs: 10600000,
    old_price_uzs: 21200000,
    discountPercent: 50,
  },
  {
    id: "bp-4",
    title: "Комод Modena — скидка",
    sku: "Арт. K603",
    href: "/product/komod-modena",
    image: { url: "/products/4.jpg", alternativeText: "Modena" },
    price_rub: 139800,
    discountPercent: 20, // ✅ покажем зачеркнутую цену даже если old_price нет
    price_uzs: 19900000,
  },
  {
    id: "bp-5",
    title: "Тумба прикроватная Makassar",
    sku: "Арт. MR701",
    href: "/product/makassar",
    image: { url: "/products/3.jpg", alternativeText: "Makassar" },
    price_rub: 58700,
    old_price_rub: 73900,
    price_uzs: 8350000,
    old_price_uzs: 10400000,
  },
];

export default function BestPrice({
  title = "Лучшая цена",
  items,
  onOpenSpecs,
}: {
  title?: string;
  items?: BestPriceItem[];
  onOpenSpecs?: (item: BestPriceItem) => void;
}) {
  const { region } = useRegionLang();
  const currency: "RUB" | "UZS" = region === "ru" ? "RUB" : "UZS";

  const { favorites, toggleFav, cart, toggleCart } = useShopState();

  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => (items?.length ? items : fallbackItems), [items]);

  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // ❤️ pop (как BestSellers)
  const pop = (el: HTMLElement, kind: "on" | "off" = "on") => {
    if (reducedMotion) return;
    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: "50% 50%" });

    const amp = kind === "on" ? 1.24 : 1.14;
    const rot = kind === "on" ? -10 : 6;

    gsap.fromTo(
      el,
      { scale: 1, rotate: 0 },
      {
        scale: amp,
        rotate: rot,
        duration: 0.18,
        ease: "power3.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => gsap.set(el, { rotate: 0, scale: 1 }),
      },
    );
  };

  // 🛒 pop лёгкий
  const popCart = (el: HTMLElement) => {
    if (reducedMotion) return;
    gsap.killTweensOf(el);
    gsap.set(el, { transformOrigin: "50% 50%" });
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 1.18,
        duration: 0.16,
        ease: "power3.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => gsap.set(el, { scale: 1 }),
      },
    );
  };

  // ✅ страницы: desktop = 3 (и 4-я слегка выглядывает)
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

  // ✅ листание трека
  useLayoutEffect(() => {
    if (!rootRef.current || !trackRef.current) return;

    const card = trackRef.current.querySelector(
      "[data-card]",
    ) as HTMLElement | null;
    if (!card) return;

    const gap = 24; // gap-6
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

  // ✅ hover actions show/hide (GSAP)
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

  // ✅ reveal (wind+blur+clip)
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

        {/* viewport (3 карточки упираются в контейнер + 4-я еле выглядывает на lg) */}
        <div data-reveal="viewport" className={cn("mt-8 overflow-hidden")}>
          <div
            ref={trackRef}
            className={cn("flex gap-6 will-change-transform", "justify-start")}
            style={{ transform: "translateZ(0)" }}
          >
            {list.map((p, idx) => {
              const price = pickPrice(p, region);
              const oldRaw = pickOldPriceRaw(p, region);
              const oldCalc =
                oldRaw ?? calcOldFromDiscount(price, p.discountPercent);
              const old = oldCalc && oldCalc > price ? oldCalc : null;

              const fav = favorites.includes(p.id);
              const inCart = (cart[p.id] ?? 0) > 0;

              return (
                <Link
                  key={`${p.id}-${idx}`} // ✅ фикс "same key"
                  href={p.href ?? "#"}
                  data-card
                  className={cn(
                    "group block shrink-0 cursor-pointer",
                    // ✅ 3 влезают в контент контейнера, 4-я еле выглядывает (~40px) на 1200 max
                    "w-[260px] sm:w-[270px] md:w-[300px] lg:w-[360px]",
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
                      {/* actions */}
                      <div
                        data-actions
                        className="absolute right-2 top-2 z-20 flex flex-col gap-2"
                      >
                        {/* fav */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const svg = (e.currentTarget.querySelector("svg") ||
                              e.currentTarget) as HTMLElement;

                            pop(svg, fav ? "off" : "on");
                            toggleFav(p.id);
                          }}
                          className={cn(
                            "h-9 w-9 rounded-full grid place-items-center",
                            "bg-white/88 backdrop-blur-xl",
                            "border border-black/10",
                            "shadow-[0_14px_40px_rgba(0,0,0,0.16)]",
                            "cursor-pointer transition",
                          )}
                          aria-label={
                            fav ? "Убрать из избранного" : "В избранное"
                          }
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4 transition",
                              fav
                                ? "text-rose-500 fill-rose-500"
                                : "text-black/70",
                            )}
                          />
                        </button>

                        {/* cart */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const svg = (e.currentTarget.querySelector("svg") ||
                              e.currentTarget) as HTMLElement;
                            popCart(svg);

                            toggleCart(p.id);
                          }}
                          className={cn(
                            "h-9 w-9 rounded-full grid place-items-center",
                            "bg-white/88 backdrop-blur-xl",
                            "border border-black/10",
                            "shadow-[0_14px_40px_rgba(0,0,0,0.16)]",
                            "cursor-pointer transition",
                            inCart ? "ring-1 ring-emerald-500/40" : "",
                          )}
                          aria-label={
                            inCart ? "Убрать из корзины" : "Добавить в корзину"
                          }
                        >
                          <ShoppingCart
                            className={cn(
                              "h-4 w-4 transition",
                              inCart ? "text-emerald-600" : "text-black/70",
                            )}
                          />
                        </button>

                        {/* specs (без alert) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenSpecs?.(p);
                          }}
                          className={cn(
                            "h-9 w-9 rounded-full grid place-items-center",
                            "bg-white/88 backdrop-blur-xl",
                            "border border-black/10",
                            "shadow-[0_14px_40px_rgba(0,0,0,0.16)]",
                            "cursor-pointer transition",
                          )}
                          aria-label="Характеристики"
                        >
                          <ListChecks className="h-4 w-4 text-black/70" />
                        </button>
                      </div>

                      {/* image */}
                      <div className="relative aspect-[4/3] bg-black/[0.02] flex-shrink-0">
                        <Image
                          src={p.image.url}
                          alt={p.image.alternativeText ?? p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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

                    {/* content */}
                    <div className="px-5 pt-4 pb-5 flex flex-col justify-between min-h-[148px]">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <div className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                            {formatPrice(price, currency)}
                          </div>

                          {old ? (
                            <div className="text-[12px] text-black/40 line-through">
                              {formatPrice(old, currency)}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-2 text-[14px] leading-snug text-black/70 line-clamp-2">
                          {p.title}
                          {p.subtitle ? ` ${p.subtitle}` : ""}
                        </div>
                      </div>

                      {p.sku ? (
                        <div className="mt-2 text-[12px] text-black/35">
                          {p.sku}
                        </div>
                      ) : (
                        <div className="mt-2 text-[12px] text-transparent">
                          —
                        </div>
                      )}
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
