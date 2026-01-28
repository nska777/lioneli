// app/product/[id]/ui/ProductClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowUpRight,
} from "lucide-react";

import { useRegionLang } from "@/app/context/region-lang";
import { useShopState } from "@/app/context/shop-state";
import { formatPrice } from "@/app/lib/format/price";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type MegaPreview = {
  title: string;
  main: string;
  a: string;
  b: string;
};

type ProductVariant = {
  id: string; // "white" | "with-lift" | ...
  title: string; // "Белая" | "С подъёмным механизмом" | ...
  kind: "color" | "option";
  priceDeltaRUB?: number;
  priceDeltaUZS?: number;
  image?: string;
  gallery?: string[];
};

type ProductPageModel = {
  id: string;
  title: string;
  badge?: string;
  sku?: string;
  image: string;
  gallery: string[];
  price_rub: number;
  price_uzs: number;
  description?: string;
  extra?: {
    article?: string;
    size?: string;
    color?: string;
    material?: string;
  };
  related?: Array<{
    id: string;
    title: string;
    image: string;
    price_rub: number;
    price_uzs: number;
    href: string;
    badge?: string;
  }>;

  // ✅ варианты (цвет/модификация)
  variants?: ProductVariant[];

  // UX-связка
  brand?: string;
  category?: string;
  collectionHref?: string;
  categoryLabel?: string;
  collectionLabel?: string;
  collectionPreview?: MegaPreview;

  // ✅ витрина коллекции
  isCollection?: boolean;
};

