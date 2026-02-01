"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string; // "12 JAN"
  tag?: string; // "COLLECTION"
  image?: string; // "/news/1.jpg"
};

const FALLBACK_IMAGES = [
  "/hero/1.jpg",
  "/hero/2.jpg",
  "/hero/3.jpg",
  "/hero/4.jpg",
  "/hero/5.jpg",
  "/hero/6.jpg",
];

function getTmpImage(n: NewsItem, idx: number) {
  return (
    n.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length] || "/hero/1.jpg"
  );
}

export default function NewsSection({
  items = [
    {
      id: "n1",
      title: "Новая коллекция: мягкая геометрия и тёплые фактуры",
      excerpt:
        "Показываем материалы, оттенки и новые решения для гостиной — спокойно и премиально.",
      dateLabel: "12 JAN",
      tag: "COLLECTION",
      image: "/hero/1.jpg",
    },
    {
      id: "n2",
      title: "Как выбрать ткань: износостойкость без компромиссов",
      excerpt:
        "Разбираем параметры, которые реально важны в жизни: плотность, тесты, уход.",
      dateLabel: "06 JAN",
      tag: "GUIDE",
      image: "/hero/2.jpg",
    },
    {
      id: "n3",
      title: "Доставка и сервис: что входит в стандарт Lioneto",
      excerpt:
        "Упаковка, занос, сборка и поддержка — всё объясняем коротко и по делу.",
      dateLabel: "28 DEC",
      tag: "SERVICE",
      image: "/hero/3.jpg",
    },
    {
      id: "n4",
      title: "Материалы премиум-класса: шпон, массив, честные покрытия",
      excerpt:
        "Собрали базу по материалам: как отличить качество и что влияет на срок службы.",
      dateLabel: "19 DEC",
      tag: "MATERIALS",
      image: "/hero/4.jpg",
    },
  ] as NewsItem[],
  href = "/news", // ✅ /news
  title = "Новости",
  subtitle = "Только важное: коллекции, сервис и материалы",
}: {
  items?: NewsItem[];
  href?: string;
  title?: string;
  subtitle?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = useState(0);

  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  const canPrev = index > 0;
  const canNext = index < Math.max(0, items.length - 1);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-card]"),
    );
    const el = cards[i];
    if (!el) return;

    const left = el.offsetLeft - 8;
    track.scrollTo({ left, behavior: "smooth" });
    setIndex(i);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-card]"),
      );
      if (!cards.length) return;

      const x = track.scrollLeft;
      let best = 0;
      let bestDist = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const d = Math.abs(cards[i].offsetLeft - x);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      setIndex(best);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const header = root.querySelector<HTMLElement>("[data-head]");
      const cards = root.querySelectorAll<HTMLElement>("[data-card]");

      if (header) {
        const kids = header.querySelectorAll<HTMLElement>("[data-head-item]");
        gsap.set(kids, { autoAlpha: 0, y: 16 });
        gsap.to(kids, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: header, start: "top 88%", once: true },
        });
      }

      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 18, scale: 0.992 });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef} className="bg-white text-black">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        {/* Header */}
        <div data-head className="pt-10 md:pt-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div
                data-head-item
                className="text-[12px] tracking-[0.18em] text-black/50"
              >
                LIONETO • NEWS
              </div>
              <h2
                data-head-item
                className="mt-2 text-[22px] font-semibold tracking-[-0.01em] md:text-[30px]"
              >
                {title}
              </h2>
              <p
                data-head-item
                className="mt-2 max-w-2xl text-[14px] leading-7 text-black/70"
              >
                {subtitle}
              </p>
            </div>

            {/* Actions */}
            <div data-head-item className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => canPrev && scrollToIndex(index - 1)}
                className={cn(
                  "group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white transition",
                  canPrev
                    ? "border-black/15 hover:border-black/25"
                    : "cursor-not-allowed border-black/10 opacity-50",
                )}
                aria-label="Назад"
              >
                <ChevronLeft className="h-5 w-5 text-black/70 transition group-hover:-translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => canNext && scrollToIndex(index + 1)}
                className={cn(
                  "group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white transition",
                  canNext
                    ? "border-black/15 hover:border-black/25"
                    : "cursor-not-allowed border-black/10 opacity-50",
                )}
                aria-label="Вперед"
              >
                <ChevronRight className="h-5 w-5 text-black/70 transition group-hover:translate-x-0.5" />
              </button>

              {/* ✅ ВСЕ НОВОСТИ -> /news */}
              <Link
                href={href}
                className="group ml-2 inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition hover:opacity-90"
              >
                ВСЕ НОВОСТИ
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Track */}
        <div className="relative mt-7">
          {/* Fade edges (оставляем, они снаружи, не на карточках) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-[linear-gradient(270deg,rgba(255,255,255,1),rgba(255,255,255,0))]" />

          <div
            ref={trackRef}
            className={cn(
              "flex gap-4 overflow-x-auto pb-2 pr-2",
              "scrollbar-hide snap-x snap-mandatory",
            )}
          >
            {items.map((n, i) => {
              const imgSrc = getTmpImage(n, i);

              return (
                <Link
                  key={n.id}
                  href={href} // ✅ карточка -> /news
                  data-card
                  className={cn(
                    "group relative min-w-[290px] max-w-[290px] snap-start cursor-pointer",
                    "overflow-hidden rounded-[28px] border border-black/10 bg-white",
                    "shadow-[0_18px_60px_rgba(0,0,0,0.06)] transition",
                    "hover:-translate-y-0.5 hover:border-black/20",
                    "active:translate-y-0",
                    "md:min-w-[360px] md:max-w-[360px]",
                  )}
                  aria-label={`Открыть новость: ${n.title}`}
                >
                  {/* top media */}
                  <div className="relative h-[170px] w-full overflow-hidden md:h-[190px]">
                    <Image
                      src={imgSrc}
                      alt={n.title}
                      fill
                      sizes="(max-width: 768px) 290px, 360px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      priority={i < 2}
                    />

                    {/* ✅ НИКАКОГО белого засвета: только лёгкий затемняющий низ */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.22))]" />

                    {/* ✅ Apple-style badges: glass/white pill, выраженные */}
                    <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                      {n.tag ? (
                        <div className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-black/80 shadow-[0_10px_25px_rgba(0,0,0,0.10)] backdrop-blur-md">
                          {n.tag}
                        </div>
                      ) : null}

                      <div className="rounded-full border border-white/50 bg-white/55 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-black/75 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-md">
                        {n.dateLabel}
                      </div>
                    </div>
                  </div>

                  {/* content */}
                  <div className="relative p-5">
                    <div className="text-[11px] tracking-[0.18em] text-black/45">
                      НОВОСТЬ {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="mt-2 text-[16px] font-semibold leading-[1.15] tracking-[-0.01em] text-black/85">
                      {n.title}
                    </div>

                    <p className="mt-2 text-[13px] leading-6 text-black/65">
                      {n.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-[12px] tracking-[0.18em] text-black/45">
                        ОТКРЫТЬ
                      </div>

                      {/* ✅ "Читать" -> /news (и не даём всплывать клику) */}
                      <Link
                        href={href}
                        className="relative z-20 inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] font-medium tracking-[0.12em] text-black/75 transition hover:border-black/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Читать
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* bottom mini nav */}
        <div className="mt-5 flex items-center justify-between pb-10 md:pb-14">
          <div className="text-[12px] tracking-[0.18em] text-black/45">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-2">
            {items.slice(0, 6).map((_, i) => {
              const on = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  className={cn(
                    "h-2.5 w-2.5 cursor-pointer rounded-full border transition",
                    on
                      ? "border-black/35 bg-black/30"
                      : "border-black/15 bg-white hover:border-black/25",
                  )}
                  aria-label={`Перейти к новости ${i + 1}`}
                />
              );
            })}
          </div>

          {/* ✅ ВСЕ НОВОСТИ -> /news */}
          <Link
            href={href}
            className="inline-flex cursor-pointer items-center gap-2 text-[12px] tracking-[0.18em] text-black/60 transition hover:text-black"
          >
            ВСЕ НОВОСТИ <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
