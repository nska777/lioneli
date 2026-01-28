// app/lib/mock/collections-data/pitti.ts
import { makeProduct, type CatalogProduct } from "../catalog-base";

export const PITTI_PRODUCTS: CatalogProduct[] = [
  // ✅ Комоды
  makeProduct({
    id: "pitti-komody-shirokie",
    title: "Комод широкий",
    brand: "pitti",
    cat: "komody",
    basePath: "/products/pitti/komody/komody-shirokie",
    gallery: [
      "/products/pitti/komody/komody-shirokie/01.jpg",
      "/products/pitti/komody/komody-shirokie/02.jpg",
    ],
    priceRUB: 69900,
    priceUZS: 9800000,
  }),
  makeProduct({
    id: "pitti-komody-visokie",
    title: "Комод высокий",
    brand: "pitti",
    cat: "komody",
    basePath: "/products/pitti/komody/komody-visokie",
    gallery: ["/products/pitti/komody/komody-visokie/01.jpg"],
    priceRUB: 59900,
    priceUZS: 8500000,
  }),

  // ✅ Кровати (у тебя файлы прямо в /krovati/01-02)
  makeProduct({
    id: "pitti-krovati-01",
    title: "Кровать",
    brand: "pitti",
    cat: "krovati",
    basePath: "/products/pitti/krovati",
    coverIndex: 1,
    gallery: [
      "/products/pitti/krovati/01.jpg",
      "/products/pitti/krovati/02.jpg",
    ],
    priceRUB: 149900,
    priceUZS: 21500000,
  }),

  // ✅ Шкафы
  makeProduct({
    id: "pitti-shkafy-shirokie",
    title: "Шкаф широкий",
    brand: "pitti",
    cat: "shkafy",
    basePath: "/products/pitti/shkafy/shkafy-shirokie",
    gallery: [
      "/products/pitti/shkafy/shkafy-shirokie/01.jpg",
      "/products/pitti/shkafy/shkafy-shirokie/02.jpg",
    ],
    priceRUB: 199900,
    priceUZS: 29500000,
  }),

  // ⚠️ ВАЖНО: в твоём скрине у shkafy-visokie файл подписан "шкаф высокий"
  // Если там НЕ 01.jpg — переименуй файл в 01.jpg (или скажи имя файла — поправлю путь).
  makeProduct({
    id: "pitti-shkafy-visokie",
    title: "Шкаф высокий",
    brand: "pitti",
    cat: "shkafy",
    basePath: "/products/pitti/shkafy/shkafy-visokie",
    gallery: ["/products/pitti/shkafy/shkafy-visokie/01.jpg"],
    priceRUB: 169900,
    priceUZS: 24900000,
  }),

  // ✅ Стол (в папке только 01)
  makeProduct({
    id: "pitti-stoli-01",
    title: "Стол",
    brand: "pitti",
    cat: "stoli",
    basePath: "/products/pitti/stoli",
    coverIndex: 1,
    gallery: ["/products/pitti/stoli/01.jpg"],
    priceRUB: 39900,
    priceUZS: 5800000,
  }),

  // ✅ Тумбы
  makeProduct({
    id: "pitti-tumby-standart",
    title: "Тумба стандарт",
    brand: "pitti",
    cat: "tumby",
    basePath: "/products/pitti/tumby/tumby-standart",
    gallery: [
      "/products/pitti/tumby/tumby-standart/01.jpg",
      "/products/pitti/tumby/tumby-standart/02.jpg",
    ],
    priceRUB: 39900,
    priceUZS: 5800000,
  }),
  makeProduct({
    id: "pitti-tumby-tv",
    title: "Тумба TV",
    brand: "pitti",
    cat: "tumby",
    basePath: "/products/pitti/tumby/tumby-tv",
    gallery: ["/products/pitti/tumby/tumby-tv/01.jpg"],
    priceRUB: 55900,
    priceUZS: 8100000,
  }),
];
