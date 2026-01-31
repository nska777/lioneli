"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import gsap from "gsap";

import { useRegionLang } from "@/app/context/region-lang";
import { BRANDS, CATALOG_MOCK as MOCK } from "@/app/lib/mock/catalog-products";

import FiltersSidebar, { FiltersMeta, FiltersValue } from "./FiltersSidebar";
import CatalogTopFilters from "./CatalogTopFilters";
import CatalogToolbar from "./CatalogToolbar";
import CatalogGrid from "./CatalogGrid";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

/* =========================
   HERO SLIDER (STATIC)
   Включается ТОЛЬКО когда в URL есть hero=1
   и выбраны menu + collections
   Картинки — статично из /public/mega/...
========================= */

function seqImages(baseDir: string, count: number) {
  // count = общее число фоток в слайдере
  // формат: main.jpg + 1..(count-1).jpg
  const out: string[] = [];
  out.push(`${baseDir}/main.jpg`);
  for (let i = 1; i <= Math.max(0, count - 1); i++) {
    out.push(`${baseDir}/${i}.jpg`);
  }
  return out;
}

type HeroSliderCfg = {
  title: string;
  images: string[];
};

// ✅ Правила из твоего сообщения (статично)
const HERO_SLIDERS: Record<string, HeroSliderCfg> = {
  // ===== СПАЛЬНИ =====
  "bedrooms:amber": {
    title: "Спальня «АМБЕР»",
    images: seqImages("/mega/bedrooms/amber", 3), // main + 1 + 2
  },
  "bedrooms:buongiorno": {
    title: "Спальня «БОНЖОРНО»",
    // общий слайдер (белый + капучино вместе) — просто общий набор фоток коллекции
    images: seqImages("/mega/bedrooms/buongiorno", 3),
  },
  "bedrooms:scandi": {
    title: "Спальня «СКАНДИ»",
    // общий набор (белый + капучино вместе) — один слайдер
    images: seqImages("/mega/bedrooms/scandi", 3),
  },
  "bedrooms:elizabeth": {
    title: "Спальня «ЭЛИЗАБЕТ»",
    images: seqImages("/mega/bedrooms/elizabeth", 2), // 2 фото
  },
  "bedrooms:pitti": {
    title: "Спальня «ПИТТИ»",
    images: seqImages("/mega/bedrooms/pitti", 10), // 10 фото (нужно добавить 3..9.jpg)
  },
  "bedrooms:salvador": {
    title: "Спальня «САЛЬВАДОР»",
    images: seqImages("/mega/bedrooms/salvador", 2), // 2 фото
  },

  // ===== ГОСТИНЫЕ (только эти) =====
  "living:buongiorno": {
    title: "Гостиная «BUONGIORNO»",
    images: seqImages("/mega/living/buongiorno", 3),
  },
  "living:pitti": {
    title: "Гостиная «ПИТТИ»",
    images: seqImages("/mega/living/pitti", 3),
  },
  "living:salvador": {
    title: "Гостиная «САЛЬВАДОР»",
    images: seqImages("/mega/living/salvador", 3),
  },
  "living:scandi": {
    title: "Гостиная «СКАНДИ»",
    images: seqImages("/mega/living/scandi", 3),
  },

  // ===== МОЛОДЁЖНЫЕ (только эти) =====
  "youth:elizabeth": {
    title: "Молодёжная «ЭЛИЗАБЕТ»",
    images: seqImages("/mega/youth/elizabeth", 3),
  },
  "youth:scandi": {
    title: "Молодёжная «СКАНДИ»",
    images: seqImages("/mega/youth/scandi", 3),
  },
};

