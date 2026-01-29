"use client";

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

import { useShopState } from "@/app/context/shop-state";
import { formatPrice } from "@/app/lib/format/price";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export default function ProductRelated({
  title,
  items,
  currency,
}: {
  title: string;
  items: Array<{
    id: string;
    title: string;
    image: string;
    price_rub: number;
    price_uzs: number;
    href: string;
    badge?: string;
  }>;
  currency: "RUB" | "UZS";
}) {
  const shop = useShopState();
  const { isInCart, addToCart, removeFromCart } = shop;

  return (
    <section className="mt-12">
      <h2 className="text-[20px] font-semibold text-black">{title}</h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => {
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
  );
}
