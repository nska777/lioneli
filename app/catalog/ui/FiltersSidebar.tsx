"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export type FiltersValue = {
  menu: string[];
  collections: string[];
  types: string[];
  priceMin: number;
  priceMax: number;
};

export type FiltersMeta = {
  priceAbsMin: number;
  priceAbsMax: number;
  menuItems: { label: string; value: string }[];
  collectionItems: { label: string; value: string }[];
  typeItems: { label: string; value: string }[];
};

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/10 pb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between py-3"
      >
        <span className="text-[14px] font-medium text-black/85">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-black/55 transition",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      {open ? <div className="space-y-2">{children}</div> : null}
    </div>
  );
}

function CheckRow({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-[13px] text-black/70 transition hover:bg-black/[0.03] hover:text-black">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-black"
      />
      <span className="leading-snug">{label}</span>
    </label>
  );
}

export default function FiltersSidebar({
  value,
  meta,
  onChange,
  onReset,
  currencyLabel,
}: {
  value: FiltersValue;
  meta: FiltersMeta;
  onChange: (next: FiltersValue) => void;
  onReset: () => void;
  currencyLabel: string;
}) {
  const [minLocal, setMinLocal] = useState(value.priceMin);
  const [maxLocal, setMaxLocal] = useState(value.priceMax);

  // ✅ sync local inputs when value changes from URL
  useEffect(() => {
    setMinLocal(value.priceMin);
    setMaxLocal(value.priceMax);
  }, [value.priceMin, value.priceMax]);

  const clamp = (n: number, a: number, b: number) =>
    Math.max(a, Math.min(b, n));

  const applyPrice = (minN: number, maxN: number) => {
    const mn = clamp(minN, meta.priceAbsMin, meta.priceAbsMax);
    const mx = clamp(maxN, meta.priceAbsMin, meta.priceAbsMax);
    const fixedMin = Math.min(mn, mx);
    const fixedMax = Math.max(mn, mx);
    onChange({ ...value, priceMin: fixedMin, priceMax: fixedMax });
  };

  const toggleInArray = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <aside className="h-fit rounded-2xl border border-black/10 bg-white p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.35)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[12px] tracking-[0.18em] uppercase text-black/45">
          Фильтры
        </div>

        <button
          onClick={onReset}
          className="cursor-pointer rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] tracking-[0.14em] uppercase text-black/65 hover:border-black/20 hover:text-black"
        >
          Сбросить
        </button>
      </div>

      {/* Меню */}
      <Section title="Меню" defaultOpen>
        {meta.menuItems.map((it) => (
          <CheckRow
            key={it.value}
            checked={value.menu.includes(it.value)}
            label={it.label}
            onChange={() =>
              onChange({ ...value, menu: toggleInArray(value.menu, it.value) })
            }
          />
        ))}
      </Section>

      {/* Цена */}
      <Section title="Цена" defaultOpen>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-black/10 bg-white px-3 py-2">
            <div className="text-[10px] tracking-[0.16em] uppercase text-black/45">
              Мин
            </div>
            <input
              value={minLocal}
              onChange={(e) => setMinLocal(Number(e.target.value || 0))}
              onBlur={() => applyPrice(minLocal, maxLocal)}
              className="mt-1 w-full bg-transparent text-[13px] text-black/80 outline-none"
              inputMode="numeric"
            />
          </div>

          <div className="rounded-xl border border-black/10 bg-white px-3 py-2">
            <div className="text-[10px] tracking-[0.16em] uppercase text-black/45">
              Макс
            </div>
            <input
              value={maxLocal}
              onChange={(e) => setMaxLocal(Number(e.target.value || 0))}
              onBlur={() => applyPrice(minLocal, maxLocal)}
              className="mt-1 w-full bg-transparent text-[13px] text-black/80 outline-none"
              inputMode="numeric"
            />
          </div>
        </div>

        {/* двойной range */}
        <div className="mt-3">
          <div className="relative h-10">
            <input
              type="range"
              min={meta.priceAbsMin}
              max={meta.priceAbsMax}
              value={value.priceMin}
              onChange={(e) =>
                applyPrice(Number(e.target.value), value.priceMax)
              }
              className="absolute inset-0 w-full cursor-pointer accent-black"
            />
            <input
              type="range"
              min={meta.priceAbsMin}
              max={meta.priceAbsMax}
              value={value.priceMax}
              onChange={(e) =>
                applyPrice(value.priceMin, Number(e.target.value))
              }
              className="absolute inset-0 w-full cursor-pointer accent-black"
            />
          </div>

          <div className="mt-1 flex items-center justify-between text-[12px] text-black/55">
            <span>
              {value.priceMin.toLocaleString("ru-RU")} {currencyLabel}
            </span>
            <span>
              {value.priceMax.toLocaleString("ru-RU")} {currencyLabel}
            </span>
          </div>
        </div>
      </Section>

      {/* Коллекция */}
      <Section title="Коллекция" defaultOpen>
        {meta.collectionItems.map((it) => (
          <CheckRow
            key={it.value}
            checked={value.collections.includes(it.value)}
            label={it.label}
            onChange={() =>
              onChange({
                ...value,
                collections: toggleInArray(value.collections, it.value),
              })
            }
          />
        ))}
      </Section>

      {/* Категории товаров */}
      <Section title="Категории товаров" defaultOpen>
        {meta.typeItems.map((it) => (
          <CheckRow
            key={it.value}
            checked={value.types.includes(it.value)}
            label={it.label}
            onChange={() =>
              onChange({
                ...value,
                types: toggleInArray(value.types, it.value),
              })
            }
          />
        ))}
      </Section>

      <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-3 text-[12px] text-black/60">
        Эти фильтры перенесём на Strapi, сохранив те же query-параметры.
      </div>
    </aside>
  );
}
