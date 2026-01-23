"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type SupplyNewsItem = {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  type?: "arrival" | "expected" | "update";
  dateLabel?: string;
  cover?: StrapiImage | null;
};

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function SupplyNewsSection({
  title = "Новости",
  items,
  hrefAll = "/news",
  autoplayMs = 6200,
}: {
  title?: string;
  items: SupplyNewsItem[];
  hrefAll?: string;
  autoplayMs?: number; // 0 = выключить
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => (items ?? []).filter(Boolean), [items]);

  const [perView, setPerView] = useState(3); // 1/2/3
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // drag/swipe
  const drag = useRef({
    active: false,
    startX: 0,
    startIndex: 0,
    dx: 0,
    pointerId: -1,
  });

  // responsive perView
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, list.length - perView);

  // keep index valid
  useEffect(() => {
    setIndex((v) => clamp(v, 0, maxIndex));
  }, [maxIndex]);

  // pause when tab hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden ? true : false);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // autoplay (по 1 шагу)
  useEffect(() => {
    if (!list.length) return;
    if (paused) return;
    if (autoplayMs <= 0) return;

    const id = window.setInterval(() => {
      setIndex((v) => (v >= maxIndex ? 0 : v + 1));
    }, autoplayMs);

    return () => window.clearInterval(id);
  }, [paused, autoplayMs, maxIndex, list.length]);

  const go = (i: number) => setIndex(clamp(i, 0, maxIndex));
  const next = () => go(index >= maxIndex ? 0 : index + 1);
  const prev = () => go(index <= 0 ? maxIndex : index - 1);

  // GSAP reveal (как у тебя)
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);
      const h = q('[data-news="h"]');
      const slider = q('[data-news="slider"]');

      gsap.set(h, { opacity: 0, y: 10 });
      gsap.set(slider, { opacity: 0, y: 14 });

      ScrollTrigger.create({
        trigger: rootRef.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(h, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
          gsap.to(slider, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: 0.06,
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // translate track
  const translatePct = -(index * (100 / perView));

  // drag handlers (только transform)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    drag.current.active = true;
    drag.current.startX = e.clientX;
    drag.current.startIndex = index;
    drag.current.dx = 0;
    drag.current.pointerId = e.pointerId;
    setPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !trackRef.current) return;
    if (e.pointerId !== drag.current.pointerId) return;

    drag.current.dx = e.clientX - drag.current.startX;

    const w = trackRef.current.getBoundingClientRect().width;
    const slideW = w / perView;
    const deltaSlides = drag.current.dx / slideW;

    trackRef.current.style.transform = `translate3d(calc(${translatePct}% + ${
      deltaSlides * 100
    }%), 0, 0)`;
  };

  const endDrag = () => {
    if (!drag.current.active || !trackRef.current) return;
    drag.current.active = false;

    const w = trackRef.current.getBoundingClientRect().width;
    const slideW = w / perView;
    const moved = drag.current.dx;

    // порог
    if (Math.abs(moved) > slideW * 0.18) {
      if (moved < 0) go(drag.current.startIndex + 1);
      else go(drag.current.startIndex - 1);
    } else {
      go(drag.current.startIndex);
    }

    trackRef.current.style.transform = "";

    window.setTimeout(() => setPaused(false), 260);
  };

  const onPointerUp = () => endDrag();
  const onPointerCancel = () => endDrag();

  // dots (кол-во позиций)
  const dots = maxIndex + 1;

  if (!list.length) return null;

  return (
    <section
      ref={rootRef}
      className="mx-auto w-full max-w-[1200px] px-4 py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div data-news="h" className="mb-8 flex items-end justify-between">
        <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-black/90">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          <Link
            href={hrefAll}
            className="hidden text-[13px] text-black/60 hover:text-black md:inline"
            onClick={() => setPaused(true)}
          >
            Все новости →
          </Link>

          {/* Arrows */}
          {dots > 1 ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => {
                  setPaused(true);
                  prev();
                  window.setTimeout(() => setPaused(false), 320);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-black/70 transition hover:text-black active:scale-[0.98]"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaused(true);
                  next();
                  window.setTimeout(() => setPaused(false), 320);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-black/70 transition hover:text-black active:scale-[0.98]"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Slider */}
      <div data-news="slider" className="relative">
        <div
          className="overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={trackRef}
            className="flex will-change-transform transition-transform duration-500 ease-out"
            style={{
              width: `${(list.length * 100) / perView}%`,
              transform: `translate3d(${translatePct}%, 0, 0)`,
            }}
          >
            {list.map((it) => (
              <div
                key={it.id}
                className="shrink-0 px-3"
                style={{ width: `${100 / list.length}%` }}
              >
                <article className="flex flex-col items-center text-center">
                  {/* image */}
                  <Link
                    href={`/news/${it.slug}`}
                    className={cn(
                      "relative block w-full overflow-hidden rounded-sm",
                      "transition-transform duration-300 will-change-transform",
                      "hover:scale-[1.01]",
                      "active:scale-[0.995]",
                    )}
                    onClick={() => setPaused(true)}
                  >
                    <div className="relative aspect-[16/9] w-full bg-black/[0.03]">
                      {it.cover?.url ? (
                        <Image
                          src={it.cover.url}
                          alt={it.cover.alternativeText || it.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-[12px] tracking-[0.2em] text-black/40">
                          NO IMAGE
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* title */}
                  <h3 className="mt-5 max-w-[360px] text-[16px] leading-[1.45] text-black/70">
                    {it.title}
                  </h3>

                  {/* button */}
                  <Link
                    href={`/news/${it.slug}`}
                    className={cn(
                      "mt-5 inline-flex items-center justify-center",
                      "h-10 min-w-[150px] px-6",
                      "border border-black/60 text-[14px] text-black/70",
                      "transition-transform duration-200 will-change-transform",
                      "hover:text-black hover:-translate-y-[1px]",
                      "active:translate-y-0 active:scale-[0.99]",
                    )}
                    onClick={() => setPaused(true)}
                  >
                    Подробнее
                  </Link>
                </article>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {dots > 1 ? (
          <div className="mt-7 flex items-center justify-center gap-2">
            {Array.from({ length: dots }).map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to ${i + 1}`}
                  onClick={() => {
                    setPaused(true);
                    go(i);
                    window.setTimeout(() => setPaused(false), 320);
                  }}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full border border-black/20 transition-transform",
                    active
                      ? "scale-[1.1] bg-black/70"
                      : "bg-black/10 hover:scale-[1.06]",
                  )}
                />
              );
            })}
          </div>
        ) : null}

        {/* Mobile arrows */}
        {dots > 1 ? (
          <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                prev();
                window.setTimeout(() => setPaused(false), 320);
              }}
              className="inline-flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-4 text-[13px] text-black/70 transition active:scale-[0.98]"
            >
              <ChevronLeft className="h-4 w-4" /> Назад
            </button>
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                next();
                window.setTimeout(() => setPaused(false), 320);
              }}
              className="inline-flex h-10 min-w-[140px] items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-4 text-[13px] text-black/70 transition active:scale-[0.98]"
            >
              Вперёд <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
