// app/catalog/ui/catalog-utils.ts

import { BRANDS, CATALOG_MOCK as MOCK } from "@/app/lib/mock/catalog-products";
import { MODULE_ITEMS, ROOM_ITEMS } from "./catalog-constants";

type ProductAny = (typeof MOCK)[number] & Record<string, any>;

export function norm(s: string) {
  return String(s ?? "").trim().toLowerCase();
}

/** CSV helpers (нужны useCatalogParams) */
export function parseCSV(v: string | null) {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function setCSV(params: URLSearchParams, key: string, arr: string[]) {
  if (!arr.length) params.delete(key);
  else params.set(key, arr.join(","));
}

/**
 * ✅ Канонизатор бренда.
 * В данных/папках у тебя: "scandi" (это канон)
 * А в UI/ссылках может прилетать: "scandy" или "skandy"
 */
export function normalizeBrandSlug(v: string) {
  const s = norm(v);
  if (!s) return "";

  // любые "ошибочные/альтернативные" формы -> канон "scandi"
  if (s === "scandy") return "scandi";
  if (s === "skandy") return "scandi";
  if (s === "scand") return "scandi";


  return s;
}

// ✅ коллекции могут прилетать как slug или как title
export function normalizeCollectionToken(v: string) {
  // сначала приводим "scandy/skandy" к "scandi"
  const t0 = normalizeBrandSlug(v);
  if (!t0) return "";

  // затем пробуем найти в BRANDS
  const bySlug = BRANDS.find((b) => normalizeBrandSlug(b.slug) === t0);
  if (bySlug) return normalizeBrandSlug(bySlug.slug);

  const byTitle = BRANDS.find((b) => norm(b.title) === t0);
  if (byTitle) return normalizeBrandSlug(byTitle.slug);

  // если не нашли — возвращаем уже нормализованное значение
  return t0;
}

export function normalizeModuleToken(v: string) {
  const t = norm(v);
  if (!t) return "";

  const byValue = MODULE_ITEMS.find((x) => norm(x.value) === t);
  if (byValue) return norm(byValue.value);

  const byLabel = MODULE_ITEMS.find((x) => norm(x.label) === t);
  if (byLabel) return norm(byLabel.value);

  return t;
}

export function normalizeRoomToken(v: string) {
  const t = norm(v);
  if (!t) return "";

  const byValue = ROOM_ITEMS.find((x) => norm(x.value) === t);
  if (byValue) return norm(byValue.value);

  const byLabel = ROOM_ITEMS.find((x) => norm(x.label) === t);
  if (byLabel) return norm(byLabel.value);

  return t;
}

export function getRoomSlug(p: ProductAny) {
  return norm(
    p.cat ?? p.menu ?? p.room ?? p.section ?? p.category ?? p.room_slug ?? "",
  );
}

export function getCollectionSlug(p: ProductAny) {
  const raw =
    p.brand ?? p.collection ?? p.model ?? p.series ?? p.brandSlug ?? p.collectionSlug ?? "";

  return normalizeCollectionToken(String(raw ?? ""));
}

export function getModuleSlug(p: ProductAny) {
  return norm(p.type ?? p.module ?? p.kind ?? p.cat ?? p.item_type ?? "");
}
