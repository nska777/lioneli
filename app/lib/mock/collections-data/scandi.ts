import { makeGallery, makeProduct, type CatalogProduct } from "../catalog-base";

export const SCANDI_PRODUCTS: CatalogProduct[] = [
  // =========================
  // ШКАФЫ — SCANDI
  // =========================

  makeProduct({
    id: "scandi-shkafy-1d-blind",
    title: "Шкаф одностворчатый глухой",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/1d-blind",
    gallery: makeGallery("/products/scandi/shkafy/1d-blind", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 1, facade: "blind" },
  }),
  makeProduct({
    id: "scandi-shkafy-1d-mirror",
    title: "Шкаф одностворчатый зеркальный",
    brand: "scandi",
    cat: "shkafy",
    basePath: "/products/scandi/shkafy/1d-mirror",
    gallery: makeGallery("/products/scandi/shkafy/1d-mirror", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 1, facade: "mirror" },
  }),

  // ... (шкафы 2d / 3d / 4d — БЕЗ ИЗМЕНЕНИЙ)

  // =========================
  // ВИТРИНЫ — SCANDI
  // =========================

  // 1 створка
  makeProduct({
    id: "scandi-vitrini-1d-blind",
    title: "Витрина одностворчатая",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/1d-blind",
    gallery: makeGallery("/products/scandi/vitrini/1d-blind", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 1, facade: "blind" },
  }),
  makeProduct({
    id: "scandi-vitrini-1d-glass",
    title: "Витрина одностворчатая со стеклом",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/1d-glass",
    gallery: makeGallery("/products/scandi/vitrini/1d-glass", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 1, facade: "glass" },
  }),
  makeProduct({
    id: "scandi-vitrini-1d-glass-shelves",
    title: "Витрина одностворчатая со стеклом и стеклянными полками",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/1d-glass-shelves",
    gallery: makeGallery("/products/scandi/vitrini/1d-glass-shelves", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 1, facade: "glass-shelves" },
  }),

  // 2 створки
  makeProduct({
    id: "scandi-vitrini-2d-blind",
    title: "Витрина двустворчатая",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/2d-blind",
    gallery: makeGallery("/products/scandi/vitrini/2d-blind", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 2, facade: "blind" },
  }),
  makeProduct({
    id: "scandi-vitrini-2d-glass",
    title: "Витрина двустворчатая со стеклом",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/2d-glass",
    gallery: makeGallery("/products/scandi/vitrini/2d-glass", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 2, facade: "glass" },
  }),
  makeProduct({
    id: "scandi-vitrini-2d-glass-shelves",
    title: "Витрина двустворчатая со стеклом и стеклянными полками",
    brand: "scandi",
    cat: "vitrini",
    basePath: "/products/scandi/vitrini/2d-glass-shelves",
    gallery: makeGallery("/products/scandi/vitrini/2d-glass-shelves", 1),
    priceUZS: 0,
    priceRUB: 0,
    attrs: { doors: 2, facade: "glass-shelves" },
  }),
  makeProduct({
  id: "scandi-komody-3-drawers",
  title: "Комод три ящика",
  brand: "scandi",
  cat: "komody",
  basePath: "/products/scandi/komody/3-drawers",
  gallery: makeGallery("/products/scandi/komody/3-drawers", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "3-drawers",
  },
}),

makeProduct({
  id: "scandi-komody-wide",
  title: "Комод широкий",
  brand: "scandi",
  cat: "komody",
  basePath: "/products/scandi/komody/wide",
  gallery: makeGallery("/products/scandi/komody/wide", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "wide",
  },
}),

makeProduct({
  id: "scandi-zerkala-on-dresser",
  title: "Зеркало на комод",
  brand: "scandi",
  cat: "zerkala",
  basePath: "/products/scandi/zerkala/on-dresser",
  gallery: makeGallery("/products/scandi/zerkala/on-dresser", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "on-dresser",
  },
}),

makeProduct({
  id: "scandi-zerkala-wide",
  title: "Зеркало широкое",
  brand: "scandi",
  cat: "zerkala",
  basePath: "/products/scandi/zerkala/wide",
  gallery: makeGallery("/products/scandi/zerkala/wide", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "wide",
  },
}),

makeProduct({
  id: "scandi-stoli-desk",
  title: "Стол письменный",
  brand: "scandi",
  cat: "stoli",
  basePath: "/products/scandi/stoli/desk",
  gallery: makeGallery("/products/scandi/stoli/desk", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "desk",
  },
}),

makeProduct({
  id: "scandi-stoli-toilet",
  title: "Стол туалетный",
  brand: "scandi",
  cat: "stoli",
  basePath: "/products/scandi/stoli/toilet",
  gallery: makeGallery("/products/scandi/stoli/toilet", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "toilet",
  },
}),
makeProduct({
  id: "scandi-tumby-bedside",
  title: "Тумба прикроватная",
  brand: "scandi",
  cat: "tumby",
  basePath: "/products/scandi/tumby/bedside",
  gallery: makeGallery("/products/scandi/tumby/bedside", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "bedside",
  },
}),

makeProduct({
  id: "scandi-tumby-tv",
  title: "Тумба ТВ",
  brand: "scandi",
  cat: "tumby",
  basePath: "/products/scandi/tumby/tv",
  gallery: makeGallery("/products/scandi/tumby/tv", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "tv",
  },
}),

makeProduct({
  id: "scandi-fasadi-blind",
  title: "Фасад глухой",
  brand: "scandi",
  cat: "fasadi",
  basePath: "/products/scandi/fasadi/blind",
  gallery: makeGallery("/products/scandi/fasadi/blind", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "blind",
  },
}),

makeProduct({
  id: "scandi-fasadi-mirror",
  title: "Фасад зеркальный",
  brand: "scandi",
  cat: "fasadi",
  basePath: "/products/scandi/fasadi/mirror",
  gallery: makeGallery("/products/scandi/fasadi/mirror", 1),
  priceUZS: 0,
  priceRUB: 0,
  attrs: {
    subType: "mirror",
  },
}),

// -------------------------
// КРОВАТИ — SCANDI
// -------------------------

makeProduct({
  id: "scandi-krovati-min-base",
  title: "Кровать с кроватным основанием",
  brand: "scandi",
  cat: "krovati",
  basePath: "/products/scandi/krovati/min-base",

  // ✅ чтобы всегда было 2 фото в галерее (главная + подслайдер)
  gallery: [
    "/products/scandi/krovati/min-base/01.jpg",
    "/products/scandi/krovati/min-base/02.jpg",
  ],

  // ✅ цены "наоборот":
  // делаем базовую цену = 120×200 (ДОРОЖЕ),
  // а 160×200 делаем дешевле через отрицательную дельту
  priceUZS: 18_900_000, // ⬅️ базовая цена для 120×200 (дороже)
  priceRUB: 0,

  variants: [
    {
      id: "size-120x200",
      title: "120×200",
      kind: "option",
      group: "size",
      priceDeltaUZS: 0, // 120×200 = базовая (дороже)
      priceDeltaRUB: 0,
      gallery: ["/products/scandi/krovati/min-base/02.jpg"], // ✅ 120 -> 01.jpg
    },
    {
      id: "size-160x200",
      title: "160×200",
      kind: "option",
      group: "size",
      priceDeltaUZS: +2_000_000, // ✅ 160×200 дешевле (цены наоборот)
      priceDeltaRUB: 0,
      gallery: ["/products/scandi/krovati/min-base/01.jpg"], // ✅ 160 -> 02.jpg
    },

    // ❌ МЕХАНИЗМ УБРАН (по ТЗ — скрыть кнопку "без подъёмного механизма")
  ],

  attrs: { subType: "min", mechanism: "base" } as any,
}),

// ✅ С подъёмным механизмом (отдельный товар, папка min-lift)
makeProduct({
  id: "scandi-krovati-min-lift",
  title: "Кровать с подъёмным механизмом",
  brand: "scandi",
  cat: "krovati",
  basePath: "/products/scandi/krovati/min-lift",
  gallery: ["/products/scandi/krovati/min-lift/01.jpg"],
  priceUZS: 21_900_000,
  priceRUB: 0,

  variants: [
    // ✅ размер фиксируем на 160×200 (и это будет "Размеры кровати")
    {
      id: "size-160x200",
      title: "160×200",
      kind: "option",
      group: "size",
      priceDeltaUZS: 0,
      priceDeltaRUB: 0,
      gallery: ["/products/scandi/krovati/min-lift/01.jpg"],
    },

    // ✅ механизм: lift активен по дефолту (первый и не disabled)
    {
      id: "mechanism-lift",
      title: "С подъёмным механизмом",
      kind: "option",
      group: "mechanism",
      priceDeltaUZS: 0,
      priceDeltaRUB: 0,
    },
    {
      id: "mechanism-base",
      title: "Без подъёмного механизма",
      kind: "option",
      group: "mechanism",
      disabled: true, // ✅ серый/неактивный
      priceDeltaUZS: 0,
      priceDeltaRUB: 0,
    },
  ],

  attrs: { subType: "min", mechanism: "lift" } as any,
}),


];
