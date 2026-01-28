// app/lib/mock/collections-data/buongiorno.ts
import { makeProduct, type CatalogProduct } from "../catalog-base";

export const BUONGIORNO_PRODUCTS: CatalogProduct[] = [
  // --------------------
  // КОМОДЫ
  // --------------------
  makeProduct({
    id: "buongiorno-komody-shirokie",
    title: "Комод широкий",
    brand: "buongiorno",
    cat: "komody",
    basePath: "/products/buongiorno/komody/komody-shirokie",
    gallery: [
      "/products/buongiorno/komody/komody-shirokie/01.jpg",
      "/products/buongiorno/komody/komody-shirokie/02.jpg",
    ],
    priceRUB: 69900,
    priceUZS: 9800000,
  }),
  makeProduct({
    id: "buongiorno-komody-standart",
    title: "Комод стандарт",
    brand: "buongiorno",
    cat: "komody",
    basePath: "/products/buongiorno/komody/komody-standart",
    gallery: [
      "/products/buongiorno/komody/komody-standart/01.jpg",
      "/products/buongiorno/komody/komody-standart/02.jpg",
    ],
    priceRUB: 59900,
    priceUZS: 8500000,
  }),

  // --------------------
  // КРОВАТИ (01–12)
  // --------------------
  makeProduct({
    id: "buongiorno-krovati",
    title: "Кровать",
    brand: "buongiorno",
    cat: "krovati",
    basePath: "/products/buongiorno/krovati",
    coverIndex: 1,
    gallery: Array.from({ length: 12 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/products/buongiorno/krovati/${n}.jpg`;
    }),
    priceRUB: 159900,
    priceUZS: 22900000,
  }),

  // --------------------
  // ПОЛКИ
  // --------------------
  makeProduct({
    id: "buongiorno-polki-komplekt",
    title: "Полки (комплект)",
    brand: "buongiorno",
    cat: "polki",
    basePath: "/products/buongiorno/polki/polki-komplekt",
    coverIndex: 1,
    gallery: Array.from({ length: 8 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/products/buongiorno/polki/polki-komplekt/${n}.jpg`;
    }),
    priceRUB: 24900,
    priceUZS: 3600000,
  }),
  makeProduct({
    id: "buongiorno-polki-standart",
    title: "Полки стандарт",
    brand: "buongiorno",
    cat: "polki",
    basePath: "/products/buongiorno/polki/polki-standart",
    coverIndex: 1,
    gallery: Array.from({ length: 7 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/products/buongiorno/polki/polki-standart/${n}.jpg`;
    }),
    priceRUB: 19900,
    priceUZS: 2900000,
  }),

  // --------------------
  // ПУФЫ
  // --------------------
  makeProduct({
    id: "buongiorno-pufi-shirokie",
    title: "Пуф широкий",
    brand: "buongiorno",
    cat: "pufi",
    basePath: "/products/buongiorno/pufi/pufi-shirokie",
    gallery: [
      "/products/buongiorno/pufi/pufi-shirokie/01.jpg",
      "/products/buongiorno/pufi/pufi-shirokie/02.jpg",
    ],
    priceRUB: 17900,
    priceUZS: 2600000,
  }),
  makeProduct({
    id: "buongiorno-pufi-standart",
    title: "Пуф стандарт",
    brand: "buongiorno",
    cat: "pufi",
    basePath: "/products/buongiorno/pufi/pufi-standart",
    gallery: [
      "/products/buongiorno/pufi/pufi-standart/01.jpg",
      "/products/buongiorno/pufi/pufi-standart/02.jpg",
    ],
    priceRUB: 15900,
    priceUZS: 2300000,
  }),

  // --------------------
  // ШКАФЫ
  // --------------------
  makeProduct({
    id: "buongiorno-shkafy-max",
    title: "Шкаф MAX",
    brand: "buongiorno",
    cat: "shkafy",
    basePath: "/products/buongiorno/shkafy/shkafy-max",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/shkafy/shkafy-max/${n}.jpg`
    ),
    priceRUB: 199900,
    priceUZS: 29500000,
  }),
  makeProduct({
    id: "buongiorno-shkafy-min",
    title: "Шкаф MIN",
    brand: "buongiorno",
    cat: "shkafy",
    basePath: "/products/buongiorno/shkafy/shkafy-min",
    gallery: [
      "/products/buongiorno/shkafy/shkafy-min/01.jpg",
      "/products/buongiorno/shkafy/shkafy-min/02.jpg",
    ],
    priceRUB: 169900,
    priceUZS: 24900000,
  }),
  makeProduct({
    id: "buongiorno-shkafy-standart",
    title: "Шкаф STANDARD",
    brand: "buongiorno",
    cat: "shkafy",
    basePath: "/products/buongiorno/shkafy/shkafy-standart",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/shkafy/shkafy-standart/${n}.jpg`
    ),
    priceRUB: 179900,
    priceUZS: 26500000,
  }),

  // --------------------
  // СТОЛЫ
  // --------------------
  makeProduct({
    id: "buongiorno-stoli",
    title: "Стол",
    brand: "buongiorno",
    cat: "stoli",
    basePath: "/products/buongiorno/stoli",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/stoli/${n}.jpg`
    ),
    priceRUB: 42900,
    priceUZS: 6200000,
  }),

  // --------------------
  // ТУМБЫ
  // --------------------
  makeProduct({
    id: "buongiorno-tumby-shirokie",
    title: "Тумба широкая",
    brand: "buongiorno",
    cat: "tumby",
    basePath: "/products/buongiorno/tumby/tumby-shirokie",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/tumby/tumby-shirokie/${n}.jpg`
    ),
    priceRUB: 45900,
    priceUZS: 6600000,
  }),
  makeProduct({
    id: "buongiorno-tumby-standart",
    title: "Тумба стандарт",
    brand: "buongiorno",
    cat: "tumby",
    basePath: "/products/buongiorno/tumby/tumby-standart",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/tumby/tumby-standart/${n}.jpg`
    ),
    priceRUB: 39900,
    priceUZS: 5800000,
  }),

  // --------------------
  // ВИТРИНЫ
  // --------------------
  makeProduct({
    id: "buongiorno-vitrini-max",
    title: "Витрина MAX",
    brand: "buongiorno",
    cat: "vitrini",
    basePath: "/products/buongiorno/vitrini/vitrini-max",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/vitrini/vitrini-max/${n}.jpg`
    ),
    priceRUB: 99900,
    priceUZS: 14500000,
  }),
  makeProduct({
    id: "buongiorno-vitrini-min",
    title: "Витрина MIN",
    brand: "buongiorno",
    cat: "vitrini",
    basePath: "/products/buongiorno/vitrini/vitrini-min",
    coverIndex: 1,
    gallery: ["01","02","03","04"].map(
      n => `/products/buongiorno/vitrini/vitrini-min/${n}.jpg`
    ),
    priceRUB: 79900,
    priceUZS: 11800000,
  }),

  // --------------------
  // ЗЕРКАЛА
  // --------------------
  makeProduct({
    id: "buongiorno-zerkala-shirokie",
    title: "Зеркало широкое",
    brand: "buongiorno",
    cat: "zerkala",
    basePath: "/products/buongiorno/zerkala/zerkala-shirokie",
    gallery: [
      "/products/buongiorno/zerkala/zerkala-shirokie/01.jpg",
      "/products/buongiorno/zerkala/zerkala-shirokie/02.jpg",
    ],
    priceRUB: 14900,
    priceUZS: 2200000,
  }),
  makeProduct({
    id: "buongiorno-zerkala-standart",
    title: "Зеркало стандарт",
    brand: "buongiorno",
    cat: "zerkala",
    basePath: "/products/buongiorno/zerkala/zerkala-standart",
    gallery: [
      "/products/buongiorno/zerkala/zerkala-standart/01.jpg",
      "/products/buongiorno/zerkala/zerkala-standart/02.jpg",
    ],
    priceRUB: 13900,
    priceUZS: 2050000,
  }),
];
