"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductVariant, ProductPageModel } from "../ProductClient";

function groupKey(v: ProductVariant) {
  return (v.group || v.kind || "option").toString();
}

export function useProductGallery({
  product,
  groups,
  selectedVariants,
  selectedByGroup,
}: {
  product: ProductPageModel;
  groups: Map<string, ProductVariant[]>;
  selectedVariants: ProductVariant[];
  selectedByGroup: Record<string, string>;
}) {
  // MIN-base: хотим ВСЕГДА 2 фото (01 + 02) в галерее (главная + подслайдер)
  const sizeGalleryAll = useMemo(() => {
    const sizeArr = groups.get("size") ?? [];
    const flat: string[] = [];
    for (const v of sizeArr) {
      const g = Array.isArray(v.gallery) ? v.gallery : [];
      for (const src of g) {
        const s = String(src || "");
        if (s && !flat.includes(s)) flat.push(s);
      }
    }
    return flat;
  }, [groups]);

  const galleryRaw = useMemo(() => {
    const bySize = selectedVariants.find((v) => groupKey(v) === "size");
    const byAny = selectedVariants.find((v) => (v.gallery?.length ?? 0) > 0);

    const pick =
      sizeGalleryAll.length > 1
        ? sizeGalleryAll
        : (bySize?.gallery?.filter(Boolean) ?? []).length
          ? bySize!.gallery!
          : (byAny?.gallery?.filter(Boolean) ?? []).length
            ? byAny!.gallery!
            : Array.isArray(product.gallery)
              ? product.gallery.filter(Boolean)
              : [];

    const base = pick.length ? pick : [product.image].filter(Boolean);

    const uniq: string[] = [];
    for (const src of base.map(String)) {
      if (src && !uniq.includes(src)) uniq.push(src);
    }

    for (const v of selectedVariants) {
      const vi = v.image ? String(v.image) : "";
      if (vi && !uniq.includes(vi)) uniq.unshift(vi);
    }

    return uniq.length ? uniq : [product.image].filter(Boolean);
  }, [product.gallery, product.image, selectedVariants, sizeGalleryAll]);

  const gallery = useMemo(() => {
    if (product.isCollection) return galleryRaw;
    return galleryRaw.slice(0, 3);
  }, [galleryRaw, product.isCollection]);

  const [activeIdx, setActiveIdx] = useState(0);

  // сброс при смене товара
  useEffect(() => {
    setActiveIdx(0);
  }, [product.id]);

  // при смене size — показываем нужную фотку
  useEffect(() => {
    const sizeId = selectedByGroup["size"];
    const sizeVar = (groups.get("size") ?? []).find(
      (v) => String(v.id) === String(sizeId),
    );
    const target = String(sizeVar?.gallery?.[0] ?? "");
    if (!target) return;

    const idx = gallery.findIndex((x) => String(x) === target);
    if (idx >= 0) setActiveIdx(idx);
  }, [selectedByGroup, groups, gallery]);

  // ✅ при смене mechanism — показываем нужную фотку
  useEffect(() => {
    const mechId = selectedByGroup["mechanism"];
    if (!mechId) return;

    const mechVar = (groups.get("mechanism") ?? []).find(
      (v) => String(v.id) === String(mechId),
    );

    const target = String(mechVar?.gallery?.[0] ?? "");
    if (!target) return;

    const idx = gallery.findIndex((x) => String(x) === target);
    if (idx >= 0) setActiveIdx(idx);
    else setActiveIdx(0);
  }, [selectedByGroup, groups, gallery]);

  // ✅ NEW: при смене color — показываем нужную фотку (BUONGIORNO и любые другие)
  useEffect(() => {
    const colorId = selectedByGroup["color"];
    if (!colorId) return;

    const colorVar = (groups.get("color") ?? []).find(
      (v) => String(v.id) === String(colorId),
    );

    const target = String(colorVar?.gallery?.[0] ?? "");
    if (!target) return;

    const idx = gallery.findIndex((x) => String(x) === target);
    if (idx >= 0) setActiveIdx(idx);
    else setActiveIdx(0);
  }, [selectedByGroup, groups, gallery]);

  const maxLen = Math.max(1, gallery.length);

  const nextMain = () => setActiveIdx((v) => (v + 1) % maxLen);
  const prevMain = () => setActiveIdx((v) => (v - 1 + maxLen) % maxLen);

  return {
    gallery,
    activeIdx,
    setActiveIdx,
    nextMain,
    prevMain,
    maxLen,
  };
}
