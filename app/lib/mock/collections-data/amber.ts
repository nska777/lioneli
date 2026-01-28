// app/lib/mock/collections-data/amber.ts
import { makeGallery, makeProduct, type CatalogProduct } from "../catalog-base";

export const AMBER_PRODUCTS: CatalogProduct[] = [
  // -------------------------
  // SHKAFY
  // -------------------------
  makeProduct({
    id: "amber-shkafy-shkaf-gostinnaya",
    title: "Шкаф гостиная",
    brand: "amber",
    cat: "shkafy",
    basePath: "/products/amber/shkafy/shkaf-gostinnaya",
    gallery: makeGallery("/products/amber/shkafy/shkaf-gostinnaya", 3),
    priceRUB: 179900,
    priceUZS: 26500000,
  }),
  makeProduct({
    id: "amber-shkafy-shkaf-max",
    title: "Шкаф MAX",
    brand: "amber",
    cat: "shkafy",
    basePath: "/products/amber/shkafy/shkaf-max",
    gallery: makeGallery("/products/amber/shkafy/shkaf-max", 2),
    priceRUB: 199900,
    priceUZS: 29500000,
  }),
  makeProduct({
    id: "amber-shkafy-shkaf-min",
    title: "Шкаф MIN",
    brand: "amber",
    cat: "shkafy",
    basePath: "/products/amber/shkafy/shkaf-min",
    gallery: makeGallery("/products/amber/shkafy/shkaf-min", 4),
    priceRUB: 159900,
    priceUZS: 23900000,
  }),
  makeProduct({
    id: "amber-shkafy-shkaf-standart",
    title: "Шкаф STANDARD",
    brand: "amber",
    cat: "shkafy",
    basePath: "/products/amber/shkafy/shkaf-standart",
    gallery: makeGallery("/products/amber/shkafy/shkaf-standart", 10),
    priceRUB: 169900,
    priceUZS: 24900000,
  }),

  // -------------------------
  // STELLAJI
  // amber/stellaji (01-02)
  // -------------------------
  makeProduct({
    id: "amber-stellaji",
    title: "Стеллаж",
    brand: "amber",
    cat: "stellaji",
    basePath: "/products/amber/stellaji",
    gallery: makeGallery("/products/amber/stellaji", 2),
    priceRUB: 45900,
    priceUZS: 6600000,
  }),

  // -------------------------
  // STOLI
  // -------------------------
  makeProduct({
    id: "amber-stoli-stoli-jurnalnie",
    title: "Стол журнальный",
    brand: "amber",
    cat: "stoli",
    basePath: "/products/amber/stoli/stoli-jurnalnie",
    gallery: makeGallery("/products/amber/stoli/stoli-jurnalnie", 1),
    priceRUB: 17900,
    priceUZS: 2600000,
  }),
  makeProduct({
    id: "amber-stoli-stoli-pismenniy",
    title: "Стол письменный",
    brand: "amber",
    cat: "stoli",
    basePath: "/products/amber/stoli/stoli-pismenniy",
    gallery: makeGallery("/products/amber/stoli/stoli-pismenniy", 1),
    priceRUB: 39900,
    priceUZS: 5800000,
  }),
  makeProduct({
    id: "amber-stoli-stoli-podvisnie",
    title: "Стол подвесной",
    brand: "amber",
    cat: "stoli",
    basePath: "/products/amber/stoli/stoli-podvisnie",
    gallery: makeGallery("/products/amber/stoli/stoli-podvisnie", 2),
    priceRUB: 34900,
    priceUZS: 5100000,
  }),

  // -------------------------
  // TUMBY (у тебя папка tumbi, но cat должен быть "tumby")
  // -------------------------
  makeProduct({
    id: "amber-tumby-tumbi-podvisnie",
    title: "Тумба подвесная",
    brand: "amber",
    cat: "tumby",
    basePath: "/products/amber/tumbi/tumbi-podvisnie",
    gallery: makeGallery("/products/amber/tumbi/tumbi-podvisnie", 4),
    priceRUB: 39900,
    priceUZS: 5800000,
  }),
  makeProduct({
    id: "amber-tumby-tumbi-standart",
    title: "Тумба стандарт",
    brand: "amber",
    cat: "tumby",
    basePath: "/products/amber/tumbi/tumbi-standart",
    gallery: makeGallery("/products/amber/tumbi/tumbi-standart", 5),
    priceRUB: 39900,
    priceUZS: 5800000,
  }),
  makeProduct({
    id: "amber-tumby-tumbi-tv",
    title: "Тумба TV",
    brand: "amber",
    cat: "tumby",
    basePath: "/products/amber/tumbi/tumbi-tv",
    gallery: makeGallery("/products/amber/tumbi/tumbi-tv", 2),
    priceRUB: 55900,
    priceUZS: 8100000,
  }),

  // -------------------------
  // KROVATI ✅ ДОБАВИЛ
  // public/products/amber/krovati/krovati-max (01-09)
  // public/products/amber/krovati/krovati-min (01-05)
  // -------------------------
  makeProduct({
    id: "amber-krovati-krovati-max",
    title: "Кровать MAX",
    brand: "amber",
    cat: "krovati",
    basePath: "/products/amber/krovati/krovati-max",
    gallery: makeGallery("/products/amber/krovati/krovati-max", 9),
    priceRUB: 189900,
    priceUZS: 27900000,
  }),
  makeProduct({
    id: "amber-krovati-krovati-min",
    title: "Кровать MIN",
    brand: "amber",
    cat: "krovati",
    basePath: "/products/amber/krovati/krovati-min",
    gallery: makeGallery("/products/amber/krovati/krovati-min", 5),
    priceRUB: 169900,
    priceUZS: 24900000,
  }),

  // -------------------------
  // VESHALKI
  // amber/veshalki (01-02)
  // -------------------------
  makeProduct({
    id: "amber-veshalki",
    title: "Вешалка",
    brand: "amber",
    cat: "veshalki",
    basePath: "/products/amber/veshalki",
    gallery: makeGallery("/products/amber/veshalki", 2),
    priceRUB: 12900,
    priceUZS: 1900000,
  }),

  // -------------------------
  // ZERKALA
  // amber/zerkala (01-02)
  // -------------------------
  makeProduct({
    id: "amber-zerkala",
    title: "Зеркало",
    brand: "amber",
    cat: "zerkala",
    basePath: "/products/amber/zerkala",
    gallery: makeGallery("/products/amber/zerkala", 2),
    priceRUB: 14900,
    priceUZS: 2200000,
  }),
  // -------------------------
// KOMODY
// -------------------------
makeProduct({
  id: "amber-komody-shirokie",
  title: "Комод широкий",
  brand: "amber",
  cat: "komody",
  basePath: "/products/amber/komody/komody-shirokie",
  gallery: makeGallery("/products/amber/komody/komody-shirokie", 2),
  priceRUB: 89900,
  priceUZS: 13200000,
}),

makeProduct({
  id: "amber-komody-standart",
  title: "Комод стандарт",
  brand: "amber",
  cat: "komody",
  basePath: "/products/amber/komody/komody-standart",
  gallery: makeGallery("/products/amber/komody/komody-standart", 1),
  priceRUB: 69900,
  priceUZS: 10300000,
}),
// -------------------------
// POLKI
// -------------------------
makeProduct({
  id: "amber-polki",
  title: "Полки",
  brand: "amber",
  cat: "polki",
  basePath: "/products/amber/polki",
  gallery: makeGallery("/products/amber/polki", 6),
  priceRUB: 24900,
  priceUZS: 3650000,
}),

];
