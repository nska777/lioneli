// app/lib/mock/collections-data/elizabeth.ts
import { makeProduct, type CatalogProduct } from "../catalog-base";

export const ELIZABETH_PRODUCTS: CatalogProduct[] = [
  // ✅ Комоды (01)
  makeProduct({
    id: "elizabeth-komody-01",
    title: "Комод",
    brand: "elizabeth",
    cat: "komody",
    basePath: "/products/elizabeth/komody",
    coverIndex: 1,
    gallery: ["/products/elizabeth/komody/01.jpg"],
    priceRUB: 59900,
    priceUZS: 8500000,
  }),

  // ✅ Кровати (01, 02)
  makeProduct({
    id: "elizabeth-krovati",
    title: "Кровать",
    brand: "elizabeth",
    cat: "krovati",
    basePath: "/products/elizabeth/krovati",
    coverIndex: 1,
    gallery: [
      "/products/elizabeth/krovati/01.jpg",
      "/products/elizabeth/krovati/02.jpg",
    ],
    priceRUB: 139900,
    priceUZS: 19900000,
  }),

  // ✅ Шкафы (01, 02)
  makeProduct({
    id: "elizabeth-shkafy",
    title: "Шкаф",
    brand: "elizabeth",
    cat: "shkafy",
    basePath: "/products/elizabeth/shkafy",
    coverIndex: 1,
    gallery: [
      "/products/elizabeth/shkafy/01.jpg",
      "/products/elizabeth/shkafy/02.jpg",
    ],
    priceRUB: 189900,
    priceUZS: 27500000,
  }),

  // ✅ Стол (01)
  makeProduct({
    id: "elizabeth-stoli-01",
    title: "Стол",
    brand: "elizabeth",
    cat: "stoli",
    basePath: "/products/elizabeth/stoli",
    coverIndex: 1,
    gallery: ["/products/elizabeth/stoli/01.jpg"],
    priceRUB: 39900,
    priceUZS: 5800000,
  }),

  // ✅ Тумбы (01, 02, 03)
  makeProduct({
    id: "elizabeth-tumby",
    title: "Тумба",
    brand: "elizabeth",
    cat: "tumby",
    basePath: "/products/elizabeth/tumby",
    coverIndex: 1,
    gallery: [
      "/products/elizabeth/tumby/01.jpg",
      "/products/elizabeth/tumby/02.jpg",
      "/products/elizabeth/tumby/03.jpg",
    ],
    priceRUB: 34900,
    priceUZS: 5100000,
  }),
];
