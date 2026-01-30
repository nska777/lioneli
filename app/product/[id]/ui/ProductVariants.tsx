"use client";

import React, { useMemo } from "react";
import { formatPrice } from "@/app/lib/format/price";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

export type ProductVariant = {
  id: string;
  title: string;
  kind: "color" | "option";
  group?: string;
  disabled?: boolean;

  priceDeltaRUB?: number;
  priceDeltaUZS?: number;

  image?: string;
  gallery?: string[];
};

type GroupInput = {
  group: string;
  items: ProductVariant[];
};

type Props = {
  groups: GroupInput[];
  selectedByGroup: Record<string, string>;
  setSelectedByGroup: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  currency: "RUB" | "UZS";
};

function labelForGroup(groupKey: string) {
  if (groupKey === "size") return "Размеры кровати";
  if (groupKey === "mechanism") return "Механизм";
  if (groupKey === "color") return "Цвет";
  return "Модификация";
}

function deltaOf(v: ProductVariant, currency: "RUB" | "UZS") {
  return currency === "RUB"
    ? Number(v.priceDeltaRUB ?? 0) || 0
    : Number(v.priceDeltaUZS ?? 0) || 0;
}

function sortGroups(keys: string[]) {
  const order = ["size", "mechanism", "color", "option"];
  return [...keys].sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "ru");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function sortSize(a: ProductVariant, b: ProductVariant) {
  const parse = (t: string) => {
    const m = t.replace(/\s/g, "").match(/(\d+)[x×](\d+)/i);
    if (!m) return [0, 0];
    return [Number(m[1] ?? 0), Number(m[2] ?? 0)];
  };
  const [aw, al] = parse(a.title);
  const [bw, bl] = parse(b.title);
  if (aw !== bw) return aw - bw;
  if (al !== bl) return al - bl;
  return String(a.title).localeCompare(String(b.title), "ru");
}

function isLift(v: ProductVariant) {
  const s = `${v.id} ${v.title}`.toLowerCase();
  return (
    s.includes("mechanism-lift") ||
    s.includes("lift") ||
    s.includes("подъём") ||
    s.includes("подъем") ||
    s.includes("с подъ")
  );
}

function sortMechanism(a: ProductVariant, b: ProductVariant) {
  // disabled всегда вниз
  const ad = a.disabled ? 1 : 0;
  const bd = b.disabled ? 1 : 0;
  if (ad !== bd) return ad - bd;

  // lift — первым
  const al = isLift(a) ? 0 : 1;
  const bl = isLift(b) ? 0 : 1;
  if (al !== bl) return al - bl;

  return String(a.title).localeCompare(String(b.title), "ru");
}

export default function ProductVariants({
  groups,
  selectedByGroup,
  setSelectedByGroup,
  currency,
}: Props) {
  const normalized = useMemo(() => {
    const arr = Array.isArray(groups) ? groups : [];

    const cleaned = arr
      .filter((g) => g && g.group && Array.isArray(g.items))
      .map((g) => ({
        group: String(g.group),
        items: g.items.filter(Boolean).map((v) => ({
          ...v,
          id: String(v.id),
          title: String(v.title ?? ""),
          group: String(v.group ?? g.group ?? "").trim() || String(g.group),
          kind: v.kind === "color" ? "color" : "option",
          disabled: !!(v as any).disabled,
        })),
      }));

    const orderedKeys = sortGroups(cleaned.map((g) => g.group));

    return orderedKeys.map((key) => {
      const g = cleaned.find((x) => x.group === key)!;
      const items = [...g.items];

      if (key === "size") items.sort(sortSize);
      else if (key === "mechanism") items.sort(sortMechanism);
      else
        items.sort((a, b) =>
          String(a.title).localeCompare(String(b.title), "ru"),
        );

      return { group: key, items };
    });
  }, [groups]);

  if (!normalized.length) return null;

  const pick = (groupKey: string, v: ProductVariant) => {
    if (v.disabled) return;
    setSelectedByGroup((prev) => ({ ...prev, [groupKey]: v.id }));
  };

  return (
    <div className="mt-4">
      {normalized.map((g) => {
        const label = labelForGroup(g.group);
        const selectedId = selectedByGroup[g.group];

        return (
          <div key={g.group} className="mt-5 first:mt-0">
            <div className="text-[11px] tracking-[0.18em] uppercase text-black/45">
              {label}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {g.items.map((v) => {
                const active = v.id === selectedId;
                const disabled = !!v.disabled;

                const d = deltaOf(v, currency);
                const showDelta = d !== 0;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => pick(g.group, v)}
                    disabled={disabled}
                    className={cn(
                      "select-none rounded-full border px-3 py-1.5 text-[12px] transition",
                      "inline-flex items-center gap-2",
                      // ✅ курсоры
                      disabled ? "cursor-not-allowed" : "cursor-pointer",
                      active
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/70 hover:text-black hover:border-black/20",
                      disabled &&
                        "border-black/10 bg-black/[0.02] text-black/30 hover:border-black/10 hover:text-black/30",
                    )}
                    aria-pressed={active}
                    aria-disabled={disabled}
                    title={disabled ? "Пока недоступно" : undefined}
                  >
                    <span className="leading-none">{v.title}</span>

                    {showDelta ? (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] leading-none",
                          active
                            ? "bg-white/15 text-white/90"
                            : "bg-black/5 text-black/50",
                          disabled && "bg-black/5 text-black/25",
                        )}
                      >
                        {d > 0 ? "+" : ""}
                        {formatPrice(d, currency)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
