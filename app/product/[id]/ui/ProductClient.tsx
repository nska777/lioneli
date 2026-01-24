"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react";

import { useRegionLang } from "@/app/context/region-lang";
import { useShopState } from "@/app/context/shop-state";
import { CATALOG_MOCK } from "@/app/lib/mock/catalog-products";

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

type Product = {
  id: string;
  title: string;
  badge?: string;
  href?: string;
  sku?: string;
  image: string;
  gallery: string[];
  price_rub: number;
  price_uzs: number;
  description?: string;
  specs?: Array<{ label: string; value: string }>;
  variants?: Array<{ label: string; swatch: string; id?: string }>;
};

function IconPill({
  active,
  onClick,
  icon,
  label,
  tone = "neutral",
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone?: "neutral" | "danger" | "success";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition",
        "bg-white/85 backdrop-blur-xl border-black/10 hover:border-black/20",
        tone === "danger" && active && "text-rose-600",
        tone === "success" && active && "text-emerald-600",
        !active && "text-black/75",
        active && tone === "neutral" && "text-black",
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ArrowBtn({
  dir,
  disabled,
  onClick,
  className,
}: {
  dir: "left" | "right";
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Назад" : "Вперёд"}
      className={cn(
        "cursor-pointer absolute top-1/2 -translate-y-1/2 z-10",
        "h-10 w-10 rounded-full grid place-items-center",
        "bg-white/85 backdrop-blur-xl border border-black/10",
        "shadow-[0_14px_40px_rgba(0,0,0,0.16)] transition",
        disabled
          ? "opacity-40 cursor-default"
          : "hover:bg-white hover:border-black/20",
        dir === "left" ? "left-3" : "right-3",
        className,
      )}
    >
      {dir === "left" ? (
        <ChevronLeft className="h-5 w-5 text-black/70" />
      ) : (
        <ChevronRight className="h-5 w-5 text-black/70" />
      )}
    </button>
  );
}

export default function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const { region } = useRegionLang();
  const currency: "RUB" | "UZS" = region === "ru" ? "RUB" : "UZS";

  const { isFav, toggleFav, isInCart, toggleCart } = useShopState();

  const fav = isFav(product.id);
  const inCart = isInCart(product.id);

  const gallery = useMemo(() => {
    const g = Array.isArray(product.gallery)
      ? product.gallery.filter(Boolean)
      : [];
    return g.length ? g : [product.image].filter(Boolean);
  }, [product.gallery, product.image]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // выбранный цвет (визуально)
  const variants = product.variants ?? [];
  const [variantIdx, setVariantIdx] = useState(0);

  // добавляем Width/Height в характеристики, если их нет
  const specs = useMemo(() => {
    const base = Array.isArray(product.specs) ? [...product.specs] : [];
    const hasW = base.some((s) => s.label.toLowerCase().includes("шир"));
    const hasH = base.some((s) => s.label.toLowerCase().includes("выс"));
    if (!hasW) base.push({ label: "Ширина", value: "—" });
    if (!hasH) base.push({ label: "Высота", value: "—" });
    return base;
  }, [product.specs]);

  const value = currency === "RUB" ? product.price_rub : product.price_uzs;

  // стрелки
  const canPrev = activeIdx > 0;
  const canNext = activeIdx < gallery.length - 1;

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(gallery.length - 1, i + 1));

  // клавиши (в лайтбоксе)
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setActiveIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setActiveIdx((i) => Math.min(gallery.length - 1, i + 1));
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, gallery.length]);

  // “Что покупают с этим товаром” — 2 карточки (предпочтительно хиты)
  const related = useMemo(() => {
    const all = (CATALOG_MOCK ?? []) as any[];
    const isHit = (p: any) => {
      const b = String(p.badge || "").toLowerCase();
      return b.includes("хит") || b.includes("bestseller");
    };

    const pool = all.filter((p) => String(p.id) !== String(product.id));
    const hits = pool.filter(isHit);
    const pick = (hits.length ? hits : pool).slice(0, 2);

    return pick.map((p) => ({
      id: String(p.id),
      title: p.title,
      image: p.image,
      badge: isHit(p) ? "Хит продаж" : "",
      price_rub: Number(p.price_rub ?? 0),
      price_uzs: Number(p.price_uzs ?? 0),
      href: `/product/${p.id}`,
    }));
  }, [product.id]);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8">
      {/* top bar */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={() => router.push("/catalog")}
          className={cn(
            "cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] tracking-[0.16em] uppercase transition",
            "border-black/10 bg-white hover:border-black/20 text-black/70 hover:text-black",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </button>

        <div className="flex items-center gap-2">
          <IconPill
            tone="danger"
            active={fav}
            onClick={() => toggleFav(product.id)}
            icon={<Heart className={cn("h-4 w-4", fav && "fill-current")} />}
            label="В избранное"
          />
          <IconPill
            tone="success"
            active={inCart}
            onClick={() => toggleCart(product.id)}
            icon={
              <ShoppingCart
                className={cn("h-4 w-4", inCart && "fill-current")}
              />
            }
            label={inCart ? "В корзине" : "В корзину"}
          />
        </div>
      </div>

      {/* main grid */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
        {/* left: gallery */}
        <section>
          <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-black/[0.02]">
            {product.badge ? (
              <div className="absolute left-4 top-4 z-10">
                <span
                  className={cn(
                    "inline-flex items-center h-7 px-3 rounded-[12px]",
                    "bg-white/88 backdrop-blur-xl",
                    "border border-amber-400/70",
                    "text-[12px] font-medium text-amber-700",
                    "shadow-[0_14px_40px_rgba(0,0,0,0.18)]",
                  )}
                >
                  {product.badge}
                </span>
              </div>
            ) : null}

            <ArrowBtn dir="left" disabled={!canPrev} onClick={prev} />
            <ArrowBtn dir="right" disabled={!canNext} onClick={next} />

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="cursor-pointer relative block w-full aspect-[16/10]"
              aria-label="Открыть фото в полном размере"
            >
              <Image
                src={gallery[activeIdx]}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.00) 40%, rgba(0,0,0,0.08) 100%)",
                }}
              />
            </button>
          </div>

          {/* thumbs */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-[12px] text-black/50">
                Нажми на фото, чтобы открыть в полном размере
              </div>
              <div className="text-[12px] text-black/40">
                {activeIdx + 1}/{gallery.length}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.slice(0, 3).map((src, i) => {
                const idx = i; // первые 3
                const active = idx === activeIdx;
                return (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      "cursor-pointer relative overflow-hidden rounded-2xl border bg-white",
                      active
                        ? "border-black/30"
                        : "border-black/10 hover:border-black/20",
                    )}
                    style={{ aspectRatio: "16/10" }}
                    aria-label={`Открыть фото ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 33vw, 220px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* right: info */}
        <aside className="h-fit rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.35)]">
          <div className="text-[11px] tracking-[0.28em] text-black/40">
            LIONETO
          </div>
          <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-black">
            {product.title}
          </h1>

          {product.sku ? (
            <div className="mt-1 text-[13px] text-black/55">
              Артикул: <span className="text-black/75">{product.sku}</span>
            </div>
          ) : null}

          {/* price card */}
          <div className="mt-5 rounded-[22px] border border-black/10 bg-white p-5">
            <div className="text-[10px] tracking-[0.18em] uppercase text-black/45">
              Цена
            </div>
            <div className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
              {formatPrice(value, currency)}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => toggleCart(product.id)}
                className={cn(
                  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium transition",
                  inCart
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-black text-white hover:bg-black/90",
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                {inCart ? "В корзине" : "Добавить в корзину"}
              </button>

              <button
                onClick={() => toggleFav(product.id)}
                className={cn(
                  "cursor-pointer inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium transition",
                  "border border-black/10 bg-white hover:border-black/20 text-black/75 hover:text-black",
                )}
              >
                <Heart
                  className={cn("h-4 w-4", fav && "fill-current text-rose-500")}
                />
                {fav ? "В избранном" : "В избранное"}
              </button>
            </div>
          </div>

          {/* variants */}
          {variants.length ? (
            <div className="mt-6">
              <div className="text-[10px] tracking-[0.18em] uppercase text-black/45">
                Цвет
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((v, i) => {
                  const active = i === variantIdx;
                  return (
                    <button
                      key={`${v.label}-${i}`}
                      onClick={() => setVariantIdx(i)}
                      className={cn(
                        "cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] transition",
                        active
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black/70 hover:text-black hover:border-black/20",
                      )}
                    >
                      <span
                        className={cn(
                          "h-3.5 w-3.5 rounded-full border",
                          active ? "border-white/35" : "border-black/10",
                        )}
                        style={{ background: v.swatch }}
                      />
                      {v.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-[12px] text-black/55">
                Выбрано:{" "}
                <span className="text-black/75">
                  {variants[variantIdx]?.label}
                </span>
              </div>
            </div>
          ) : null}

          {/* description */}
          <div className="mt-6">
            <div className="text-[10px] tracking-[0.18em] uppercase text-black/45">
              Описание
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-black/70">
              {product.description || "—"}
            </p>
          </div>

          {/* specs */}
          <div className="mt-6">
            <div className="text-[10px] tracking-[0.18em] uppercase text-black/45">
              Характеристики
            </div>

            <div className="mt-3 space-y-2">
              {specs.map((s, i) => (
                <div
                  key={`${s.label}-${i}`}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3"
                >
                  <div className="text-[12px] text-black/55">{s.label}</div>
                  <div className="text-[12px] font-medium text-black/80">
                    {s.value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* related */}
      <section className="mt-10">
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-black">
          Что покупают с этим товаром
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {related.map((p) => {
            const relValue = currency === "RUB" ? p.price_rub : p.price_uzs;

            return (
              <Link
                key={p.id}
                href={p.href}
                className={cn(
                  "group block overflow-hidden rounded-3xl border border-black/10 bg-white",
                  "shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition hover:border-black/20",
                )}
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 520px"
                  />
                  {p.badge ? (
                    <div className="absolute left-3 top-3">
                      <span
                        className={cn(
                          "inline-flex items-center h-7 px-3 rounded-[12px]",
                          "bg-white/88 backdrop-blur-xl",
                          "border border-amber-400/70",
                          "text-[12px] font-medium text-amber-700",
                          "shadow-[0_14px_40px_rgba(0,0,0,0.18)]",
                        )}
                      >
                        {p.badge}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="p-4">
                  <div className="text-[13px] font-medium text-black/85 line-clamp-2">
                    {p.title}
                  </div>
                  <div className="mt-2 text-[15px] font-semibold text-black">
                    {formatPrice(relValue, currency)}
                  </div>
                  <div className="mt-3 text-[11px] tracking-[0.18em] uppercase text-black/45">
                    Открыть товар →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* lightbox */}
      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
          onMouseDown={(e) => {
            // закрываем только если клик по фону
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[1100px]">
              <button
                className={cn(
                  "cursor-pointer absolute -top-12 right-0",
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2",
                  "bg-white/85 backdrop-blur-xl border-white/20 text-white",
                  "hover:bg-white/90 hover:text-black transition",
                )}
                onClick={() => setLightboxOpen(false)}
              >
                <X className="h-4 w-4" />
                Закрыть
              </button>

              <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-black">
                <ArrowBtn
                  dir="left"
                  disabled={!canPrev}
                  onClick={prev}
                  className="border-white/15 bg-white/10 hover:bg-white/15"
                />
                <ArrowBtn
                  dir="right"
                  disabled={!canNext}
                  onClick={next}
                  className="border-white/15 bg-white/10 hover:bg-white/15"
                />

                <div className="relative w-full aspect-[16/10]">
                  <Image
                    src={gallery[activeIdx]}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1200px) 100vw, 1100px"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-white/75">
                <span>
                  {activeIdx + 1}/{gallery.length}
                </span>
                <span className="text-white/35">•</span>
                <span>←/→ переключение, ESC закрыть</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
