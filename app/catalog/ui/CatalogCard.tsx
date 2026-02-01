"use client";

import Image from "next/image";
import Link from "next/link";

import ProductActions from "../ProductActions";
import { useShopState } from "@/app/context/shop-state"; // ⚠️ проверь путь

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function GreenPremiumBadge({ text }: { text: string }) {
  return (
    <span className="relative inline-flex h-7 items-center overflow-hidden rounded-[12px] px-3">
      <span
        className="absolute inset-0 rounded-[12px]"
        style={{
          background:
            "radial-gradient(120% 140% at 30% 20%, #E8FFF2 0%, #BFF7D6 28%, #57E39A 55%, #17B868 78%, #0C7F45 100%)",
        }}
      />
      <span
        className="absolute inset-[1px] rounded-[11px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.10))",
        }}
      />
      <span
        className="absolute inset-0 rounded-[12px]"
        style={{
          boxShadow:
            "0 0 0 1px rgba(120,255,190,0.85), 0 10px 28px rgba(12,127,69,0.22)",
        }}
      />
      <span
        className="pointer-events-none absolute -left-[60%] top-0 h-full w-[60%] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.70) 50%, transparent 100%)",
          transform: "skewX(-20deg)",
        }}
      />
      <span className="relative z-10 text-[12px] font-semibold tracking-[0.04em] text-[#064B2A]">
        {text}
      </span>
    </span>
  );
}

