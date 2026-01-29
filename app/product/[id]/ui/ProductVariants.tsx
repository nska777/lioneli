"use client";

import { formatPrice } from "@/app/lib/format/price";
import type { ProductVariant } from "./ProductClient";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export default function ProductVariants({
  variants,
  variantsKind,
  selectedVariantId,
  setSelectedVariantId,
  selectedVariantTitle,
  variantDelta,
  currency,
}: {
  variants: ProductVariant[];
  variantsKind: "color" | "option" | null;
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
  selectedVariantTitle: string;
  variantDelta: number;
  currency: "RUB" | "UZS";
}) {
  if (!variants.length) return null;

  return (
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

      {!!selectedVariantTitle && (
        <div className="mt-2 text-[12px] text-black/55">
          Выбрано:{" "}
          <span className="font-semibold text-black/75">
            {selectedVariantTitle}
          </span>
        </div>
      )}

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
  );
}
