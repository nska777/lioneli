"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, HeartOff, ShoppingBag, Trash2 } from "lucide-react";

import { useRegionLang } from "../context/region-lang";
import { useShopState } from "../context/shop-state";
import { CATALOG_BY_ID, CATALOG_MOCK } from "../lib/mock/catalog-products";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function formatMoney(n: number, region: "uz" | "ru") {
  if (region === "uz") return new Intl.NumberFormat("ru-RU").format(n) + " сум";
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

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
      sizes="(max-width: 768px) 100vw, 360px"
      onError={() => setBroken(true)}
    />
  );
}

export default function FavoritesClient() {
  const { region } = useRegionLang();
  const shop = useShopState();

  const favIds = shop.favorites;

  const items = useMemo(() => {
    return favIds
      .map((id) => {
        const p = CATALOG_BY_ID.get(id);
        if (!p) return null;

        const price = region === "uz" ? p.price_uzs : p.price_rub;

        return { id, product: p, price };
      })
      .filter(Boolean) as Array<{
      id: string;
      product: (typeof CATALOG_MOCK)[number];
      price: number;
    }>;
  }, [favIds, region]);

  // рекомендации: 3 товара, которых нет в избранном
  const recommended = useMemo(() => {
    const set = new Set(favIds);
    return CATALOG_MOCK.filter((p) => !set.has(p.id)).slice(0, 3);
  }, [favIds]);

  const clearFavorites = () => {
    favIds.forEach((id) => shop.toggleFav(id));
  };

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[12px] tracking-[0.28em] text-black/45">
            LIONETO
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em]">
            Избранное
          </h1>
          <p className="mt-2 text-sm text-black/55">
            {items.length
              ? `Товаров: ${items.length}`
              : "Пока пусто — добавь товары сердечком."}
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/75 hover:text-black hover:border-black/20 transition"
            title="Очистить избранное"
          >
            <Trash2 className="h-4 w-4" />
            Очистить
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* LIST */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/5">
                  <HeartOff className="h-6 w-6 text-black/60" />
                </div>
                <div>
                  <div className="text-base font-medium">Избранное пустое</div>
                  <div className="text-sm text-black/55">
                    Нажимай на сердечко на карточке — товар появится здесь.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/catalog"
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition"
                >
                  В каталог <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cart"
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition"
                >
                  Открыть корзину <ShoppingBag className="h-4 w-4" />
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
                    href={`/catalog?product=${it.product.id}`}
                    className="cursor-pointer relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/5"
                  >
                    <SafeImage src={it.product.image} alt={it.product.title} />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/catalog?product=${it.product.id}`}
                          className="cursor-pointer block truncate text-base font-medium tracking-[-0.01em] hover:underline"
                        >
                          {it.product.title}
                        </Link>
                        <div className="mt-1 text-xs text-black/45">
                          ID: {it.product.id}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => shop.toggleFav(it.id)}
                        className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/65 hover:text-black hover:border-black/20 transition"
                        title="Убрать из избранного"
                        aria-label="Убрать из избранного"
                      >
                        <HeartOff className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm text-black/55">Цена</div>
                      <div className="text-right">
                        <div className="text-lg font-semibold tracking-[-0.02em]">
                          {formatMoney(it.price, region)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/catalog?product=${it.product.id}`}
                        className="cursor-pointer inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition"
                      >
                        Смотреть
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          // ✅ единая логика корзины
                          shop.toggleCart(it.id);
                          window.location.href = "/cart";
                        }}
                        className="cursor-pointer inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                      >
                        В корзину <ArrowRight className="ml-2 h-4 w-4" />
                      </button>

                      <Link
                        href="/checkout"
                        className="cursor-pointer inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition"
                      >
                        Оформить заказ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: RECOMMENDED */}
        <aside className="h-fit rounded-3xl border border-black/10 bg-white p-5">
          <div className="text-base font-semibold tracking-[-0.01em]">
            Рекомендуем
          </div>
          <p className="mt-1 text-sm text-black/55">
            То, что часто берут вместе.
          </p>

          <div className="mt-4 space-y-3">
            {recommended.map((p) => (
              <Link
                key={p.id}
                href={`/catalog?product=${p.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 hover:border-black/20 transition cursor-pointer"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-black/5 shrink-0">
                  <SafeImage src={p.image} alt={p.title} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium group-hover:underline">
                    {p.title}
                  </div>
                  <div className="text-xs text-black/45">
                    {formatMoney(
                      region === "uz" ? p.price_uzs : p.price_rub,
                      region,
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5">
            <Link
              href="/catalog"
              className="cursor-pointer inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition"
            >
              Ещё товары
            </Link>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-black/45">
            * Рекомендации пока на моках. Позже подключим Strapi и будет умнее.
          </p>
        </aside>
      </div>
    </main>
  );
}
