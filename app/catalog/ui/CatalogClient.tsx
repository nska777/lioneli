"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Heart, ShoppingCart } from "lucide-react";

import { useRegionLang } from "../../context/region-lang";
import { useShopState } from "../../context/shop-state";

import FiltersSidebar, { FiltersMeta, FiltersValue } from "./FiltersSidebar";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

// Верхний фильтр (бренды/категории бренда)
const BRANDS = [
  { title: "АМБЕР", slug: "amber" },
  { title: "СКАНДИ", slug: "scandi" },
  { title: "ЭЛИЗАБЕТ", slug: "elizabeth" },
  { title: "САЛЬВАДОР", slug: "salvador" },
  { title: "ПИТТИ", slug: "pitti" },
  { title: "БОНЖОРНО", slug: "bonjorno" },
] as const;

const CATS = [
  { title: "Спальни", slug: "bedrooms" },
  { title: "Гостиные", slug: "living" },
  { title: "Молодежные", slug: "youth" },
  { title: "Прихожие", slug: "hallway" },
  { title: "Столы и стулья", slug: "tables" },
] as const;

// Левый сайдбар
const MENU_ITEMS = [
  { label: "Столы и стулья", value: "menu_tables" },
  { label: "Шкафы купе", value: "menu_wardrobe" },
  { label: "Кабинеты", value: "menu_office" },
  { label: "Прихожие", value: "menu_hallway" },
  { label: "Гостиные", value: "menu_living" },
  { label: "Спальни", value: "menu_bedrooms" },
];

const COLLECTION_ITEMS = [
  { label: "Bergen Dark", value: "bergen_dark" },
  { label: "Bergen Dub", value: "bergen_dub" },
  { label: "Bergen Latte", value: "bergen_latte" },
  { label: "Bergen White", value: "bergen_white" },
  { label: "Bryce", value: "bryce" },
  { label: "Florence Bianco", value: "florence_bianco" },
  { label: "Florence Ciliegio", value: "florence_ciliegio" },
  { label: "Makassar Dub", value: "makassar_dub" },
  { label: "Modena", value: "modena" },
];

const TYPE_ITEMS = [
  { label: "Комоды", value: "komody" },
  { label: "Консоли", value: "konsoli" },
  { label: "Столы обеденные", value: "stoly_obed" },
  { label: "Столы письменные", value: "stoly_pism" },
  { label: "Стулья и кресла", value: "stulya_kresla" },
  { label: "Тумбы ТВ", value: "tumby_tv" },
  { label: "Шкафы", value: "shkafy" },
  { label: "Витрины", value: "vitriny" },
  { label: "Библиотеки и стеллажи", value: "stellazhi" },
  { label: "Полукресла", value: "polukresla" },
];

// ✅ локальные демо-фото (лежат в public/demo/products)
const DEMO_IMAGES = [
  "/demo/products/p1.jpg",
  "/demo/products/p2.jpg",
  "/demo/products/p3.jpg",
  "/demo/products/p4.jpg",
  "/demo/products/p5.jpg",
  "/demo/products/p6.jpg",
  "/demo/products/p7.jpg",
  "/demo/products/p8.jpg",
  "/demo/products/p9.jpg",
  "/demo/products/p10.jpg",
  "/demo/products/p11.jpg",
  "/demo/products/p12.jpg",
];

// ✅ мок — сразу с полями под будущий Strapi
const MOCK = Array.from({ length: 24 }).map((_, i) => {
  const brand = BRANDS[i % BRANDS.length].slug;
  const category = CATS[i % CATS.length].slug;

  const menu = MENU_ITEMS[i % MENU_ITEMS.length].value;
  const collection = COLLECTION_ITEMS[i % COLLECTION_ITEMS.length].value;
  const type = TYPE_ITEMS[i % TYPE_ITEMS.length].value;

  const baseRub = 41800 + i * 3500;

  return {
    id: String(i + 1),
    title:
      category === "bedrooms"
        ? `Тумба прикроватная ${i + 1}`
        : category === "living"
          ? `Витрина ${i + 1}`
          : category === "youth"
            ? `Шкаф молодежный ${i + 1}`
            : category === "hallway"
              ? `Прихожая модуль ${i + 1}`
              : `Стол ${i + 1}`,

    price_rub: baseRub,
    price_uzs: Math.round(baseRub * 140),

    badge: i % 6 === 0 ? "Хит продаж" : i % 9 === 0 ? "Новинка" : "",
    image: DEMO_IMAGES[i % DEMO_IMAGES.length],

    brand,
    category,

    menu,
    collection,
    type,
  };
});

