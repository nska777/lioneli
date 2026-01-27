"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";

import { useRegionLang } from "@/app/context/region-lang";

import FiltersSidebar, { FiltersMeta, FiltersValue } from "./FiltersSidebar";
import ProductActions from "../ProductActions";

import {
  BRANDS, // коллекции (AMBER, SCANDI...)
  CATALOG_MOCK as MOCK,
} from "@/app/lib/mock/catalog-products";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function parseCSV(v: string | null) {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function setCSV(params: URLSearchParams, key: string, arr: string[]) {
  if (!arr.length) params.delete(key);
  else params.set(key, arr.join(","));
}

type SortKey = "default" | "title_asc" | "price_asc" | "price_desc";

/**
 * ✅ ТОП "РАЗДЕЛ" (как ты просишь)
 * ВАЖНО: value должен совпадать с тем, что реально лежит в товаре
 * (menu / room / category / section ...)
 */
const ROOM_ITEMS = [
  { label: "Спальни", value: "bedrooms" },
  { label: "Гостиные", value: "living" },
  { label: "Прихожие", value: "hallway" },
  { label: "Молодёжные", value: "youth" },
  { label: "Столы и стулья", value: "tables_chairs" },
];

/**
 * ✅ Модули (то, что хранится в моках в p.type / p.module / etc)
 */
const MODULE_ITEMS = [
  { label: "Комоды", value: "komody" },
  { label: "Тумбы", value: "tumby" },
  { label: "Кровати", value: "krovati" },
  { label: "Шкафы", value: "shkafy" },
  { label: "Стеллаж", value: "stellazh" },
  { label: "Антресоль", value: "antresol" },
  { label: "Зеркала", value: "zerkala" },
  { label: "Витрины", value: "vitriny" },
  { label: "Столы", value: "stoly" },
  { label: "Полки", value: "polki" },
  { label: "Пуфы", value: "pufy" },
  { label: "Вешалки", value: "veshalki" },
  { label: "Фасады", value: "fasady" },
  { label: "Плинтус", value: "plintus" },
  { label: "Потолки", value: "potolki" },
];

type ProductAny = (typeof MOCK)[number] & Record<string, any>;

/**
 * ✅ Универсальные геттеры — чтобы фильтры работали даже если поля в моках названы по-разному.
 */
function getRoomSlug(p: ProductAny) {
  return String(
    p.menu ?? p.room ?? p.category ?? p.section ?? p.room_slug ?? "",
  )
    .trim()
    .toLowerCase();
}

function getCollectionSlug(p: ProductAny) {
  return String(
    p.brand ?? p.collection ?? p.model ?? p.series ?? p.collection_slug ?? "",
  )
    .trim()
    .toLowerCase();
}

function getModuleSlug(p: ProductAny) {
  return String(
    p.type ?? p.module ?? p.kind ?? p.item_type ?? p.type_slug ?? "",
  )
    .trim()
    .toLowerCase();
}

export default function CatalogClient({
  initialBrand,
  initialCategory,
}: {
  initialBrand: string;
  initialCategory: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const gridRef = useRef<HTMLDivElement | null>(null);

  const { region } = useRegionLang(); // "uz" | "ru"
  const currencyLabel = region === "uz" ? "сум" : "руб.";

  // ✅ формат цены — как у тебя было
  const fmtPrice = (rub: number, uzs: number) =>
    region === "uz"
      ? `${uzs.toLocaleString("en-US")} сум`
      : `${rub.toLocaleString("en-US")} руб.`;

  /**
   * ✅ priceOf с фолбэками: поддерживаем разные названия цены в моках,
   * чтобы не было 0..0 и "0 руб."
   */
  const priceOf = (p: ProductAny) => {
    if (region === "uz") {
      const v =
        p.price_uzs ??
        p.priceUZS ??
        p.priceUZs ??
        p.price_uz ??
        p.priceUz ??
        p.uzs ??
        p.price; // крайний фолбэк
      return Number(v ?? 0) || 0;
    }
    const v =
      p.price_rub ??
      p.priceRUB ??
      p.priceRub ??
      p.price_ru ??
      p.priceRu ??
      p.rub ??
      p.price; // крайний фолбэк
    return Number(v ?? 0) || 0;
  };

  function pushParams(mutator: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(sp.toString());
    mutator(params);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  }

  // ✅ верхние кнопки: single-select
  function setSingleCSVParam(
    key: "menu" | "collections" | "types",
    val: string,
  ) {
    pushParams((params) => {
      if (!val) params.delete(key);
      else params.set(key, val); // single
    });
  }

  // ✅ BACKWARD COMPAT: если нет новых — берём старые brand/category
  const selectedMenu = useMemo(() => {
    const n = parseCSV(sp.get("menu"));
    if (n.length) return n;

    const old = (sp.get("category") || initialCategory || "").toLowerCase();
    return old ? [old] : [];
  }, [sp, initialCategory]);

  const selectedCollections = useMemo(() => {
    const n = parseCSV(sp.get("collections"));
    if (n.length) return n;

    const old = (sp.get("brand") || initialBrand || "").toLowerCase();
    return old ? [old] : [];
  }, [sp, initialBrand]);

  const selectedTypes = useMemo(() => parseCSV(sp.get("types")), [sp]);

  /**
   * ✅ absMin/absMax: без условных хуков (hook-order safe)
   * RU — считаем по реальным ценам (игнорим нули, если есть нормальные цены)
   * UZ — фикс 0..100_000_000
   */
  const absMin = useMemo(() => {
    if (region === "uz") return 0;

    const prices = MOCK.map((p) => priceOf(p as any)).filter((x) =>
      Number.isFinite(x),
    );

    const nonZero = prices.filter((x) => x > 0);
    const base = nonZero.length ? nonZero : prices;

    return base.length ? Math.min(...base) : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const absMax = useMemo(() => {
    if (region === "uz") return 100_000_000;

    const prices = MOCK.map((p) => priceOf(p as any)).filter((x) =>
      Number.isFinite(x),
    );

    const nonZero = prices.filter((x) => x > 0);
    const base = nonZero.length ? nonZero : prices;

    return base.length ? Math.max(...base) : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  /**
   * ✅ min/max из URL, но с защитой:
   * - если params нет => берём absMin/absMax (видно все товары)
   * - если в URL max=0 или мусор => поднимаем до absMax
   * - если min/max перепутались => нормализуем
   */
  const rawMin = sp.get("min");
  const rawMax = sp.get("max");

  const minFromUrl =
    rawMin === null
      ? absMin
      : Number.isFinite(Number(rawMin))
        ? Number(rawMin)
        : absMin;

  let maxFromUrl =
    rawMax === null
      ? absMax
      : Number.isFinite(Number(rawMax))
        ? Number(rawMax)
        : absMax;

  // ✅ ключевой фикс: если max почему-то 0 или меньше min — показываем все
  if (maxFromUrl <= 0) maxFromUrl = absMax;

  const safeMin = Math.min(minFromUrl, maxFromUrl);
  const safeMax = Math.max(minFromUrl, maxFromUrl);

  const sidebarValue: FiltersValue = {
    menu: selectedMenu,
    collections: selectedCollections,
    types: selectedTypes,
    priceMin: safeMin,
    priceMax: safeMax,
  };

  const sidebarMeta: FiltersMeta = {
    priceAbsMin: absMin,
    priceAbsMax: absMax,
    menuItems: ROOM_ITEMS.map((x) => ({ label: x.label, value: x.value })),
    collectionItems: BRANDS.map((x) => ({ label: x.title, value: x.slug })),
    typeItems: MODULE_ITEMS,
  };

  function onSidebarChange(next: FiltersValue) {
    pushParams((params) => {
      setCSV(params, "menu", next.menu);
      setCSV(params, "collections", next.collections);
      setCSV(params, "types", next.types);

      params.set("min", String(next.priceMin));
      params.set("max", String(next.priceMax));
    });
  }

  function resetAll() {
    router.push("/catalog", { scroll: false });
  }

  // --- search + sort from URL
  const qFromUrl = (sp.get("q") || "").trim();
  const sort = ((sp.get("sort") || "default") as SortKey) || "default";

  const [q, setQ] = useState(qFromUrl);

  useEffect(() => {
    setQ(qFromUrl);
  }, [qFromUrl]);

  function applySearch(nextQ: string) {
    const clean = nextQ.trim();
    pushParams((params) => {
      if (!clean) params.delete("q");
      else params.set("q", clean);
    });
  }

  function setSort(next: SortKey) {
    pushParams((params) => {
      if (!next || next === "default") params.delete("sort");
      else params.set("sort", next);
    });
  }

  // --- FILTER
  const filtered = useMemo(() => {
    const needle = qFromUrl.toLowerCase();

    return MOCK.filter((pAny) => {
      const p = pAny as ProductAny;

      // ✅ Разделы
      const room = getRoomSlug(p);
      if (sidebarValue.menu.length && !sidebarValue.menu.includes(room))
        return false;

      // ✅ Коллекции
      const col = getCollectionSlug(p);
      if (
        sidebarValue.collections.length &&
        !sidebarValue.collections.includes(col)
      )
        return false;

      // ✅ Модули
      const mod = getModuleSlug(p);
      if (sidebarValue.types.length && !sidebarValue.types.includes(mod))
        return false;

      // ✅ Price
      const price = priceOf(p);
      if (price < sidebarValue.priceMin) return false;
      if (price > sidebarValue.priceMax) return false;

      // ✅ Search
      if (needle) {
        const hay = `${p.title ?? ""} ${p.badge ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    qFromUrl,
    region,
    sidebarValue.menu.join(","),
    sidebarValue.collections.join(","),
    sidebarValue.types.join(","),
    sidebarValue.priceMin,
    sidebarValue.priceMax,
  ]);

  // --- SORT
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "title_asc":
        arr.sort((a, b) =>
          String(a.title).localeCompare(String(b.title), "ru"),
        );
        break;
      case "price_asc":
        arr.sort((a, b) => priceOf(a as any) - priceOf(b as any));
        break;
      case "price_desc":
        arr.sort((a, b) => priceOf(b as any) - priceOf(a as any));
        break;
      default:
        break;
    }
    return arr;
  }, [filtered, sort, region]);

  // ✅ Apple-style reveal
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-card]");
    gsap.killTweensOf(cards);

    gsap.fromTo(
      cards,
      { y: 16, opacity: 0, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
      },
    );
  }, [
    sidebarValue.menu.join(","),
    sidebarValue.collections.join(","),
    sidebarValue.types.join(","),
    sidebarValue.priceMin,
    sidebarValue.priceMax,
    region,
    qFromUrl,
    sort,
  ]);

  // ✅ активные значения для верхних кнопок (single)
  const activeRoom = sidebarValue.menu[0] || "";
  const activeCollection = sidebarValue.collections[0] || "";
  const activeModule = sidebarValue.types[0] || "";

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-medium tracking-[-0.02em]">
            Каталог
          </h1>
          <p className="mt-1 text-[13px] text-black/55">
            Товары: {sorted.length}
          </p>
        </div>

        <button
          onClick={resetAll}
          className="cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-[12px] tracking-[0.16em] uppercase text-black/70 hover:text-black"
        >
          Сбросить
        </button>
      </div>

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <FiltersSidebar
          value={sidebarValue}
          meta={sidebarMeta}
          onChange={onSidebarChange}
          onReset={() =>
            pushParams((params) => {
              params.delete("menu");
              params.delete("collections");
              params.delete("types");
              params.delete("min");
              params.delete("max");
            })
          }
          currencyLabel={currencyLabel}
        />

        {/* Grid */}
        <section>
          {/* Верхние фильтры */}
          <div className="mb-4 rounded-2xl border border-black/10 bg-[#F7F5F2] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            {/* Раздел */}
            <div className="text-[12px] tracking-[0.18em] uppercase text-black/45">
              Раздел
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROOM_ITEMS.map((c) => {
                const active = activeRoom === c.value;
                return (
                  <button
                    key={c.value}
                    onClick={() =>
                      setSingleCSVParam("menu", active ? "" : c.value)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-[12px] transition",
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/70 hover:text-black",
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Коллекции */}
            <div className="mt-6 text-[12px] tracking-[0.18em] uppercase text-black/45">
              Коллекции
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {BRANDS.map((b) => {
                const active = activeCollection === b.slug;
                return (
                  <button
                    key={b.slug}
                    onClick={() =>
                      setSingleCSVParam("collections", active ? "" : b.slug)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-[12px] transition",
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/70 hover:text-black",
                    )}
                  >
                    {b.title}
                  </button>
                );
              })}
            </div>

            {/* Модули */}
            <div className="mt-6 text-[12px] tracking-[0.18em] uppercase text-black/45">
              Модули
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {MODULE_ITEMS.map((m) => {
                const active = activeModule === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() =>
                      setSingleCSVParam("types", active ? "" : m.value)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-[12px] transition",
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/70 hover:text-black",
                    )}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            {/* ✅ Куда добавлять ещё 5 коллекций позже:
                app/lib/mock/catalog-products.ts -> массив BRANDS (добавляй { title, slug })
            */}
          </div>

          {/* Toolbar */}
          <div className="mb-4 rounded-2xl border border-black/10 bg-[#F7F5F2] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="grid gap-3 md:grid-cols-[1fr_260px]">
              <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 backdrop-blur">
                <div className="text-[10px] tracking-[0.16em] uppercase text-black/45">
                  Поиск
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applySearch(q);
                  }}
                  onBlur={() => applySearch(q)}
                  placeholder="Витрина, тумба, шкаф…"
                  className="mt-1 w-full bg-transparent text-[14px] text-black/85 outline-none placeholder:text-black/35"
                />
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 backdrop-blur">
                <div className="text-[10px] tracking-[0.16em] uppercase text-black/45">
                  Сортировка
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="mt-1 w-full cursor-pointer bg-transparent text-[14px] text-black/85 outline-none"
                >
                  <option value="default">По умолчанию</option>
                  <option value="title_asc">По алфавиту (A→Я)</option>
                  <option value="price_asc">Цена (по возрастанию)</option>
                  <option value="price_desc">Цена (по убыванию)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div
            ref={gridRef}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {sorted.map((pAny, idx) => {
              const p = pAny as ProductAny;
              const href = `/product/${p.id}`;

              const snapshot = {
                title: p.title,
                href,
                imageUrl: p.image,
                sku: p.sku ? String(p.sku) : null,
                price_uzs: Number(p.price_uzs ?? p.priceUZS ?? p.price ?? 0),
                price_rub: Number(p.price_rub ?? p.priceRUB ?? p.price ?? 0),
              };

              return (
                <article
                  key={p.id}
                  data-card
                  className="group overflow-hidden rounded-2xl border border-black/10 bg-[#F7F5F2] shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                >
                  <Link href={href} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        priority={idx < 6}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />

                      {p.badge ? (
                        <div className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/80 px-3 py-1 text-[11px] text-black/70 backdrop-blur">
                          {p.badge}
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

                    <div className="p-4">
                      <div className="text-[14px] font-medium leading-snug text-black/90">
                        {p.title}
                      </div>

                      <div className="mt-2 text-[15px] font-semibold text-black">
                        {fmtPrice(
                          Number(p.price_rub ?? p.priceRUB ?? p.price ?? 0),
                          Number(p.price_uzs ?? p.priceUZS ?? p.price ?? 0),
                        )}
                      </div>

                      <div
                        className={cn(
                          "mt-4 w-full rounded-xl px-4 py-2.5 text-center",
                          "text-[12px] tracking-[0.16em] uppercase text-white",
                          "bg-black hover:bg-black/90 transition cursor-pointer",
                        )}
                      >
                        Открыть
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {sorted.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-black/10 bg-[#F7F5F2] p-8 text-center text-black/60">
              Ничего не найдено. Попробуй изменить поиск или снять часть
              фильтров.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
