"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type StrapiImage = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type CollectionItem = {
  id: string | number;
  title: string;
  description?: string;
  images: StrapiImage[];
  href?: string;
};

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

function resolveSrc(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  // public paths: /images/...
  if (url.startsWith("/images/")) return url;

  // Strapi relative: /uploads/...
  if (url.startsWith("/uploads")) {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL || "";
    return `${base}${url}`;
  }

  // fallback
  return url.startsWith("/") ? url : `/${url}`;
}

export default function CollectionsSlider({
  collections,
  autoplayMs = 7500, // коллекции
  imageAutoplayMs = 2600, // фотки внутри коллекции
}: {
  collections: CollectionItem[];
  autoplayMs?: number;
  imageAutoplayMs?: number;
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  const safeCollections = useMemo(
    () => (collections || []).filter((c) => c?.images?.length),
    [collections],
  );

  const [activeCollection, setActiveCollection] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hoverPause, setHoverPause] = useState(false);

  // manual hold timer refs (чтобы не залипало)
  const manualHoldRef = useRef(false);
  const holdTimeoutRef = useRef<number | null>(null);

  const holdFor = (ms = 4000) => {
    manualHoldRef.current = true;
    if (holdTimeoutRef.current) window.clearTimeout(holdTimeoutRef.current);
    holdTimeoutRef.current = window.setTimeout(() => {
      manualHoldRef.current = false;
      holdTimeoutRef.current = null;
    }, ms);
  };

  const current = safeCollections[activeCollection];
  const currentImages = current?.images || [];
  const currentImg = currentImages[activeImage];

  // Reveal лёгкий
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const title = root.querySelector("[data-col-title]");
      const wrap = root.querySelector("[data-col-wrap]");
      const thumbs = root.querySelector("[data-col-thumbs]");

      gsap.set([title, wrap, thumbs], { autoAlpha: 0, y: 10 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(title, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(wrap, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.25")
        .to(thumbs, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.35");
    }, root);

    return () => ctx.revert();
  }, []);

  // смена коллекции -> сброс фото
  useEffect(() => {
    setActiveImage(0);
  }, [activeCollection]);

  // ✅ Autoplay collections (устойчивый)
  useEffect(() => {
    if (!autoplayMs) return;
    if (safeCollections.length <= 1) return;

    const tick = () => {
      if (hoverPause || lightboxOpen || manualHoldRef.current) return;
      setActiveCollection((p) => clampIndex(p + 1, safeCollections.length));
    };

    const id = window.setInterval(tick, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, safeCollections.length, hoverPause, lightboxOpen]);

  // ✅ Autoplay images (устойчивый)
  useEffect(() => {
    if (!imageAutoplayMs) return;
    if (currentImages.length <= 1) return;

    const tick = () => {
      if (hoverPause || lightboxOpen || manualHoldRef.current) return;
      setActiveImage((p) => clampIndex(p + 1, currentImages.length));
    };

    const id = window.setInterval(tick, imageAutoplayMs);
    return () => window.clearInterval(id);
  }, [imageAutoplayMs, currentImages.length, hoverPause, lightboxOpen]);

  // Keyboard for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        holdFor(2500);
        setActiveImage((p) => clampIndex(p + 1, currentImages.length));
      }
      if (e.key === "ArrowLeft") {
        holdFor(2500);
        setActiveImage((p) => clampIndex(p - 1, currentImages.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, currentImages.length]);

  // cleanup hold timeout
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) window.clearTimeout(holdTimeoutRef.current);
    };
  }, []);

  if (!safeCollections.length) return null;

  const goPrevCollection = () => {
    holdFor();
    setActiveCollection((p) => clampIndex(p - 1, safeCollections.length));
  };
  const goNextCollection = () => {
    holdFor();
    setActiveCollection((p) => clampIndex(p + 1, safeCollections.length));
  };

  const goPrevImage = () => {
    holdFor(3500);
    setActiveImage((p) => clampIndex(p - 1, currentImages.length));
  };
  const goNextImage = () => {
    holdFor(3500);
    setActiveImage((p) => clampIndex(p + 1, currentImages.length));
  };

  return (
    <section
      ref={rootRef}
      className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-10 md:pb-14 md:pt-14"
      aria-label="Коллекции"
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[11px] tracking-[0.22em] text-black/45">
            LIONETO • COLLECTIONS
          </div>
          <h2
            data-col-title
            className="mt-2 text-[28px] font-semibold leading-[1.06] tracking-[-0.02em] text-black md:text-[40px]"
          >
            Коллекции
          </h2>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            aria-label="Предыдущая коллекция"
            onClick={goPrevCollection}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full",
              "border border-black/10 bg-white",
              "shadow-[0_10px_28px_rgba(0,0,0,0.06)]",
              "transition hover:-translate-y-[1px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]",
              "active:translate-y-0",
            )}
            style={{ cursor: "pointer" }}
          >
            <ChevronLeft className="h-5 w-5 text-black/70" />
          </button>
          <button
            type="button"
            aria-label="Следующая коллекция"
            onClick={goNextCollection}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full",
              "border border-black/10 bg-white",
              "shadow-[0_10px_28px_rgba(0,0,0,0.06)]",
              "transition hover:-translate-y-[1px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]",
              "active:translate-y-0",
            )}
            style={{ cursor: "pointer" }}
          >
            <ChevronRight className="h-5 w-5 text-black/70" />
          </button>
        </div>
      </div>

      {/* Main */}
      <div
        data-col-wrap
        className="mt-6 grid gap-7 md:mt-8 md:grid-cols-12 md:gap-10"
      >
        <button
          type="button"
          onClick={() => {
            holdFor(2500);
            setLightboxOpen(true);
          }}
          className={cn(
            "relative overflow-hidden rounded-2xl md:col-span-7",
            "border border-black/10 bg-white",
            "shadow-[0_22px_60px_rgba(0,0,0,0.08)]",
            "transition hover:-translate-y-[1px] hover:shadow-[0_30px_80px_rgba(0,0,0,0.10)]",
          )}
          style={{ cursor: "pointer" }}
        >
          <div className="relative aspect-[4/3] w-full">
            {currentImg?.url ? (
              <Image
                src={resolveSrc(currentImg.url)}
                alt={currentImg.alternativeText || current.title}
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-black/5" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          {/* tiny indicator for debug (можешь убрать потом) */}
          <div className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-[12px] text-black/70">
            {activeCollection + 1}/{safeCollections.length} • {activeImage + 1}/
            {currentImages.length}
          </div>
        </button>

        <div className="md:col-span-5">
          <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.01em] text-black md:text-[22px]">
            {current.title}
          </h3>

          {current.description && (
            <p className="mt-3 whitespace-pre-line text-[14px] leading-[1.75] text-black/60 md:text-[15px]">
              {current.description}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2">
            {safeCollections.map((_, i) => (
              <button
                key={String(safeCollections[i].id)}
                type="button"
                aria-label={`Коллекция ${i + 1}`}
                onClick={() => {
                  holdFor();
                  setActiveCollection(i);
                }}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  i === activeCollection
                    ? "bg-black/70"
                    : "bg-black/20 hover:bg-black/35",
                )}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbs */}
      <div data-col-thumbs className="mt-6 md:mt-7">
        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {currentImages.map((img, i) => (
            <button
              key={`${current.id}-img-${i}`}
              type="button"
              onClick={() => {
                holdFor();
                setActiveImage(i);
              }}
              className={cn(
                "relative h-[86px] w-[140px] shrink-0 overflow-hidden rounded-xl",
                "border border-black/10 bg-white",
                "shadow-[0_10px_26px_rgba(0,0,0,0.06)]",
                "transition hover:-translate-y-[1px]",
                i === activeImage ? "ring-2 ring-black/35" : "ring-0",
              )}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={resolveSrc(img.url)}
                alt={img.alternativeText || `Фото ${i + 1}`}
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          {currentImages.slice(0, 7).map((_, i) => (
            <span
              key={`dot-${i}`}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                i === activeImage ? "bg-black/65" : "bg-black/18",
              )}
            />
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          title={current.title}
          images={currentImages}
          activeIndex={activeImage}
          onClose={() => setLightboxOpen(false)}
          onPrev={goPrevImage}
          onNext={goNextImage}
          onPick={(i) => {
            holdFor(3500);
            setActiveImage(i);
          }}
        />
      )}
    </section>
  );
}

function Lightbox({
  title,
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  onPick,
}: {
  title: string;
  images: StrapiImage[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPick: (i: number) => void;
}) {
  const img = images[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/65"
      role="dialog"
      aria-modal="true"
      aria-label={`Просмотр: ${title}`}
      onMouseDown={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div className="mx-auto grid h-full w-full max-w-[1200px] grid-rows-[auto_1fr_auto] px-4 py-6 md:py-10">
        <div className="flex items-center justify-between">
          <div className="text-[12px] tracking-[0.18em] text-white/70">
            {title} • {activeIndex + 1}/{images.length}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/14"
            style={{ cursor: "pointer" }}
            aria-label="Закрыть"
          >
            <X className="h-5 w-5 text-white/90" />
          </button>
        </div>

        <div className="mt-4 grid place-items-center">
          <div className="relative w-full max-w-[1100px] overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10">
            <div className="relative h-[70vh] w-full md:h-[74vh]">
              {img?.url ? (
                <Image
                  src={resolveSrc(img.url)}
                  alt={img.alternativeText || title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-contain"
                  priority
                />
              ) : null}
            </div>

            <button
              type="button"
              onClick={onPrev}
              aria-label="Предыдущее фото"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/14"
              style={{ cursor: "pointer" }}
            >
              <ChevronLeft className="h-5 w-5 text-white/90" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Следующее фото"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:bg-white/14"
              style={{ cursor: "pointer" }}
            >
              <ChevronRight className="h-5 w-5 text-white/90" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((t, i) => (
            <button
              key={`lb-${i}`}
              type="button"
              onClick={() => onPick(i)}
              className={cn(
                "relative h-[58px] w-[90px] shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15 transition",
                i === activeIndex
                  ? "ring-2 ring-white/55"
                  : "opacity-80 hover:opacity-100",
              )}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={resolveSrc(t.url)}
                alt={t.alternativeText || `thumb ${i + 1}`}
                fill
                sizes="90px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