function IconBtn({
  title,
  active,
  danger,
  success,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  danger?: boolean;
  success?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border p-2 backdrop-blur transition",
        "border-black/10 bg-white/80 hover:bg-white",
        active &&
          (danger
            ? "text-rose-600"
            : success
              ? "text-emerald-600"
              : "text-black"),
        !active && "text-black/70",
      )}
    >
      {children}
    </button>
  );
}

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

  const { isFav, toggleFav, isInCart, toggleCart } = useShopState();
  const { region } = useRegionLang(); // "uz" | "ru"

  const currencyLabel = region === "uz" ? "сум" : "руб.";
  const fmtPrice = (rub: number, uzs: number) =>
    region === "uz"
      ? `${uzs.toLocaleString("ru-RU")} сум`
      : `${rub.toLocaleString("ru-RU")} руб.`;

  const priceOf = (p: (typeof MOCK)[number]) =>
    region === "uz" ? p.price_uzs : p.price_rub;

  function pushParams(mutator: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(sp.toString());
    mutator(params);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  }

  function setTopParam(key: "brand" | "category", val: string) {
    pushParams((params) => {
      if (!val) params.delete(key);
      else params.set(key, val);
    });
  }

  // --- верхние фильтры (brand/category)
  const activeBrand = (sp.get("brand") || initialBrand || "").toLowerCase();
  const activeCategory = (
    sp.get("category") ||
    initialCategory ||
    ""
  ).toLowerCase();

  // --- левый сайдбар (menu/collections/types/price)
  const selectedMenu = parseCSV(sp.get("menu"));
  const selectedCollections = parseCSV(sp.get("collections"));
  const selectedTypes = parseCSV(sp.get("types"));

  const absMin = useMemo(() => {
    const arr = MOCK.map((p) => priceOf(p));
    return Math.min(...arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const absMax = useMemo(() => {
    const arr = MOCK.map((p) => priceOf(p));
    return Math.max(...arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  const priceMin = Number(sp.get("min") || absMin);
  const priceMax = Number(sp.get("max") || absMax);

  const sidebarValue: FiltersValue = {
    menu: selectedMenu,
    collections: selectedCollections,
    types: selectedTypes,
    priceMin: isNaN(priceMin) ? absMin : priceMin,
    priceMax: isNaN(priceMax) ? absMax : priceMax,
  };

  const sidebarMeta: FiltersMeta = {
    priceAbsMin: absMin,
    priceAbsMax: absMax,
    menuItems: MENU_ITEMS,
    collectionItems: COLLECTION_ITEMS,
    typeItems: TYPE_ITEMS,
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

  // --- filter
  const filtered = useMemo(() => {
    const needle = qFromUrl.toLowerCase();

    return MOCK.filter((p) => {
      if (activeBrand && p.brand !== activeBrand) return false;
      if (activeCategory && p.category !== activeCategory) return false;

      if (selectedMenu.length && !selectedMenu.includes(p.menu)) return false;
      if (
        selectedCollections.length &&
        !selectedCollections.includes(p.collection)
      )
        return false;
      if (selectedTypes.length && !selectedTypes.includes(p.type)) return false;

      const price = priceOf(p);
      if (price < sidebarValue.priceMin) return false;
      if (price > sidebarValue.priceMax) return false;

      if (needle) {
        const hay = `${p.title} ${p.badge}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      return true;
    });
  }, [
    activeBrand,
    activeCategory,
    selectedMenu.join(","),
    selectedCollections.join(","),
    selectedTypes.join(","),
    qFromUrl,
    region,
    sidebarValue.priceMin,
    sidebarValue.priceMax,
  ]);

  // --- sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "title_asc":
        arr.sort((a, b) => a.title.localeCompare(b.title, "ru"));
        break;
      case "price_asc":
        arr.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case "price_desc":
        arr.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      default:
        // default = как пришло (для Strapi будет естественный порядок)
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
    activeBrand,
    activeCategory,
    selectedMenu.join(","),
    selectedCollections.join(","),
    selectedTypes.join(","),
    sidebarValue.priceMin,
    sidebarValue.priceMax,
    region,
    qFromUrl,
    sort,
  ]);

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
        {/* Sidebar filters */}
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
          {/* Верхние фильтры (бренд/категория бренда) */}
          <div className="mb-4 rounded-2xl border border-black/10 bg-[#F7F5F2] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="text-[12px] tracking-[0.18em] uppercase text-black/45">
              Бренды
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {BRANDS.map((b) => {
                const active = activeBrand === b.slug;
                return (
                  <button
                    key={b.slug}
                    onClick={() => setTopParam("brand", active ? "" : b.slug)}
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

            <div className="mt-6 text-[12px] tracking-[0.18em] uppercase text-black/45">
              Категории бренда
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {CATS.map((c) => {
                const active = activeCategory === c.slug;
                return (
                  <button
                    key={c.slug}
                    onClick={() =>
                      setTopParam("category", active ? "" : c.slug)
                    }
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-[12px] transition",
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/70 hover:text-black",
                    )}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toolbar: search + sort */}
          <div className="mb-4 rounded-2xl border border-black/10 bg-[#F7F5F2] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="grid gap-3 md:grid-cols-[1fr_260px]">
              {/* Search */}
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

              {/* Sort */}
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

            {/* hint line */}
            {(qFromUrl || sort !== "default") && (
              <div className="mt-3 text-[12px] text-black/55">
                {qFromUrl ? (
                  <span>
                    Поиск: <span className="text-black/80">{qFromUrl}</span>
                  </span>
                ) : null}
                {qFromUrl && sort !== "default" ? <span> • </span> : null}
                {sort !== "default" ? (
                  <span>
                    Сортировка:{" "}
                    <span className="text-black/80">
                      {sort === "title_asc"
                        ? "A→Я"
                        : sort === "price_asc"
                          ? "цена ↑"
                          : "цена ↓"}
                    </span>
                  </span>
                ) : null}
              </div>
            )}
          </div>

          {/* Cards */}
          <div
            ref={gridRef}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {sorted.map((p, idx) => {
              const fav = isFav(p.id);
              const inCart = isInCart(p.id);

              return (
                <article
                  key={p.id}
                  data-card
                  className="group overflow-hidden rounded-2xl border border-black/10 bg-[#F7F5F2] shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
                >
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

                    <div className="absolute right-3 top-3 flex translate-y-[-6px] gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <IconBtn
                        title="В избранное"
                        active={fav}
                        danger
                        onClick={() => toggleFav(p.id)}
                      >
                        <Heart
                          className={cn("h-4 w-4", fav && "fill-current")}
                        />
                      </IconBtn>

                      <IconBtn
                        title={
                          inCart ? "Убрать из корзины" : "Добавить в корзину"
                        }
                        active={inCart}
                        success
                        onClick={() => toggleCart(p.id)}
                      >
                        <ShoppingCart
                          className={cn("h-4 w-4", inCart && "fill-current")}
                        />
                      </IconBtn>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="text-[14px] font-medium leading-snug text-black/90">
                      {p.title}
                    </div>

                    <div className="mt-2 text-[15px] font-semibold text-black">
                      {fmtPrice(p.price_rub, p.price_uzs)}
                    </div>

                    <button
                      onClick={() => toggleCart(p.id)}
                      className={cn(
                        "mt-4 w-full cursor-pointer rounded-xl px-4 py-2.5 text-[12px] tracking-[0.16em] uppercase text-white transition",
                        inCart
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-black hover:bg-black/90",
                      )}
                    >
                      {inCart ? "В корзине" : "В корзину"}
                    </button>
                  </div>
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
