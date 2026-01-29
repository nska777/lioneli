"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function getRoomSlug(p: ProductAny) {
  return String(
    p.menu ?? p.room ?? p.section ?? p.category ?? p.room_slug ?? "",
  )
    .trim()
    .toLowerCase();
}

function getCollectionSlug(p: ProductAny) {
  return String(p.brand ?? p.collection ?? p.model ?? p.series ?? "")
    .trim()
    .toLowerCase();
}

function getModuleSlug(p: ProductAny) {
  return String(p.type ?? p.module ?? p.kind ?? p.cat ?? p.item_type ?? "")
    .trim()
    .toLowerCase();
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

  function pushParams(mutator: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(sp.toString());
    mutator(params);
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
  }

  function setSingleParam(key: string, val: string) {
    pushParams((params) => {
      if (!val) params.delete(key);
      else params.set(key, val);
    });
  }

  function setSingleCSVParam(
    key: "menu" | "collections" | "types",
    val: string,
  ) {
    pushParams((params) => {
      if (!val) params.delete(key);
      else params.set(key, val);

      // ✅ если ушли с "Шкафы" или "Витрины" — подфильтры сбрасываем
      if (key === "types") {
        const next = (val || "").toLowerCase();
        if (next !== "shkafy" && next !== "vitrini") {
          params.delete("doors");
          params.delete("facade");
        }
      }
    });
  }

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
      setCSV(params, "menu", next.menu);
      setCSV(params, "collections", next.collections);
      setCSV(params, "types", next.types);

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
    router.push("/catalog", { scroll: false });
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

  const isDoorsFacadeUI =
    activeModule === "shkafy" || activeModule === "vitrini";

  const activeDoor = selectedDoors[0] || "";
  const activeFacade = selectedFacades[0] || "";

  const facadeItems =
    activeModule === "vitrini" ? VITRINI_FACADE_ITEMS : FACADE_ITEMS;

  const filtered = useMemo(() => {
    const needle = qFromUrl.toLowerCase();

    const isDoorFacadeFilter =
      sidebarValue.types.includes("shkafy") ||
      sidebarValue.types.includes("vitrini");

    const doorsSet = new Set(selectedDoors);
    const facadeSet = new Set(selectedFacades);

    return MOCK.filter((pAny) => {
      const p = pAny as ProductAny;

      const room = getRoomSlug(p);
      if (sidebarValue.menu.length) {
        if (room && !sidebarValue.menu.includes(room)) return false;
      }

      const col = getCollectionSlug(p);
      if (
        sidebarValue.collections.length &&
        !sidebarValue.collections.includes(col)
      )
        return false;

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

      const price = priceOf(p);
      if (price < sidebarValue.priceMin) return false;
      if (price > sidebarValue.priceMax) return false;

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
          <CatalogTopFilters
            roomItems={ROOM_ITEMS}
            brands={BRANDS}
            moduleItems={MODULE_ITEMS}
            activeRoom={activeRoom}
            activeCollection={activeCollection}
            activeModule={activeModule}
            onPickRoom={(v) =>
              setSingleCSVParam("menu", activeRoom === v ? "" : v)
            }
            onPickCollection={(v) =>
              setSingleCSVParam("collections", activeCollection === v ? "" : v)
            }
            onPickModule={(v) =>
              setSingleCSVParam("types", activeModule === v ? "" : v)
            }
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
