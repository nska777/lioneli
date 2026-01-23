// lib/mock/products.ts

export type PriceByRegion = { uzs: number; rub: number };

export type Product = {
  id: string;
  title: string;
  href: string;
  image: string; // /public/...
  sku?: string;
  badge?: string;
  price: PriceByRegion;
};

export const demoProducts: Product[] = [
  {
    id: "1",
    title: "Диван LIONETO — Milano",
    href: "/catalog/1",
    image: "/demo/sofa-1.jpg",
    sku: "LNT-MIL-001",
    badge: "Хит продаж",
    price: { uzs: 14500000, rub: 105000 },
  },
  {
    id: "2",
    title: "Кресло LIONETO — Sorrento",
    href: "/catalog/2",
    image: "/demo/chair-1.jpg",
    sku: "LNT-SOR-010",
    badge: "New",
    price: { uzs: 5200000, rub: 39000 },
  },
  {
    id: "3",
    title: "Кровать LIONETO — Salvador",
    href: "/catalog/3",
    image: "/demo/bed-1.jpg",
    sku: "LNT-SAL-777",
    price: { uzs: 18900000, rub: 138000 },
  },
];

export const byId = new Map(demoProducts.map((p) => [p.id, p]));