export default function ProductClient({
  product,
}: {
  product: ProductPageModel;
}) {
  const router = useRouter();
  const { region } = useRegionLang();
  const currency: "RUB" | "UZS" = region === "ru" ? "RUB" : "UZS";

  const shop = useShopState();
  const { isFav, toggleFav, isInCart, addToCart, removeFromCart } = shop;

  // ✅ variants
  const variants = useMemo<ProductVariant[]>(
    () => (Array.isArray(product.variants) ? product.variants : []),
    [product.variants],
  );

  const defaultVariantId = variants.length ? String(variants[0].id) : "base";
  const [selectedVariantId, setSelectedVariantId] =
    useState<string>(defaultVariantId);

  // ✅ если пришёл другой товар — сбрасываем на дефолтный вариант
  useEffect(() => {
    setSelectedVariantId(defaultVariantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find((v) => String(v.id) === String(selectedVariantId)) ??
      variants[0] ??
      null
    );
  }, [variants, selectedVariantId]);

  const variantsKind = useMemo<"color" | "option" | null>(() => {
    if (!variants.length) return null;
    const k = variants[0]?.kind;
    return k === "color" || k === "option" ? k : "option";
  }, [variants]);

  const variantDelta = useMemo(() => {
    if (!selectedVariant) return 0;
    return currency === "RUB"
      ? Number(selectedVariant.priceDeltaRUB ?? 0) || 0
      : Number(selectedVariant.priceDeltaUZS ?? 0) || 0;
  }, [selectedVariant, currency]);

  // ✅ 1) нормализуем галерею (с учётом варианта)
  const galleryRaw = useMemo(() => {
    // если вариант задаёт свою галерею — используем её
    const vg = selectedVariant?.gallery?.filter(Boolean) ?? [];
    const variantGallery = vg.length ? vg : [];

    const g = variantGallery.length
      ? variantGallery
      : Array.isArray(product.gallery)
        ? product.gallery.filter(Boolean)
        : [];

    const base = g.length ? g : [product.image].filter(Boolean);

    const uniq: string[] = [];
    for (const src of base.map(String)) {
      if (src && !uniq.includes(src)) uniq.push(src);
    }

    // если вариант задаёт "image" и его нет в списке — добавим вперед
    const vi = selectedVariant?.image ? String(selectedVariant.image) : "";
    if (vi && !uniq.includes(vi)) uniq.unshift(vi);

    return uniq.length ? uniq : [product.image].filter(Boolean);
  }, [product.gallery, product.image, selectedVariant]);

  // ✅ 2) Для обычного товара: максимум 3 изображения
  const gallery = useMemo(() => {
    if (product.isCollection) return galleryRaw;
    return galleryRaw.slice(0, 3);
  }, [galleryRaw, product.isCollection]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const maxLen = Math.max(1, gallery.length);

  // ✅ при смене товара/варианта — сбрасываем индексы и лайтбокс
  useEffect(() => {
    setActiveIdx(0);
    setLightboxIdx(0);
    setLightboxOpen(false);
  }, [product.id, selectedVariantId]);

  useEffect(() => {
    const last = Math.max(0, gallery.length - 1);
    if (activeIdx > last) setActiveIdx(0);
    if (lightboxIdx > last) setLightboxIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.length]);

  const fav = isFav(product.id, selectedVariantId);
  const inCart = isInCart(product.id, selectedVariantId);

  const baseUnitPrice =
    currency === "RUB" ? product.price_rub : product.price_uzs;

  const unitPrice = baseUnitPrice + variantDelta;
  const totalPrice = unitPrice * qty;

  const toggleMainCart = () => {
    if (inCart) removeFromCart(product.id, selectedVariantId);
    else addToCart(product.id, qty, selectedVariantId);
  };

  const nextMain = () => setActiveIdx((v) => (v + 1) % maxLen);
  const prevMain = () => setActiveIdx((v) => (v - 1 + maxLen) % maxLen);

  const openLightbox = (idx: number) => {
    setActiveIdx(idx);
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const nextLb = () => setLightboxIdx((v) => (v + 1) % maxLen);
  const prevLb = () => setLightboxIdx((v) => (v - 1 + maxLen) % maxLen);

  useEffect(() => {
    if (lightboxOpen) setLightboxIdx(activeIdx);
  }, [lightboxOpen, activeIdx]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextLb();
      if (e.key === "ArrowLeft") prevLb();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, maxLen]);

  const hasCollection =
    !!product.collectionHref &&
    !!product.collectionLabel &&
    !!product.categoryLabel;

  const showCollectionCard = hasCollection && !product.isCollection;

  const showThumbs = gallery.length > 1;
  const thumbsCols =
    gallery.length === 2
      ? "grid-cols-2"
      : gallery.length === 3
        ? "grid-cols-3"
        : "grid-cols-4";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-8">
      {/* breadcrumbs */}
      <div className="mb-4 text-[12px] text-black/40">
        <Link href="/" className="hover:text-black/70">
          Главная
        </Link>{" "}
        /{" "}
        <Link href="/catalog" className="hover:text-black/70">
          Каталог
        </Link>
        {hasCollection ? (
          <>
            {" "}
            /{" "}
            <Link
              href={`/category/${product.category}`}
              className="hover:text-black/70"
            >
              {product.categoryLabel}
            </Link>{" "}
            /{" "}
            <Link
              href={product.collectionHref!}
              className="hover:text-black/70"
            >
              {product.collectionLabel}
            </Link>
          </>
        ) : null}{" "}
        / <span className="text-black/60">{product.title}</span>
      </div>

      {/* top row */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={() => router.push("/catalog")}
          className={cn(
            "cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2",
            "border-black/10 bg-white text-[12px] tracking-[0.16em] uppercase text-black/70",
            "hover:border-black/20 hover:text-black transition",
          )}
          type="button"
        >
          ← НАЗАД
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFav(product.id, selectedVariantId)}
            className={cn(
              "cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2",
              "border-black/10 bg-white text-[13px] text-black/75 hover:border-black/20 hover:text-black transition",
            )}
            type="button"
          >
            <Heart
              className={cn("h-4 w-4", fav && "fill-current text-rose-600")}
            />
            В избранное
          </button>

          <button
            onClick={toggleMainCart}
            className={cn(
              "cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2",
              "text-[13px] text-white transition bg-black hover:bg-black/90",
            )}
            type="button"
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? "В корзине" : "В корзину"}
          </button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[520px_1fr]">
        {/* LEFT */}
        <section>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-black/[0.03]">
            <button
              type="button"
              onClick={() => openLightbox(activeIdx)}
              className="absolute inset-0 cursor-zoom-in"
              aria-label="Открыть фото в полный размер"
            />

            <Image
              src={gallery[activeIdx]}
              alt={product.title}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 520px"
            />

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevMain();
                  }}
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 z-10",
                    "h-11 w-11 rounded-full bg-white/90 border border-black/10",
                    "grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
                    "hover:bg-white transition cursor-pointer",
                  )}
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="h-5 w-5 text-black/70" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextMain();
                  }}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 z-10",
                    "h-11 w-11 rounded-full bg-white/90 border border-black/10",
                    "grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
                    "hover:bg-white transition cursor-pointer",
                  )}
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="h-5 w-5 text-black/70" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openLightbox(activeIdx);
              }}
              className={cn(
                "absolute right-3 bottom-3 z-10",
                "h-10 w-10 rounded-full bg-white/90 border border-black/10",
                "grid place-items-center shadow-[0_10px_30px_rgba(0,0,0,0.10)]",
                "hover:bg-white transition cursor-pointer",
              )}
              aria-label="Открыть в полный размер"
            >
              <Maximize2 className="h-4 w-4 text-black/70" />
            </button>
          </div>

          {showThumbs ? (
            <div className={cn("mt-3 grid gap-2", thumbsCols)}>
              {gallery.map((src, i) => {
                const active = i === activeIdx;
                return (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      "cursor-pointer relative aspect-square overflow-hidden rounded-2xl bg-black/[0.03] transition",
                      active
                        ? "ring-2 ring-black/20"
                        : "hover:ring-2 hover:ring-black/10",
                    )}
                    aria-label={`Фото ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="120px"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>

        {/* RIGHT */}
        <aside>
          <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
            {product.title}
          </h1>

          {/* ✅ Варианты (цвет/модификация) */}
          {variants.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] tracking-[0.18em] uppercase text-black/45">
                {variantsKind === "color" ? "Цвет" : "Модификация"}
              </div>

              {variantsKind === "color" ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const active = String(v.id) === String(selectedVariantId);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(String(v.id))}
                        className={cn(
                          "cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-semibold transition",
                          active
                            ? "border-black/25 bg-black/[0.04] text-black"
                            : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black",
                        )}
                        aria-label={`Вариант: ${v.title}`}
                      >
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full border",
                            active
                              ? "border-black/30 bg-black/30"
                              : "border-black/20 bg-black/10",
                          )}
                        />
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 inline-flex overflow-hidden rounded-full border border-black/10 bg-white">
                  {variants.map((v) => {
                    const active = String(v.id) === String(selectedVariantId);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(String(v.id))}
                        className={cn(
                          "cursor-pointer px-4 py-2 text-[12px] font-semibold transition",
                          active
                            ? "bg-black text-white"
                            : "bg-white text-black/70 hover:text-black hover:bg-black/[0.03]",
                        )}
                      >
                        {v.title}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* маленькое подтверждение выбора */}
              {selectedVariant?.title ? (
                <div className="mt-2 text-[12px] text-black/55">
                  Выбрано:{" "}
                  <span className="font-semibold text-black/75">
                    {selectedVariant.title}
                  </span>
                </div>
              ) : null}

              {/* наценка */}
              {variantDelta !== 0 && (
                <div className="mt-1 text-[12px] text-black/55">
                  Наценка:{" "}
                  <span className="font-semibold text-black/75">
                    {formatPrice(Math.abs(variantDelta), currency)}
                  </span>{" "}
                  {variantDelta > 0 ? "↑" : "↓"}
                </div>
              )}
            </div>
          )}

          <div className="mt-3 flex items-start justify-between gap-6">
            <div className="text-[28px] font-semibold text-black">
              {formatPrice(totalPrice, currency)}
            </div>

            <div className="shrink-0">
              <div className="inline-flex h-10 items-center overflow-hidden border border-black/20 bg-white">
                <button
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="cursor-pointer grid h-10 w-10 place-items-center border-r border-black/20 hover:bg-black/[0.03] transition"
                  aria-label="Минус"
                  type="button"
                >
                  <Minus className="h-4 w-4 text-black/70" />
                </button>

                <div className="grid h-10 w-10 place-items-center text-[13px] font-medium text-black/80">
                  {qty}
                </div>

                <button
                  onClick={() => setQty((v) => v + 1)}
                  className="cursor-pointer grid h-10 w-10 place-items-center border-l border-black/20 hover:bg-black/[0.03] transition"
                  aria-label="Плюс"
                  type="button"
                >
                  <Plus className="h-4 w-4 text-black/70" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={toggleMainCart}
              className={cn(
                "cursor-pointer inline-flex items-center justify-center gap-2",
                "h-12 flex-1 rounded-none",
                "text-[13px] font-semibold transition active:scale-[0.99]",
                inCart
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-white text-black border border-black/20 hover:bg-black/[0.02]",
              )}
              type="button"
            >
              {inCart ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
              {inCart ? "Добавлено" : "В корзину"}
            </button>

            <button
              onClick={() => {
                shop.setOneClick(product.id, qty, selectedVariantId);
                router.push("/checkout?mode=oneclick");
              }}
              className={cn(
                "cursor-pointer h-12 flex-1 rounded-none",
                "bg-black text-white text-[13px] font-semibold",
                "hover:bg-black/90 transition active:scale-[0.99]",
              )}
              type="button"
            >
              Купить в 1 клик
            </button>
          </div>

          {showCollectionCard && (
            <Link
              href={product.collectionHref!}
              className={cn(
                "mt-6 block rounded-3xl border border-black/10 bg-white p-3",
                "shadow-[0_35px_110px_-85px_rgba(0,0,0,0.35)]",
                "hover:border-black/20 transition cursor-pointer",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] tracking-[0.18em] uppercase text-black/45">
                    Коллекция
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-black/85">
                    {product.categoryLabel} / {product.collectionLabel}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full border border-black/10 bg-white grid place-items-center">
                  <ArrowUpRight className="h-4 w-4 text-black/60" />
                </div>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
                {product.collectionPreview?.main ? (
                  <Image
                    src={product.collectionPreview.main}
                    alt={product.collectionPreview.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
                    Нет превью
                  </div>
                )}
              </div>

              {!!product.collectionPreview?.title && (
                <div className="mt-3 text-[12px] font-semibold text-black/80">
                  {product.collectionPreview.title}
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
                  {product.collectionPreview?.a ? (
                    <Image
                      src={product.collectionPreview.a}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-black/5">
                  {product.collectionPreview?.b ? (
                    <Image
                      src={product.collectionPreview.b}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </Link>
          )}
        </aside>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-[16px] font-semibold text-black">Описание</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-black/70 whitespace-pre-line">
            {product.description || "—"}
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-black">
            Дополнительная информация
          </h2>

          <div className="mt-4 space-y-2 text-[13px] text-black/70">
            <Row
              label="Артикул"
              value={product.extra?.article || product.sku || "—"}
            />
            <Row label="Размер" value={product.extra?.size || "—"} />
            <Row label="Цвет" value={product.extra?.color || "—"} />
            <Row label="Материал" value={product.extra?.material || "—"} />
          </div>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="text-[20px] font-semibold text-black">
          {product.isCollection
            ? "Товары коллекции"
            : "С этим товаром покупают"}
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(product.related ?? []).slice(0, 4).map((p) => {
            const v = currency === "RUB" ? p.price_rub : p.price_uzs;
            const relInCart = isInCart(p.id); // related — base

            return (
              <Link key={p.id} href={p.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-black/[0.03]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-contain transition duration-700 group-hover:scale-[1.03]"
                    sizes="260px"
                  />
                </div>

                <div className="mt-3 text-[12px] text-black/55">
                  {formatPrice(v, currency)}
                </div>
                <div className="mt-1 text-[12px] leading-snug text-black/75 line-clamp-2">
                  {p.title}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (relInCart) removeFromCart(p.id);
                    else addToCart(p.id, 1);
                  }}
                  className={cn(
                    "mt-3 w-full h-10 rounded-none text-[12px] font-semibold transition cursor-pointer",
                    relInCart
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-black text-white hover:bg-black/90",
                  )}
                  type="button"
                >
                  {relInCart ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" /> Добавлено
                    </span>
                  ) : (
                    "В корзину"
                  )}
                </button>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/85"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-[1200px]">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black">
                <Image
                  src={gallery[lightboxIdx]}
                  alt={`${product.title} ${lightboxIdx + 1}`}
                  fill
                  className="object-contain"
                  sizes="1200px"
                />
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-white/95 grid place-items-center cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5 text-black/70" />
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevLb}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/95 grid place-items-center cursor-pointer"
                    aria-label="Назад"
                  >
                    <ChevronLeft className="h-6 w-6 text-black/70" />
                  </button>
                  <button
                    type="button"
                    onClick={nextLb}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/95 grid place-items-center cursor-pointer"
                    aria-label="Вперёд"
                  >
                    <ChevronRight className="h-6 w-6 text-black/70" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-[12px] text-black/70">
                    {lightboxIdx + 1} / {maxLen}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-[120px] shrink-0 text-black/45">{label}</div>
      <div className="flex-1 border-b border-dotted border-black/20 pb-1">
        {value}
      </div>
    </div>
  );
}
