// app/catalog/ui/useCatalogData.ts
"use client";

import { useMemo } from "react";
import { CATALOG_MOCK as MOCK } from "@/app/lib/mock/catalog-products";

import {
  ROOM_MENUS_SET,
  FACADE_ITEMS,
  VITRINI_FACADE_ITEMS,
} from "./catalog-constants";
import { norm, getRoomSlug, getCollectionSlug, getModuleSlug } from "./catalog-utils";

import type { SortKey } from "./useCatalogParams";
import type { FiltersValue } from "./FiltersSidebar";

type ProductAny = (typeof MOCK)[number] & Record<string, any>;

export function useCatalogData({
  sidebarValue,
  qFromUrl,
  sort,
  region,
  priceOf,
  selectedDoors,
  selectedFacades,
}: {
  sidebarValue: FiltersValue;
  qFromUrl: string;
  sort: SortKey;
  region: string;
  priceOf: (p: ProductAny) => number;
  selectedDoors: string[];
  selectedFacades: string[];
}) {
  const activeRoom = sidebarValue.menu[0] || "";
  const activeCollection = sidebarValue.collections[0] || "";
  const activeModule = sidebarValue.types[0] || "";

  const isRoomMode = !!activeRoom && ROOM_MENUS_SET.has(norm(activeRoom));
  const isDoorsFacadeUI = activeModule === "shkafy" || activeModule === "vitrini";

  const facadeItems =
    activeModule === "vitrini" ? VITRINI_FACADE_ITEMS : FACADE_ITEMS;

  const filtered = useMemo(() => {
    const needle = qFromUrl.toLowerCase();

    const isDoorFacadeFilter =
      !isRoomMode &&
      (sidebarValue.types.includes("shkafy") || sidebarValue.types.includes("vitrini"));

    const doorsSet = new Set(selectedDoors);
    const facadeSet = new Set(selectedFacades);

    return MOCK.filter((pAny) => {
      const p = pAny as ProductAny;

      // 1) ROOM
      const room = getRoomSlug(p);
      if (sidebarValue.menu.length) {
        if (room && !sidebarValue.menu.includes(room)) return false;
      }

      // 2) COLLECTION
      const col = getCollectionSlug(p);
      if (sidebarValue.collections.length && !sidebarValue.collections.includes(col)) {
        return false;
      }

      // 3) MODULE TYPE — только если НЕ RoomMode
      if (!isRoomMode) {
        const mod = getModuleSlug(p);
        if (sidebarValue.types.length && !sidebarValue.types.includes(mod)) return false;

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

      // 4) PRICE
      const price = priceOf(p);
      if (price < sidebarValue.priceMin) return false;
      if (price > sidebarValue.priceMax) return false;

      // 5) SEARCH
      if (needle) {
        const hay = `${p.title ?? ""} ${p.badge ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      return true;
    });
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
        arr.sort((a, b) => String(a.title).localeCompare(String(b.title), "ru"));
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

  return {
    activeRoom,
    activeCollection,
    activeModule,
    isRoomMode,
    isDoorsFacadeUI,
    facadeItems,
    sorted,
  };
}
