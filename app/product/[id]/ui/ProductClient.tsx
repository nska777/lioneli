"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  ArrowUpRight,
} from "lucide-react";

import { useRegionLang } from "@/app/context/region-lang";
import { useShopState } from "@/app/context/shop-state";
import { formatPrice } from "@/app/lib/format/price";

import ProductGallery from "./ProductGallery";
import ProductVariants from "./ProductVariants";
import ProductLightbox from "./ProductLightbox";
import ProductRelated from "./ProductRelated";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

type MegaPreview = {
  title: string;
  main: string;
  a: string;
  b: string;
};

export type ProductVariant = {
  id: string; // "white" | "with-lift" | ...
  title: string; // "Белая" | "С подъёмным механизмом" | ...
  kind: "color" | "option";
  priceDeltaRUB?: number;
  priceDeltaUZS?: number;
  image?: string;
  gallery?: string[];
};

export type ProductPageModel = {
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

    const vi = selectedVariant?.image ? String(selectedVariant.image) : "";
    if (vi && !uniq.includes(vi)) uniq.unshift(vi);

    return uniq.length ? uniq : [product.image].filter(Boolean);
  }, [product.gallery, product.image, selectedVariant]);

  // ✅ 2) Для обычного товара: максимум 3 изображения
  const gallery = useMemo(() => {
    if (product.isCollection) return galleryRaw;
    return galleryRaw.slice(0, 3);
  }, [galleryRaw, product.isCollection]);

  // ----- gallery state (НЕ меняем логику) -----
  const [activeIdx, setActiveIdx] = useState(0);

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

  // ----- qty + cart -----
  const [qty, setQty] = useState(1);

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

  // ----- breadcrumbs helpers -----
  const hasCollection =
    !!product.collectionHref &&
    !!product.collectionLabel &&
    !!product.categoryLabel;

  const showCollectionCard = hasCollection && !product.isCollection;

  // ✅ выводим коллекцию рядом с названием (то что ты просил)
  const collectionBadge = String(product.brand || product.collectionLabel || "")
    .trim()
    .toUpperCase();

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
          onClick={() => router.back()} // ✅ сохраняет выбранные фильтры (не сбрасывает)
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
        <ProductGallery
          title={product.title}
          gallery={gallery}
          activeIdx={activeIdx}
          setActiveIdx={setActiveIdx}
          onPrev={prevMain}
          onNext={nextMain}
          onOpenLightbox={openLightbox}
        />

        {/* RIGHT */}
        <aside>
          {collectionBadge ? (
            <div className="mb-2 inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-black/55">
              Коллекция: {collectionBadge}
            </div>
          ) : null}

          <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
            {product.title}
          </h1>

          {/* ✅ Варианты (цвет/модификация) */}
          <ProductVariants
            variants={variants}
            variantsKind={variantsKind}
            selectedVariantId={selectedVariantId}
            setSelectedVariantId={setSelectedVariantId}
            selectedVariantTitle={selectedVariant?.title || ""}
            variantDelta={variantDelta}
            currency={currency}
          />

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
                {/* оставим как было: если нет превью — покажем текст */}
                {/* (логика не меняется) */}
                {/* превью рендерится в page.tsx как product.collectionPreview */}
                {/* здесь только UI */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {product.collectionPreview?.main ? (
                  // next/image не обязателен тут, но лучше оставим Link-картинку на потом
                  <div className="absolute inset-0" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-black/40">
                    Нет превью
                  </div>
                )}
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

      <ProductRelated
        title={
          product.isCollection ? "Товары коллекции" : "С этим товаром покупают"
        }
        items={(product.related ?? []).slice(0, 4)}
        currency={currency}
      />

      <ProductLightbox
        open={lightboxOpen}
        title={product.title}
        gallery={gallery}
        idx={lightboxIdx}
        setIdx={setLightboxIdx}
        onClose={() => setLightboxOpen(false)}
        onPrev={prevLb}
        onNext={nextLb}
      />
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
