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
];
