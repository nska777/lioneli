"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type NewsTag = "Поступление" | "Обновление" | "Акция" | "Событие";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string; // "12 января 2026"
  tag: NewsTag;
  slug: string;
  image?: { url: string };
};

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

const TAGS: Array<"Все" | NewsTag> = [
  "Все",
  "Поступление",
  "Обновление",
  "Акция",
  "Событие",
];

// ✅ мок — потом заменишь на Strapi (ниже напишу как)
const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "Поступление коллекции Salvador",
    excerpt:
      "Новые позиции в неоклассике: обновлённые оттенки и расширенный модульный ряд.",
    dateLabel: "12 января 2026",
    tag: "Поступление",
    slug: "salvador-arrival",
    image: { url: "/images/home/collections/1.jpg" },
  },
  {
    id: "n2",
    title: "Обновление: улучшили фурнитуру и упаковку",
    excerpt:
      "Перешли на более надежные крепления и защитную упаковку для идеальной доставки.",
    dateLabel: "05 января 2026",
    tag: "Обновление",
    slug: "hardware-update",
    image: { url: "/images/home/collections/4.jpg" },
  },
  {
    id: "n3",
    title: "Акция на спальни — ограниченное предложение",
    excerpt:
      "Сдержанные условия, понятная выгода — действует на избранные позиции.",
    dateLabel: "28 декабря 2025",
    tag: "Акция",
    slug: "bedroom-sale",
    image: { url: "/images/home/collections/7.jpg" },
  },
  {
    id: "n4",
    title: "Событие: обновление экспозиции в шоуруме",
    excerpt:
      "Добавили новые интерьерные решения, чтобы удобнее выбирать комплектацию.",
    dateLabel: "15 декабря 2025",
    tag: "Событие",
    slug: "showroom-update",
    image: { url: "/images/home/collections/10.jpg" },
  },
];

function TagPill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none rounded-full border px-4 py-2 text-[12px] font-medium tracking-[0.12em] transition",
        active
          ? "border-black/20 bg-black text-white"
          : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black",
      )}
    >
      {children}
    </button>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article
      data-reveal
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-black/10 bg-white",
        "transition hover:border-black/20",
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {item.image?.url ? (
          <Image
            src={item.image.url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-black/[0.04]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35),transparent_55%)]" />

        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] tracking-[0.14em] text-white backdrop-blur">
            {item.tag.toUpperCase()}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-[12px] tracking-[0.16em] text-white/80">
            {item.dateLabel.toUpperCase()}
          </div>
          <div className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[18px]">
            {item.title}
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[14px] leading-7 text-black/70">{item.excerpt}</p>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href={`/news/${item.slug}`}
            className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium tracking-[0.18em] text-black/80 transition hover:text-black"
          >
            ЧИТАТЬ{" "}
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          <span className="text-[11px] tracking-[0.18em] text-black/40">
            LIONETO
          </span>
        </div>
      </div>
    </article>
  );
}

export default function NewsPageClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [tag, setTag] = useState<(typeof TAGS)[number]>("Все");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return mockNews.filter((it) => {
      const okTag = tag === "Все" ? true : it.tag === tag;
      const okQ =
        !qq ||
        it.title.toLowerCase().includes(qq) ||
        it.excerpt.toLowerCase().includes(qq) ||
        it.tag.toLowerCase().includes(qq);
      return okTag && okQ;
    });
  }, [tag, q]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <div ref={rootRef}>
      {/* Панель фильтров */}
      <div
        className={cn(
          "sticky top-0 z-10 -mx-4 mb-6 border-y border-black/10 bg-white/80 px-4 py-4 backdrop-blur",
          "md:static md:mx-0 md:mb-8 md:border md:rounded-3xl md:py-5",
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <TagPill key={t} active={t === tag} onClick={() => setTag(t)}>
                {t === "Все" ? "ВСЕ" : t.toUpperCase()}
              </TagPill>
            ))}
          </div>

          <div className="w-full md:w-[360px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по новостям…"
              className={cn(
                "w-full rounded-2xl border border-black/10 bg-white px-4 py-3",
                "text-[14px] text-black/80 outline-none transition",
                "focus:border-black/25",
              )}
            />
          </div>
        </div>
      </div>

      {/* Сетка новостей */}
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {items.map((it) => (
            <NewsCard key={it.id} item={it} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-8 text-center">
          <div className="text-[12px] tracking-[0.18em] text-black/50">
            НИЧЕГО НЕ НАЙДЕНО
          </div>
          <div className="mt-2 text-[16px] font-semibold text-black/85">
            Попробуй изменить фильтр или запрос
          </div>
        </div>
      )}

      {/* Подписка */}
      <div
        data-reveal
        className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-10"
      >
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="text-[12px] tracking-[0.18em] text-black/50">
              ПОДПИСКА НА НОВОСТИ
            </div>
            <div className="mt-2 text-[18px] font-semibold tracking-[-0.01em] md:text-[26px]">
              Получайте поступления и акции на почту
            </div>
            <p className="mt-3 text-[14px] leading-7 text-black/70">
              Без спама. Только важные обновления по бренду и коллекциям.
            </p>
          </div>

          <div className="md:col-span-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: тут подключим реальную подписку (Strapi/Sendgrid/Mailchimp)
                alert("Готово! (пока мок, дальше подключим реальную отправку)");
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] text-black/80 outline-none transition focus:border-black/25"
              />
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-black px-4 py-3 text-[12px] font-medium tracking-[0.18em] text-white transition hover:opacity-90"
              >
                ПОДПИСАТЬСЯ
              </button>
              <div className="text-[11px] leading-5 text-black/45">
                Нажимая «Подписаться», вы соглашаетесь на обработку данных.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
