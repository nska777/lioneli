"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  image: string;
};

const NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Новая коллекция: спокойная геометрия",
    excerpt:
      "Современные формы, тактильные материалы и акцент на долговечность.",
    dateLabel: "12 JAN",
    image: "/hero/1.jpg",
  },
  {
    id: "n2",
    title: "Как мы подбираем материалы",
    excerpt:
      "Рассказываем, почему используем только проверенные покрытия и фурнитуру.",
    dateLabel: "06 JAN",
    image: "/hero/2.jpg",
  },
  {
    id: "n3",
    title: "Сервис и доставка Lioneto",
    excerpt:
      "Контроль на каждом этапе — от производства до установки у клиента.",
    dateLabel: "28 DEC",
    image: "/hero/3.jpg",
  },
];

export default function NewsSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const reduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-news-card]");
      gsap.set(cards, { autoAlpha: 0, y: 20, scale: 0.98 });

      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-news-card]");
    const el = cards[i];
    if (!el) return;

    track.scrollTo({
      left: el.offsetLeft - 8,
      behavior: "smooth",
    });
    setIndex(i);
  };

  return (
    <section ref={rootRef} className="bg-white">
      <div className="mx-auto max-w-[1200px] px-4">
        {/* HEADER */}
        <div className="pt-14 flex items-end justify-between gap-6">
          <div>
            <div className="text-[12px] tracking-[0.18em] text-black/50">
              LIONETO • NEWS
            </div>
            <h2 className="mt-2 text-[22px] font-semibold md:text-[30px]">
              Новости
            </h2>
            <p className="mt-2 max-w-xl text-[14px] text-black/65">
              Обновления по бренду, коллекциям и сервису
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => index > 0 && scrollTo(index - 1)}
              className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:border-black/30 transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => index < NEWS.length - 1 && scrollTo(index + 1)}
              className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:border-black/30 transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* NEWS TRACK */}
        <div
          ref={trackRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {NEWS.map((n, i) => (
            <Link
              key={n.id}
              href="/catalog"
              data-news-card
              className={cn(
                "group snap-start min-w-[300px] md:min-w-[360px]",
                "cursor-pointer overflow-hidden rounded-[28px]",
                "border border-black/10 bg-white",
                "shadow-[0_18px_60px_rgba(0,0,0,0.06)]",
                "transition hover:-translate-y-1 hover:border-black/20",
              )}
            >
              {/* IMAGE */}
              <div className="relative h-[190px] overflow-hidden">
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5">
                <div className="text-[11px] tracking-[0.18em] text-black/45">
                  НОВОСТЬ · {n.dateLabel}
                </div>

                <div className="mt-2 text-[16px] font-semibold text-black/85">
                  {n.title}
                </div>

                <p className="mt-2 text-[13px] leading-6 text-black/65">
                  {n.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[12px] tracking-[0.18em] text-black/50">
                    ОТКРЫТЬ
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* TELEGRAM SUBSCRIBE */}
        <div className="mt-14 rounded-[30px] border border-black/10 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[12px] tracking-[0.18em] text-black/50">
                ПОДПИСКА НА НОВОСТИ
              </div>
              <h3 className="mt-2 text-[20px] font-semibold md:text-[24px]">
                Получайте поступления и акции в Telegram
              </h3>
              <p className="mt-2 max-w-xl text-[14px] text-black/65">
                Без спама. Только важные обновления по бренду и коллекциям.
              </p>
            </div>

            <a
              href="https://t.me/your_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-6 py-3 text-[13px] font-medium tracking-[0.12em] text-white transition hover:opacity-90"
            >
              ПЕРЕЙТИ В TELEGRAM
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