function CatalogHero({ title, images }: { title: string; images: string[] }) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [title]);

  const max = safeImages.length;

  const prev = () => setIdx((v) => (max ? (v - 1 + max) % max : 0));
  const next = () => setIdx((v) => (max ? (v + 1) % max : 0));

  if (!max) return null;

  return (
    <section className="mb-8">
      <div
        className={cn(
          "rounded-3xl border border-black/10 bg-white",
          "shadow-[0_35px_110px_-65px_rgba(0,0,0,0.45)]",
          "overflow-hidden",
        )}
      >
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[12px] tracking-[0.16em] uppercase text-black/45">
                Коллекция
              </div>
              <h2 className="mt-1 text-[26px] font-medium tracking-[-0.02em]">
                {title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 hover:text-black hover:bg-black/5 transition cursor-pointer"
                aria-label="Prev"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 hover:text-black hover:bg-black/5 transition cursor-pointer"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="relative overflow-hidden rounded-2xl bg-black/5">
            <div className="relative aspect-[16/9] w-full">
              <Image
                key={safeImages[idx]}
                src={safeImages[idx]}
                alt={title}
                fill
                priority
                className="object-cover opacity-0 animate-[fade_.22s_ease-out_forwards]"
              />

              {/* dots */}
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                {safeImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={cn(
                      "h-2 rounded-full transition cursor-pointer",
                      i === idx ? "w-8 bg-white/90" : "w-2 bg-white/50",
                    )}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* counter */}
              <div className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[11px] tracking-[0.14em] uppercase text-black/70">
                {idx + 1}/{max}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fade {
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </section>
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

const ROOM_ITEMS = [
  { label: "Спальни", value: "bedrooms" },
  { label: "Гостиные", value: "living" },
  { label: "Прихожие", value: "hallway" },
  { label: "Молодёжные", value: "youth" },
  { label: "Столы и стулья", value: "tables_chairs" },
];

const MODULE_ITEMS = [
  { label: "Комоды", value: "komody" },
  { label: "Тумбы", value: "tumby" },
  { label: "Кровати", value: "krovati" },
  { label: "Шкафы", value: "shkafy" },
  { label: "Стеллаж", value: "stellaji" },
  { label: "Антресоль", value: "antresol" },
  { label: "Зеркала", value: "zerkala" },
  { label: "Витрины", value: "vitrini" },
  { label: "Столы", value: "stoli" },
  { label: "Полки", value: "polki" },
  { label: "Пуфы", value: "pufi" },
  { label: "Вешалки", value: "veshalki" },
  { label: "Фасады", value: "fasadi" },
  { label: "Плинтус", value: "plintusy" },
  { label: "Потолки", value: "potolki" },
];

type ProductAny = (typeof MOCK)[number] & Record<string, any>;

function norm(s: string) {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

// ✅ Важно: коллекции могут прилетать как slug ("amber") или как label ("AMBER").
// Приводим к slug.
function normalizeCollectionToken(v: string) {
  const t = norm(v);
  if (!t) return "";

  // уже slug
  const bySlug = BRANDS.find((b) => norm(b.slug) === t);
  if (bySlug) return norm(bySlug.slug);

  // пришёл title ("AMBER") -> slug
  const byTitle = BRANDS.find((b) => norm(b.title) === t);
  if (byTitle) return norm(byTitle.slug);

  // fallback
  return t;
}

function normalizeModuleToken(v: string) {
  const t = norm(v);
  if (!t) return "";

  const byValue = MODULE_ITEMS.find((x) => norm(x.value) === t);
  if (byValue) return norm(byValue.value);

  // если вдруг передали label
  const byLabel = MODULE_ITEMS.find((x) => norm(x.label) === t);
  if (byLabel) return norm(byLabel.value);

  return t;
}

function normalizeRoomToken(v: string) {
  const t = norm(v);
  if (!t) return "";

  const byValue = ROOM_ITEMS.find((x) => norm(x.value) === t);
  if (byValue) return norm(byValue.value);

  const byLabel = ROOM_ITEMS.find((x) => norm(x.label) === t);
  if (byLabel) return norm(byLabel.value);

  return t;
}

// ✅ Список "Room-меню" (разделы типа Спальни/Гостиные/Молодёжные...)
const ROOM_MENUS_SET = new Set(ROOM_ITEMS.map((x) => norm(x.value)));

function getRoomSlug(p: ProductAny) {
  // ✅ Ключевой момент:
  // - для "товаров-наборов" (спальня/гостиная как комната) мы будем хранить room в `cat`
  // - для обычных товаров остаётся старый fallback
  return norm(
    p.cat ?? p.menu ?? p.room ?? p.section ?? p.category ?? p.room_slug ?? "",
  );
}

function getCollectionSlug(p: ProductAny) {
  // ✅ нормализуем бренд товара тоже через normalizeCollectionToken
  return normalizeCollectionToken(
    p.brand ?? p.collection ?? p.model ?? p.series ?? "",
  );
}

function getModuleSlug(p: ProductAny) {
  return norm(p.type ?? p.module ?? p.kind ?? p.cat ?? p.item_type ?? "");
}

// ✅ Подфильтры (созданы под шкафы, расширяем под витрины)
const DOOR_ITEMS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const FACADE_ITEMS: Array<{ label: string; value: string }> = [
  { label: "Глухой", value: "blind" },
  { label: "Зеркальный", value: "mirror" },
  { label: "Комбинированный", value: "combined" },
  { label: "Зеркально-комбинир.", value: "mirror-combined" },
];

// ✅ Витрины — “вид”
const VITRINI_FACADE_ITEMS: Array<{ label: string; value: string }> = [
  { label: "Обычная", value: "blind" },
  { label: "Со стеклом", value: "glass" },
  { label: "Со стеклом и полками", value: "glass-shelves" },
];

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

  const fmtPrice = (rub: number, uzs: number) =>
    region === "uz"
      ? `${uzs.toLocaleString("en-US")} сум`
      : `${rub.toLocaleString("en-US")} руб.`;

  const priceOf = (p: ProductAny) => {
    if (region === "uz") {
      const v = p.price_uzs ?? p.priceUZS ?? p.priceUz ?? p.uzs ?? 0;
      return Number(v ?? 0) || 0;
    }
    const v = p.price_rub ?? p.priceRUB ?? p.priceRub ?? p.rub ?? 0;
    return Number(v ?? 0) || 0;
  };

  // ✅ режим витрины (hero сверху + sticky бар)
  const heroMode = sp.get("hero") === "1";

  function pushParams(mutator: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(sp.toString());
    mutator(params);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  }

  function setSingleParam(key: string, val: string) {
    pushParams((params) => {
      const clean = String(val ?? "").trim();
      if (!clean) params.delete(key);
      else params.set(key, clean);
    });
  }

  function setSingleCSVParam(
    key: "menu" | "collections" | "types",
    val: string,
  ) {
    pushParams((params) => {
      let clean = String(val ?? "").trim();

      if (key === "collections") clean = normalizeCollectionToken(clean);
      if (key === "types") clean = normalizeModuleToken(clean);
      if (key === "menu") clean = normalizeRoomToken(clean);

      if (!clean) params.delete(key);
      else params.set(key, clean);

      // ✅ если ушли с "Шкафы" или "Витрины" — подфильтры сбрасываем
      if (key === "types") {
        const next = norm(clean);
        if (next !== "shkafy" && next !== "vitrini") {
          params.delete("doors");
          params.delete("facade");
        }
      }
    });
  }

  const selectedMenu = useMemo(() => {
    const n = parseCSV(sp.get("menu")).map(normalizeRoomToken).filter(Boolean);
    if (n.length) return n;

    const old = normalizeRoomToken(sp.get("category") || initialCategory || "");
    return old ? [old] : [];
  }, [sp, initialCategory]);

  const selectedCollections = useMemo(() => {
    const n = parseCSV(sp.get("collections"))
      .map(normalizeCollectionToken)
      .filter(Boolean);
    if (n.length) return n;

    const old = normalizeCollectionToken(sp.get("brand") || initialBrand || "");
    return old ? [old] : [];
  }, [sp, initialBrand]);

  const selectedTypes = useMemo(
    () => parseCSV(sp.get("types")).map(normalizeModuleToken).filter(Boolean),
    [sp],
  );

  // ✅ Подфильтры doors/facade из URL
  const selectedDoors = useMemo(() => parseCSV(sp.get("doors")), [sp]);
  const selectedFacades = useMemo(() => parseCSV(sp.get("facade")), [sp]);

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
      setCSV(params, "menu", next.menu.map(normalizeRoomToken).filter(Boolean));
      setCSV(
        params,
        "collections",
        next.collections.map(normalizeCollectionToken).filter(Boolean),
      );
      setCSV(
        params,
        "types",
        next.types.map(normalizeModuleToken).filter(Boolean),
      );

      // ✅ если НЕ выбраны "Шкафы" И НЕ выбраны "Витрины" — чистим подфильтры
      const hasDoorFacadeCats =
        next.types.includes("shkafy") || next.types.includes("vitrini");
      if (!hasDoorFacadeCats) {
        params.delete("doors");
        params.delete("facade");
      }

      params.set("min", String(next.priceMin));
      params.set("max", String(next.priceMax));
    });
  }

  function resetAll() {
    // ✅ обычный /catalog — как и было
    if (!heroMode) {
      router.push("/catalog", { scroll: false });
      return;
    }

    // ✅ в режиме витрины: сохраняем hero + (menu/collections), чистим остальные
    pushParams((params) => {
      const keepMenu = params.get("menu");
      const keepCol = params.get("collections");
      params.forEach((_, key) => params.delete(key));

      if (keepMenu) params.set("menu", keepMenu);
      if (keepCol) params.set("collections", keepCol);
      params.set("hero", "1");
    });
  }

  const qFromUrl = (sp.get("q") || "").trim();
  const sort = ((sp.get("sort") || "default") as SortKey) || "default";
  const [q, setQ] = useState(qFromUrl);

  useEffect(() => setQ(qFromUrl), [qFromUrl]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const clean = q.trim();
      if (clean === qFromUrl) return;

      pushParams((params) => {
        if (!clean) params.delete("q");
        else params.set("q", clean);
      });
    }, 250);

    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function setSort(next: SortKey) {
    pushParams((params) => {
      if (!next || next === "default") params.delete("sort");
      else params.set("sort", next);
    });
  }

  const activeRoom = sidebarValue.menu[0] || "";
  const activeCollection = sidebarValue.collections[0] || "";
  const activeModule = sidebarValue.types[0] || "";

  // ✅ RoomMode = выбран один из разделов комнат (bedrooms/living/youth...)
  // В этом режиме мы показываем "наборы комнат" (спальня/гостиная как продукт)
  // и игнорируем модульные типы (types).
  const isRoomMode = !!activeRoom && ROOM_MENUS_SET.has(norm(activeRoom));

  const isDoorsFacadeUI =
    activeModule === "shkafy" || activeModule === "vitrini";

  const activeDoor = selectedDoors[0] || "";
  const activeFacade = selectedFacades[0] || "";

  const facadeItems =
    activeModule === "vitrini" ? VITRINI_FACADE_ITEMS : FACADE_ITEMS;

  // ✅ конфиг для hero (если есть)
  const heroKey = `${normalizeRoomToken(activeRoom)}:${normalizeCollectionToken(activeCollection)}`;
  const heroCfg = heroMode ? HERO_SLIDERS[heroKey] : undefined;

  const filtered = useMemo(() => {
    const needle = qFromUrl.toLowerCase();

    // ✅ Важно: door/facade фильтры имеют смысл только в модульном режиме
    // (шкафы/витрины). В режиме комнат мы их НЕ применяем.
    const isDoorFacadeFilter =
      !isRoomMode &&
      (sidebarValue.types.includes("shkafy") ||
        sidebarValue.types.includes("vitrini"));

    const doorsSet = new Set(selectedDoors);
    const facadeSet = new Set(selectedFacades);

    return MOCK.filter((pAny) => {
      const p = pAny as ProductAny;

      // -------------------------
      // 1) ROOM (раздел: спальни/гостиные/...)
      // -------------------------
      const room = getRoomSlug(p);

      if (sidebarValue.menu.length) {
        if (room && !sidebarValue.menu.includes(room)) return false;
      }

      // -------------------------
      // 2) COLLECTION (коллекции/бренды)
      // -------------------------
      const col = getCollectionSlug(p);
      if (
        sidebarValue.collections.length &&
        !sidebarValue.collections.includes(col)
      ) {
        return false;
      }

      // -------------------------
      // 3) MODULE TYPE (типы/модули) — только если НЕ RoomMode
      // -------------------------
      if (!isRoomMode) {
        const mod = getModuleSlug(p);
        if (sidebarValue.types.length && !sidebarValue.types.includes(mod))
          return false;

        // ✅ Doors / Facade для шкафов И витрин
        if (isDoorFacadeFilter && (mod === "shkafy" || mod === "vitrini")) {
          if (doorsSet.size) {
            const d = String(p.attrs?.doors ?? "");
            if (!doorsSet.has(d)) return false;
          }
          if (facadeSet.size) {
            const f = String(p.attrs?.facade ?? "");
            if (!facadeSet.has(f)) return false;
          }
        }
      }

      // -------------------------
      // 4) PRICE (цена)
      // -------------------------
      const price = priceOf(p);
      if (price < sidebarValue.priceMin) return false;
      if (price > sidebarValue.priceMax) return false;

      // -------------------------
      // 5) SEARCH (поиск)
      // -------------------------
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
    isRoomMode,
    sidebarValue.menu.join(","),
    sidebarValue.collections.join(","),
    sidebarValue.types.join(","),
    sidebarValue.priceMin,
    sidebarValue.priceMax,
    selectedDoors.join(","),
    selectedFacades.join(","),
  ]);

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

  // GSAP reveal
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-card]");
    gsap.killTweensOf(cards);

    // ✅ сброс, чтобы не "залипало" от прошлого рендера
    cards.forEach((el) => {
      (el as HTMLElement).style.opacity = "1";
      (el as HTMLElement).style.transform = "translate3d(0,0,0)";
      (el as HTMLElement).style.filter = "none";
    });

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
    selectedDoors.join(","),
    selectedFacades.join(","),
  ]);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
      {/* ✅ HERO MODE: сверху слайдер */}
      {heroMode && heroCfg ? (
        <CatalogHero title={heroCfg.title} images={heroCfg.images} />
      ) : null}

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

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
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
              params.delete("doors");
              params.delete("facade");
            })
          }
          currencyLabel={currencyLabel}
        />

        <section>
          {/* ✅ HERO MODE: фиксируем бар вверху (только в этом режиме) */}
          <div
            className={cn(
              heroMode && "sticky z-30 -mx-4 px-4",
              heroMode && "top-[116px] md:top-[128px]", // под шапку (примерно как на скринах)
            )}
          >
            <div
              className={cn(
                heroMode &&
                  "rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md shadow-[0_20px_60px_-45px_rgba(0,0,0,0.35)]",
                heroMode && "py-4",
              )}
            >
              <CatalogTopFilters
                roomItems={ROOM_ITEMS}
                brands={BRANDS}
                moduleItems={MODULE_ITEMS}
                activeRoom={activeRoom}
                activeCollection={activeCollection}
                activeModule={activeModule}
                onPickRoom={(v) =>
                  setSingleCSVParam(
                    "menu",
                    activeRoom === normalizeRoomToken(v) ? "" : v,
                  )
                }
                onPickCollection={(v) =>
                  setSingleCSVParam(
                    "collections",
                    activeCollection === normalizeCollectionToken(v) ? "" : v,
                  )
                }
                // ✅ УМНО: если выбрана комната (RoomMode) и ты кликаешь модуль —
                // мы автоматически выходим из RoomMode (убираем menu) и включаем types
                onPickModule={(v) => {
                  const next =
                    activeModule === normalizeModuleToken(v)
                      ? ""
                      : String(v ?? "");

                  pushParams((params) => {
                    // если выбираем модуль (next не пустой) в режиме комнаты — выходим из комнаты
                    if (isRoomMode && next) {
                      params.delete("menu");
                    }

                    // применяем types
                    let clean = String(next ?? "").trim();
                    clean = normalizeModuleToken(clean);
                    if (!clean) params.delete("types");
                    else params.set("types", clean);

                    // если ушли с "Шкафы" или "Витрины" — подфильтры сбрасываем
                    const m = norm(clean);
                    if (m !== "shkafy" && m !== "vitrini") {
                      params.delete("doors");
                      params.delete("facade");
                    }
                  });
                }}
                // doors/facade
                isDoorsFacadeUI={isDoorsFacadeUI}
                doorsTitle={
                  activeModule === "vitrini"
                    ? "Витрины · Створки"
                    : "Шкафы · Створки"
                }
                facadeTitle={
                  activeModule === "vitrini" ? "Витрины · Вид" : "Шкафы · Фасад"
                }
                doorItems={DOOR_ITEMS}
                facadeItems={facadeItems}
                activeDoor={activeDoor}
                activeFacade={activeFacade}
                onPickDoor={(v) =>
                  setSingleParam("doors", activeDoor === v ? "" : v)
                }
                onPickFacade={(v) =>
                  setSingleParam("facade", activeFacade === v ? "" : v)
                }
                onResetDoorFacade={() =>
                  pushParams((params) => {
                    params.delete("doors");
                    params.delete("facade");
                  })
                }
              />

              <CatalogToolbar q={q} setQ={setQ} sort={sort} setSort={setSort} />
            </div>
          </div>

          {/* ✅ обычный режим (без hero) — оставляем как есть: toolbar уже выше не нужен */}
          {!heroMode ? (
            <CatalogToolbar q={q} setQ={setQ} sort={sort} setSort={setSort} />
          ) : null}

          <CatalogGrid
            gridRef={gridRef}
            items={sorted as any}
            fmtPrice={fmtPrice}
          />

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
