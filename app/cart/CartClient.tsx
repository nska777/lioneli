"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

import { useRegionLang } from "../context/region-lang";
import { useShopState } from "../context/shop-state";
import { byId } from "../lib/mock/products";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function formatMoney(n: number, region: "uz" | "ru") {
  if (region === "uz") return new Intl.NumberFormat("ru-RU").format(n) + " сум";
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

/**
 * Поддерживаем разные формы cart без гадания:
 * - string[]
 * - Set<string>
 * - Record<string, number> (qty)
 */
function readCartIds(cart: any): {
  ids: string[];
  qtyById: Record<string, number>;
} {
  // Record<string, number>
  if (
    cart &&
    typeof cart === "object" &&
    !Array.isArray(cart) &&
    !(cart instanceof Set)
  ) {
    const entries = Object.entries(cart);
    if (
      entries.every(([k, v]) => typeof k === "string" && typeof v === "number")
    ) {
      const qtyById: Record<string, number> = {};
      const ids: string[] = [];
      for (const [id, qty] of entries) {
        if (qty > 0) {
          qtyById[id] = qty;
          ids.push(id);
        }
      }
      return { ids, qtyById };
    }
  }

  // Set<string>
  if (cart instanceof Set) {
    const ids = Array.from(cart.values()).map(String);
    const qtyById = Object.fromEntries(ids.map((id) => [id, 1]));
    return { ids, qtyById };
  }

  // string[]
  if (Array.isArray(cart)) {
    const ids = cart.map(String);
    const qtyById = Object.fromEntries(ids.map((id) => [id, 1]));
    return { ids, qtyById };
  }

  return { ids: [], qtyById: {} };
}

/**
 * ✅ Безопасная картинка:
 * если src битый/файла нет — Next/Image может завалить страницу,
 * поэтому ловим ошибку и показываем плейсхолдер.
 */
function SafeImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = React.useState(false);

  if (!src || broken) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-black/5">
        <div className="text-[11px] tracking-[0.22em] text-black/35">
          NO IMAGE
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="96px"
      onError={() => setBroken(true)}
    />
  );
}

export default function CartClient() {
  const { region } = useRegionLang(); // ожидаю "uz" | "ru"
  const shop = useShopState() as any;

  const { ids, qtyById } = useMemo(() => readCartIds(shop?.cart), [shop?.cart]);

  const items = useMemo(() => {
    return ids
      .map((id) => {
        const p = byId.get(id);
        if (!p) return null;
        const qty = qtyById[id] ?? 1;
        const unit = region === "uz" ? p.price.uzs : p.price.rub;
        return {
          id,
          product: p,
          qty,
          unit,
          sum: unit * qty,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      product: any;
      qty: number;
      unit: number;
      sum: number;
    }>;
  }, [ids, qtyById, region]);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.sum, 0),
    [items],
  );

  const remove = (id: string) => {
    if (typeof shop?.removeFromCart === "function")
      return shop.removeFromCart(id);
    if (typeof shop?.toggleCart === "function") return shop.toggleCart(id);
  };

  const clear = () => {
    if (typeof shop?.clearCart === "function") return shop.clearCart();
    if (typeof shop?.toggleCart === "function")
      ids.forEach((id) => shop.toggleCart(id));
  };

  const changeQty = (id: string, nextQty: number) => {
    if (nextQty < 1) return;
    if (typeof shop?.setCartQty === "function")
      return shop.setCartQty(id, nextQty);
    if (typeof shop?.setQty === "function") return shop.setQty(id, nextQty);
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[12px] tracking-[0.28em] text-black/45">
            LIONETO
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em]">
            Корзина
          </h1>
          <p className="mt-2 text-sm text-black/55">
            {items.length
              ? `Товаров: ${items.length}`
              : "Пока пусто — добавь товары из каталога."}
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clear}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/75 hover:text-black hover:border-black/20 transition"
          >
            <Trash2 className="h-4 w-4" />
            Очистить
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* items */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/5">
                  <ShoppingBag className="h-6 w-6 text-black/60" />
                </div>
                <div>
                  <div className="text-base font-medium">Корзина пустая</div>
                  <div className="text-sm text-black/55">
                    Перейди в каталог и добавь товары.
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/catalog"
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition"
                >
                  В каталог <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="rounded-3xl border border-black/10 bg-white p-4 md:p-5"
              >
                <div className="flex gap-4">
                  <Link
                    href={it.product.href}
                    className="cursor-pointer relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/5"
                  >
                    <SafeImage src={it.product.image} alt={it.product.title} />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={it.product.href}
                          className="cursor-pointer block truncate text-base font-medium tracking-[-0.01em] hover:underline"
                        >
                          {it.product.title}
                        </Link>
                        {it.product.sku && (
                          <div className="mt-1 text-xs text-black/45">
                            SKU: {it.product.sku}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => remove(it.id)}
                        className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/65 hover:text-black hover:border-black/20 transition"
                        aria-label="Удалить"
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      {/* qty */}
                      <div className="inline-flex items-center rounded-full border border-black/10 bg-white p-1">
                        <button
                          className={cn(
                            "cursor-pointer h-9 w-9 rounded-full text-black/70 hover:text-black transition",
                            !shop?.setCartQty && !shop?.setQty
                              ? "opacity-40 cursor-not-allowed"
                              : "",
                          )}
                          disabled={!shop?.setCartQty && !shop?.setQty}
                          onClick={() => changeQty(it.id, it.qty - 1)}
                        >
                          −
                        </button>
                        <div className="min-w-[44px] text-center text-sm font-medium">
                          {it.qty}
                        </div>
                        <button
                          className={cn(
                            "cursor-pointer h-9 w-9 rounded-full text-black/70 hover:text-black transition",
                            !shop?.setCartQty && !shop?.setQty
                              ? "opacity-40 cursor-not-allowed"
                              : "",
                          )}
                          disabled={!shop?.setCartQty && !shop?.setQty}
                          onClick={() => changeQty(it.id, it.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* price */}
                      <div className="text-right">
                        <div className="text-sm text-black/55">
                          {formatMoney(it.unit, region)} × {it.qty}
                        </div>
                        <div className="text-lg font-semibold tracking-[-0.02em]">
                          {formatMoney(it.sum, region)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* summary */}
        <aside className="h-fit rounded-3xl border border-black/10 bg-white p-5">
          <div className="text-base font-semibold tracking-[-0.01em]">
            Итого
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-black/60">
            <span>Сумма</span>
            <span className="font-medium text-black/80">
              {formatMoney(total, region)}
            </span>
          </div>

          <div className="mt-5 h-px bg-black/10" />

          <div className="mt-5 space-y-3">
            <Link
              href="/checkout"
              className={cn(
                "cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
                items.length
                  ? "bg-black text-white hover:opacity-90"
                  : "bg-black/10 text-black/40 pointer-events-none",
              )}
            >
              Оформить заказ <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/catalog"
              className="cursor-pointer inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition"
            >
              Продолжить покупки
            </Link>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-black/45">
            * Доставка и сборка считаются на этапе оформления.
          </p>
        </aside>
      </div>
    </main>
  );
}
