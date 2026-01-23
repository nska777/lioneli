"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type SaleTag = "Распродажа" | "Подборка" | "Спеццена" | "Новая цена";

type SaleItem = {
  id: string;
  title: string;
  excerpt: string;
  period: string;
  tag: SaleTag;
  href: string;
  image: string;
  highlight?: string;
};

const TAGS: Array<"Все" | SaleTag> = [
  "Все",
  "Распродажа",
  "Подборка",
  "Спеццена",
  "Новая цена",
];

const mockSale: SaleItem[] = [
  {
    id: "s1",
    tag: "Распродажа",
    title: "Зимняя распродажа спальни",
    excerpt:
      "Избранные позиции и комплекты. Сдержанные условия, понятная выгода.",
    period: "до 31 января",
    href: "/catalog",
    image: "/images/home/collections/1.jpg",
    highlight: "-20%",
  },
  {
    id: "s2",
    tag: "Спеццена",
    title: "Спеццены на гостиные",
    excerpt:
      "Подборка мебели для гостиной: фокус на материалах, финише и функциональности.",
    period: "до 15 февраля",
    href: "/catalog",
    image: "/images/home/collections/4.jpg",
    highlight: "SALE",
  },
  {
    id: "s3",
    tag: "Подборка",
    title: "Комплекты для прихожей",
    excerpt:
      "Лаконичные решения, чтобы быстро собрать аккуратный входной блок.",
    period: "ограничено",
    href: "/catalog",
    image: "/images/home/collections/7.jpg",
    highlight: "SET",
  },
  {
    id: "s4",
    tag: "Новая цена",
    title: "Новая цена на кабинеты",
    excerpt:
      "Рабочее пространство в премиальном стиле: строгая геометрия и удобство.",
    period: "пока действует",
    href: "/catalog",
    image: "/images/home/collections/10.jpg",
    highlight: "NEW",
  },
];

function Pill({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none rounded-full border px-4 py-2 text-[12px] font-medium tracking-[0.16em] transition",
        active
          ? "border-black/20 bg-black text-white"
          : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black",
      )}
    >
      {label}
    </button>
  );
}

function SaleCard({ item }: { item: SaleItem }) {
  return (
    <article
      data-reveal
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-black/10 bg-white",
        "transition hover:border-black/20",
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),transparent_58%)]" />

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] tracking-[0.14em] text-white backdrop-blur">
            {item.tag.toUpperCase()}
          </span>

          {item.highlight && (
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white backdrop-blur">
              {item.highlight}
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-[12px] tracking-[0.16em] text-white/80">
            {item.period.toUpperCase()}
          </div>
          <h3 className="mt-2 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-white md:text-[18px]">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[14px] leading-7 text-black/70">{item.excerpt}</p>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href={item.href}
            className="inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium tracking-[0.18em] text-black/80 transition hover:text-black"
          >
            СМОТРЕТЬ <ArrowUpRight className="h-4 w-4" />
          </Link>

          <span className="text-[11px] tracking-[0.18em] text-black/40">
            LIONETO
          </span>
        </div>
      </div>
    </article>
  );
}

export default function SaleClient() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [tag, setTag] = useState<(typeof TAGS)[number]>("Все");

  const items = useMemo(() => {
    if (tag === "Все") return mockSale;
    return mockSale.filter((it) => it.tag === tag);
  }, [tag]);

  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduce) return;

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
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
              once: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <div ref={rootRef}>
      <div
        data-reveal
        className={cn(
          "rounded-3xl border border-black/10 bg-white p-5 md:p-6",
          "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        )}
      >
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <Pill
              key={t}
              active={t === tag}
              label={t === "Все" ? "ВСЕ" : t.toUpperCase()}
              onClick={() => setTag(t)}
            />
          ))}
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.02] px-4 py-2 text-[12px] tracking-[0.18em] text-black/60">
          <Sparkles className="h-4 w-4" />
          АКТУАЛЬНЫЕ ПРЕДЛОЖЕНИЯ
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
        {items.map((it) => (
          <SaleCard key={it.id} item={it} />
        ))}
      </div>

      <div
        data-reveal
        className="mt-10 rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-10"
      >
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="text-[12px] tracking-[0.18em] text-black/50">
              НУЖНА КОНСУЛЬТАЦИЯ?
            </div>
            <div className="mt-2 text-[18px] font-semibold tracking-[-0.01em] md:text-[26px]">
              Подберём коллекцию и комплектацию
            </div>
            <p className="mt-3 text-[14px] leading-7 text-black/70">
              Напишите нам или перейдите в каталог — покажем актуальные
              предложения.
            </p>
          </div>

          <div className="md:col-span-5 flex gap-3 md:justify-end">
            <Link
              href="/catalog"
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-black px-5 py-3 text-[12px] font-medium tracking-[0.18em] text-white transition hover:opacity-90"
            >
              В КАТАЛОГ →
            </Link>

            <Link
              href="/contacts"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-[12px] font-medium tracking-[0.18em] text-black/80 transition hover:border-black/25 hover:text-black"
            >
              КОНТАКТЫ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