export default function CatalogCard({
  p,
  idx,
  fmtPrice,
}: {
  p: Record<string, any>;
  idx: number;
  fmtPrice: (rub: number, uzs: number) => string;
}) {
  const { addToCart, isInCart } = useShopState();

  const catalogPath =
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/catalog";

  const href = `/product/${p.id}?from=${encodeURIComponent(catalogPath)}`;

  const snapshot = {
    title: p.title,
    href,
    imageUrl: p.image,
    sku: p.sku ? String(p.sku) : null,
    price_uzs: Number(p.price_uzs ?? p.priceUZS ?? 0),
    price_rub: Number(p.price_rub ?? p.priceRUB ?? 0),
  };

  const imgSrc = String(p.image ?? "").trim() || "/placeholder.png";

  // ✅ персистентное состояние: если в корзине — "Добавлено" и закрашено
  const added = isInCart(String(p.id));

  return (
    <article
      data-card
      className={cn(
        "group h-full overflow-hidden rounded-2xl",
        "border border-black/10 bg-white",
        "shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
      )}
    >
      <Link href={href} className="flex h-full flex-col">
        {/* IMAGE (contain + compact) */}
        <div className="relative aspect-[16/11] overflow-hidden bg-white px-3 py-2">
          <Image
            key={imgSrc}
            src={imgSrc}
            alt={String(p.title ?? "")}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={cn(
              "object-contain object-center",
              "transition-transform duration-500",
              "group-hover:scale-[1.02]",
            )}
            priority={idx < 6}
          />

          {p.badge ? (
            <div className="absolute left-3 top-3 z-10">
              <GreenPremiumBadge text={String(p.badge)} />
            </div>
          ) : null}

          <div className="absolute right-3 top-3 z-10 flex translate-y-[-6px] gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ProductActions
                id={String(p.id)}
                snapshot={snapshot}
                onOpenSpecs={() => {
                  window.location.href = href;
                }}
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-4 pt-3 pb-3 flex flex-col">
          <div
            className="text-[14px] font-medium leading-[20px] text-black/90 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical" as any,
              WebkitLineClamp: 2,
              maxHeight: 40,
            }}
          >
            {p.title}
          </div>

          <div className="mt-2 text-[15px] font-semibold text-black">
            {fmtPrice(
              Number(p.price_rub ?? p.priceRUB ?? 0),
              Number(p.price_uzs ?? p.priceUZS ?? 0),
            )}
          </div>

          {/* ✅ BUTTON */}
          <div className="mt-auto pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // если уже в корзине — ничего не делаем (состояние и так "Добавлено")
                if (!added) addToCart(String(p.id), 1);
              }}
              className={cn(
                "lionetoCartBtn relative h-10 w-full overflow-hidden rounded-xl",
                "inline-flex items-center justify-center",
                // текст заметнее
                "text-[12px] font-semibold tracking-[0.14em] uppercase",
                "transition cursor-pointer",
                "active:scale-[0.99]",
                added ? "isAdded" : "isIdle",
              )}
              aria-label={added ? "Добавлено в корзину" : "Добавить в корзину"}
            >
              {/* moving fill (slides) — только когда НЕ added */}
              <span className="bgSlide pointer-events-none absolute inset-0 opacity-0" />
              {/* glass gloss */}
              <span className="glass pointer-events-none absolute inset-[1px] rounded-[11px] opacity-0" />
              {/* moving shine */}
              <span className="shine pointer-events-none absolute -left-[60%] top-0 h-full w-[55%] opacity-0" />

              <span className="relative z-10">
                {added ? "Добавлено" : "В корзину"}
              </span>
            </button>

            <style jsx>{`
              /* ---------- IDLE (glass) ---------- */
              .lionetoCartBtn.isIdle {
                border: 1px solid rgba(0, 0, 0, 0.14);
                color: rgba(0, 0, 0, 0.82);
                background: rgba(255, 255, 255, 0.72);
                box-shadow:
                  inset 0 1px 0 rgba(255, 255, 255, 0.9),
                  0 10px 26px rgba(0, 0, 0, 0.06);
                backdrop-filter: blur(10px);
              }
              .lionetoCartBtn.isIdle:hover {
                border-color: rgba(215, 181, 107, 0.72);
                color: rgba(0, 0, 0, 0.92);
              }

              /* ---------- ADDED (filled) ---------- */
              .lionetoCartBtn.isAdded {
                border: 1px solid rgba(215, 181, 107, 0.75);
                color: rgba(90, 58, 0, 0.92);
                background: radial-gradient(
                  120% 140% at 30% 20%,
                  rgba(255, 241, 184, 0.98) 0%,
                  rgba(255, 211, 106, 0.92) 35%,
                  rgba(230, 169, 60, 0.86) 65%,
                  rgba(201, 138, 26, 0.82) 100%
                );
                box-shadow:
                  inset 0 1px 0 rgba(255, 255, 255, 0.65),
                  0 14px 34px rgba(201, 138, 26, 0.22);
              }
              .lionetoCartBtn.isAdded {
                cursor: default;
              }
              .lionetoCartBtn.isAdded .bgSlide,
              .lionetoCartBtn.isAdded .glass,
              .lionetoCartBtn.isAdded .shine {
                display: none;
              }

              /* ---------- hover slide animation (like video) ---------- */
              .lionetoCartBtn .bgSlide {
                background: linear-gradient(
                  90deg,
                  rgba(255, 241, 184, 0) 0%,
                  rgba(255, 241, 184, 0.9) 18%,
                  rgba(255, 211, 106, 0.9) 40%,
                  rgba(230, 169, 60, 0.86) 62%,
                  rgba(201, 138, 26, 0.84) 82%,
                  rgba(255, 241, 184, 0) 100%
                );
                background-size: 240% 100%;
                background-position: 0% 50%;
              }
              .lionetoCartBtn .glass {
                background: linear-gradient(
                  180deg,
                  rgba(255, 255, 255, 0.55),
                  rgba(255, 255, 255, 0.08)
                );
              }
              .lionetoCartBtn .shine {
                background: linear-gradient(
                  120deg,
                  transparent 0%,
                  rgba(255, 255, 255, 0.92) 50%,
                  transparent 100%
                );
                transform: skewX(-18deg);
              }

              /* hover: запускаем "проскальзывание" */
              .lionetoCartBtn.isIdle:hover .bgSlide {
                opacity: 1;
                animation: lioneto_bgSlide 900ms ease-out forwards;
              }
              .lionetoCartBtn.isIdle:hover .glass {
                opacity: 1;
                transition: opacity 180ms ease;
              }
              .lionetoCartBtn.isIdle:hover .shine {
                opacity: 1;
                animation: lioneto_shineSlide 900ms ease-out forwards;
              }

              @keyframes lioneto_bgSlide {
                0% {
                  background-position: 0% 50%;
                }
                100% {
                  background-position: 100% 50%;
                }
              }
              @keyframes lioneto_shineSlide {
                0% {
                  transform: translateX(0) skewX(-18deg);
                  opacity: 0;
                }
                10% {
                  opacity: 1;
                }
                100% {
                  transform: translateX(260%) skewX(-18deg);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        </div>
      </Link>
    </article>
  );
}
