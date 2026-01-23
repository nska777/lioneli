"use client";

import { Heart, ShoppingCart, ListChecks } from "lucide-react";
import { useShopState } from "@/context/shop-state";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function IconBtn({
  title,
  active,
  tone = "neutral",
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  tone?: "neutral" | "danger";
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-full border p-2 backdrop-blur transition",
        "border-black/10 bg-white/80 hover:bg-white",
        active
          ? tone === "danger"
            ? "text-rose-600"
            : "text-black"
          : "text-black/75",
      )}
    >
      {children}
    </button>
  );
}

export default function ProductActions({
  id,
  onOpenSpecs,
}: {
  id: string;
  onOpenSpecs?: () => void; // позже: модалка характеристик или сравнение
}) {
  const { isFav, toggleFav, isInCart, toggleCart } = useShopState();

  const fav = isFav(id);
  const inCart = isInCart(id);

  return (
    <div className="flex gap-2">
      {/* ❤️ избранное */}
      <IconBtn
        title="В избранное"
        active={fav}
        tone="danger"
        onClick={() => toggleFav(id)}
      >
        <Heart className={cn("h-4 w-4", fav && "fill-current")} />
      </IconBtn>

      {/* 🧾 характеристики / сравнение */}
      <IconBtn title="Характеристики" onClick={() => onOpenSpecs?.()}>
        <ListChecks className="h-4 w-4" />
      </IconBtn>

      {/* 🛒 корзина */}
      <IconBtn
        title={inCart ? "Убрать из корзины" : "Добавить в корзину"}
        active={inCart}
        onClick={() => toggleCart(id)}
      >
        <ShoppingCart className={cn("h-4 w-4", inCart && "fill-current")} />
      </IconBtn>
    </div>
  );
}
