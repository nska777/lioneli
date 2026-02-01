// app/catalog/ui/CatalogClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";

import FiltersSidebar from "./FiltersSidebar";
import CatalogGrid from "./CatalogGrid";
import CatalogTopBar from "./CatalogTopBar";
import CatalogHeroSlider from "./CatalogHeroSlider";
import { getSliderMenuSlidesAsync } from "./sliderMenuSlides";

import { DOOR_ITEMS } from "./catalog-constants";
import { norm } from "./catalog-utils";
import { useCatalogParams } from "./useCatalogParams";
import { useCatalogData } from "./useCatalogData";

// ✅ если файл манифеста есть — используем
// если ты пока не создал heroSlidesManifest.ts — просто удали эти 2 импорта
import { HERO_SLIDES_MANIFEST, makeSlidesFromConf } from "./heroSlidesManifest";

export default function CatalogClient({
  initialBrand,
  initialCategory,
}: {
  initialBrand: string;
  initialCategory: string;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const sp = useSearchParams();

  const hero = sp.get("hero") === "1";

  const {
    region,
    currencyLabel,
    fmtPrice,
    priceOf,
    pushParams,
    setSingleParam,
    setSingleCSVParam,
    selectedDoors,
    selectedFacades,
    sidebarValue,
    sidebarMeta,
    onSidebarChange,
    resetAll,
    qFromUrl,
    q,
    setQ,
    sort,
    setSort,
  } = useCatalogParams({ initialBrand, initialCategory });

  const {
    activeRoom,
    activeCollection,
    activeModule,
    isRoomMode,
    isDoorsFacadeUI,
    facadeItems,
    sorted,
  } = useCatalogData({
    sidebarValue,
    qFromUrl,
    sort,
    region,
    priceOf,
    selectedDoors,
    selectedFacades,
  });

  const activeDoor = selectedDoors[0] || "";
  const activeFacade = selectedFacades[0] || "";

  // ✅ Держим слайды и лоадинг
  const [heroSlides, setHeroSlides] = useState<string[]>([]);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroEverReady, setHeroEverReady] = useState(false); // ✅ было ли хоть раз что-то показано

  const heroTitle = useMemo(() => {
    if (!activeRoom || !activeCollection) return "";
    const roomLabel =
      activeRoom === "bedrooms"
        ? "Спальня"
        : activeRoom === "living"
          ? "Гостиная"
          : activeRoom === "youth"
            ? "Молодёжная"
            : activeRoom === "tables_chairs"
              ? "Столы и стулья"
              : activeRoom === "hallway"
                ? "Прихожая"
                : "Коллекция";

    return `${roomLabel} «${String(activeCollection).toUpperCase()}»`;
  }, [activeRoom, activeCollection]);

  // ✅ HERO: гибрид
  // 1) если есть manifest — ставим сразу (мгновенно)
  // 2) если manifest нет — пробуем async (как раньше)
  // 3) если не нашли — НЕ очищаем прошлое, чтобы не было пустоты
  useEffect(() => {
    if (!hero || !activeRoom || !activeCollection) return;

    const room = String(activeRoom).trim().toLowerCase();
    const col = String(activeCollection).trim().toLowerCase();
    const key = `${room}:${col}`;

    let alive = true;
    setHeroLoading(true);

    // 1) manifest → моментально
    const conf = HERO_SLIDES_MANIFEST?.[key];
    if (conf) {
      const slides = makeSlidesFromConf(conf);

      // ⚠️ важный момент: если пути неверные — будут 404 и "битые картинки"
      // но UI не должен становиться пустым
      if (slides.length) {
        setHeroSlides(slides);
        setHeroEverReady(true);
      }

      setHeroLoading(false);
      return;
    }

    // 2) fallback: старый метод (поиск существующих файлов)
    (async () => {
      const slides = await getSliderMenuSlidesAsync(room, col, 12);
      if (!alive) return;

      if (slides.length) {
        setHeroSlides(slides);
        setHeroEverReady(true);
      } else {
        // 3) ничего не нашли — не очищаем, иначе пусто
        // если вообще ни разу не было слайдов — тогда покажем рамку
      }

      setHeroLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [hero, activeRoom, activeCollection]);

  // GSAP reveal (только карточки)
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-card]");
    gsap.killTweensOf(cards);

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

  const TopBar = (
    <CatalogTopBar
      activeRoom={activeRoom}
      activeCollection={activeCollection}
      activeModule={activeModule}
      isRoomMode={isRoomMode}
      isDoorsFacadeUI={isDoorsFacadeUI}
      q={q}
      setQ={setQ}
      sort={sort}
      setSort={setSort}
      activeDoor={activeDoor}
      activeFacade={activeFacade}
      doorItems={DOOR_ITEMS as any}
      facadeItems={facadeItems as any}
      onPickRoom={(v) =>
        setSingleCSVParam(
          "menu",
          activeRoom === v.trim().toLowerCase() ? "" : v,
        )
      }
      onPickCollection={(v) =>
        setSingleCSVParam(
          "collections",
          activeCollection === v.trim().toLowerCase() ? "" : v,
        )
      }
      onPickModule={(v) => {
        const next =
          activeModule === v.trim().toLowerCase() ? "" : String(v ?? "");

        pushParams((params) => {
          if (isRoomMode && next) params.delete("menu");

          const clean = String(next ?? "")
            .trim()
            .toLowerCase();
          if (!clean) params.delete("types");
          else params.set("types", clean);

          const m = norm(clean);
          if (m !== "shkafy" && m !== "vitrini") {
            params.delete("doors");
            params.delete("facade");
          }
        });
      }}
      onPickDoor={(v) => setSingleParam("doors", activeDoor === v ? "" : v)}
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
  );

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

      {/* ✅ Слайдер всегда занимает место (в hero-режиме), НЕ исчезает */}
      {hero ? (
        <div className="mb-6">
          {heroSlides.length ? (
            <div className="relative">
              <CatalogHeroSlider
                slides={heroSlides}
                subtitle="Коллекция"
                title={heroTitle}
                height={420}
              />

              {/* лёгкий оверлей загрузки */}
              {heroLoading ? (
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-white/10 backdrop-blur-[1px]" />
              ) : null}
            </div>
          ) : (
            // ✅ рамка только если ещё ни разу не было слайдов
            <div
              className="h-[420px] rounded-[28px] border border-black/10 bg-[#F7F5F2]"
              style={{ opacity: heroEverReady ? 0.6 : 1 }}
            />
          )}
        </div>
      ) : null}

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
          {TopBar}

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
