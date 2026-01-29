"use client";

import { X } from "lucide-react";

export default function CatalogToolbar({
  q,
  setQ,
  sort,
  setSort,
}: {
  q: string;
  setQ: (v: string) => void;
  sort: "default" | "title_asc" | "price_asc" | "price_desc";
  setSort: (v: "default" | "title_asc" | "price_asc" | "price_desc") => void;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-black/10 bg-[#F7F5F2] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div className="grid gap-3 md:grid-cols-[1fr_260px]">
        <div className="relative rounded-2xl border border-black/10 bg-white/80 px-4 py-3 backdrop-blur">
          <div className="text-[10px] tracking-[0.16em] uppercase text-black/45">
            Поиск
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Витрина, тумба, шкаф…"
            className="mt-1 w-full bg-transparent pr-10 text-[14px] text-black/85 outline-none placeholder:text-black/35"
          />

          {!!q.trim() && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="absolute right-3 top-[30px] grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-black/60 hover:text-black hover:border-black/20 transition cursor-pointer"
              aria-label="Очистить поиск"
              title="Очистить"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3 backdrop-blur">
          <div className="text-[10px] tracking-[0.16em] uppercase text-black/45">
            Сортировка
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="mt-1 w-full cursor-pointer bg-transparent text-[14px] text-black/85 outline-none"
          >
            <option value="default">По умолчанию</option>
            <option value="title_asc">По алфавиту (A→Я)</option>
            <option value="price_asc">Цена (по возрастанию)</option>
            <option value="price_desc">Цена (по убыванию)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
