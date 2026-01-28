// app/lib/mock/collections-data/salvador.ts
import { makeProduct, type CatalogProduct } from "../catalog-base";

export const SALVADOR_PRODUCTS: CatalogProduct[] = [
  // ✅ Фасады
  makeProduct({
    id: "salvador-fasadi-standart",
    title: "SALVADOR · Фасады стандарт",
    brand: "salvador",
    cat: "fasadi",
    basePath: "/products/salvador/fasadi/fasadi-standart",
    gallery: [
      "/products/salvador/fasadi/fasadi-standart/01.jpg",
      "/products/salvador/fasadi/fasadi-standart/02.jpg",
    ],
    priceRUB: 89000,
    priceUZS: 12900000,
  }),
  makeProduct({
    id: "salvador-fasadi-top",
    title: "SALVADOR · Фасады TOP",
    brand: "salvador",
    cat: "fasadi",
    basePath: "/products/salvador/fasadi/fasadi-top",
    gallery: ["/products/salvador/fasadi/fasadi-top/01.jpg"],
    priceRUB: 89000,
    priceUZS: 12900000,
  }),

  // ✅ Комоды
  makeProduct({
    id: "salvador-komody-shirokie",
    title: "Комод широкий",
    brand: "salvador",
    cat: "komody",
    basePath: "/products/salvador/komody/komody-shirokie",
    gallery: ["/products/salvador/komody/komody-shirokie/01.jpg"],
    priceRUB: 69900,
    priceUZS: 9800000,
  }),
  makeProduct({
    id: "salvador-komody-standart",
    title: "Комод стандарт",
    brand: "salvador",
    cat: "komody",
    basePath: "/products/salvador/komody/komody-standart",
    gallery: ["/products/salvador/komody/komody-standart/01.jpg"],
    priceRUB: 59900,
    priceUZS: 8500000,
  }),

  // ✅ Кровати
  makeProduct({
    id: "salvador-krovati-max",
    title: "Кровать MAX",
    brand: "salvador",
    cat: "krovati",
    basePath: "/products/salvador/krovati/krovati-max",
    gallery: [
      "/products/salvador/krovati/krovati-max/01.jpg",
      "/products/salvador/krovati/krovati-max/02.jpg",
    ],
    priceRUB: 149900,
    priceUZS: 21500000,
  }),
  makeProduct({
    id: "salvador-krovati-min",
    title: "Кровать MIN",
    brand: "salvador",
    cat: "krovati",
    basePath: "/products/salvador/krovati/krovati-min",
    gallery: [
      "/products/salvador/krovati/krovati-min/01.jpg",
      "/products/salvador/krovati/krovati-min/02.jpg",
      "/products/salvador/krovati/krovati-min/03.jpg",
    ],
    priceRUB: 129900,
    priceUZS: 18900000,
  }),

  // ✅ Плинтусы (в папке сразу 01/02, без подпапок)
  makeProduct({
    id: "salvador-plintusy-01",
    title: "Плинтус 01",
    brand: "salvador",
    cat: "plintusy",
    basePath: "/products/salvador/plintusy",
    coverIndex: 1,
    gallery: ["/products/salvador/plintusy/01.jpg"],
    priceRUB: 3900,
    priceUZS: 490000,
  }),
  makeProduct({
    id: "salvador-plintusy-02",
    title: "Плинтус 02",
    brand: "salvador",
    cat: "plintusy",
    basePath: "/products/salvador/plintusy",
    coverIndex: 2,
    gallery: ["/products/salvador/plintusy/02.jpg"],
    priceRUB: 3900,
    priceUZS: 490000,
  }),

  // ✅ Шкафы
  makeProduct({
    id: "salvador-shkafy-max",
    title: "Шкаф MAX",
    brand: "salvador",
    cat: "shkafy",
    basePath: "/products/salvador/shkafy/shkafy-max",
    gallery: [
      "/products/salvador/shkafy/shkafy-max/01.jpg",
      "/products/salvador/shkafy/shkafy-max/02.jpg",
      "/products/salvador/shkafy/shkafy-max/03.jpg",
      "/products/salvador/shkafy/shkafy-max/04.jpg",
    ],
    priceRUB: 199900,
    priceUZS: 29500000,
  }),
  makeProduct({
    id: "salvador-shkafy-min",
    title: "Шкаф MIN",
    brand: "salvador",
    cat: "shkafy",
    basePath: "/products/salvador/shkafy/shkafy-min",
    gallery: ["/products/salvador/shkafy/shkafy-min/01.jpg"],
    priceRUB: 159900,
    priceUZS: 23900000,
  }),
  makeProduct({
    id: "salvador-shkafy-standart",
    title: "Шкаф STANDARD",
    brand: "salvador",
    cat: "shkafy",
    basePath: "/products/salvador/shkafy/shkafy-standart",
    gallery: [
      "/products/salvador/shkafy/shkafy-standart/01.jpg",
      "/products/salvador/shkafy/shkafy-standart/02.jpg",
    ],
    priceRUB: 169900,
    priceUZS: 24900000,
  }),

  // ✅ Стол (в папке только 01)
  makeProduct({
    id: "salvador-stoli-01",
    title: "Стол",
    brand: "salvador",
    cat: "stoli",
    basePath: "/products/salvador/stoli",
    coverIndex: 1,
    gallery: ["/products/salvador/stoli/01.jpg"],
    priceRUB: 39900,
    priceUZS: 5800000,
  }),

  // ✅ Тумбы
  makeProduct({
    id: "salvador-tumby-standart",
    title: "Тумба стандарт",
    brand: "salvador",
    cat: "tumby",
    basePath: "/products/salvador/tumby/tumbi-standart",
    gallery: ["/products/salvador/tumby/tumbi-standart/01.jpg"],
    priceRUB: 39900,
    priceUZS: 5800000,
  }),
  makeProduct({
    id: "salvador-tumby-shirokie",
    title: "Тумба широкая",
    brand: "salvador",
    cat: "tumby",
    basePath: "/products/salvador/tumby/tumby-shirokie",
    gallery: ["/products/salvador/tumby/tumby-shirokie/01.jpg"],
    priceRUB: 44900,
    priceUZS: 6500000,
  }),

  // ✅ Витрины
  makeProduct({
    id: "salvador-vitrini-shirokie",
    title: "Витрина широкая",
    brand: "salvador",
    cat: "vitrini",
    basePath: "/products/salvador/vitrini/vitrini-shirokie",
    gallery: ["/products/salvador/vitrini/vitrini-shirokie/01.jpg"],
    priceRUB: 79900,
    priceUZS: 11800000,
  }),
  makeProduct({
    id: "salvador-vitrini-visokie",
    title: "Витрина высокая",
    brand: "salvador",
    cat: "vitrini",
    basePath: "/products/salvador/vitrini/vitrini-visokie",
    gallery: ["/products/salvador/vitrini/vitrini-visokie/01.jpg"],
    priceRUB: 99900,
    priceUZS: 14500000,
  }),

  // ✅ Зеркало (в папке только 01)
  makeProduct({
    id: "salvador-zerkala-01",
    title: "Зеркало",
    brand: "salvador",
    cat: "zerkala",
    basePath: "/products/salvador/zerkala",
    coverIndex: 1,
    gallery: ["/products/salvador/zerkala/01.jpg"],
    priceRUB: 14900,
    priceUZS: 2200000,
  }),
];
