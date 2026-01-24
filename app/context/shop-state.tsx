// app/context/shop-state.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartMap = Record<string, number>; // id -> qty

export type ShopState = {
  favorites: string[];
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  favCount: number;

  cart: CartMap;
  cartCount: number; // сумма qty
  isInCart: (id: string) => boolean;

  // базовые методы (на будущее для страницы корзины)
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;

  // ✅ toggle как у лайка (добавить/убрать)
  toggleCart: (id: string) => void;

  // ✅ добавили для страницы /cart
  setCartQty: (id: string, qty: number) => void;
  clearCart: () => void;

  // ✅ one-click: оставить в корзине только этот товар
  setCartOnly: (id: string, qty?: number) => void;
};

const Ctx = createContext<ShopState | null>(null);

const LS_FAV = "lioneto:favorites:v1";
const LS_CART = "lioneto:cart:v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function ShopStateProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartMap>({});

  // init from localStorage
  useEffect(() => {
    const fav = safeParse<string[]>(localStorage.getItem(LS_FAV), []);
    const crt = safeParse<CartMap>(localStorage.getItem(LS_CART), {});
    setFavorites(Array.isArray(fav) ? fav : []);
    setCart(crt && typeof crt === "object" ? crt : {});
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS_FAV, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(cart));
  }, [cart]);

  const api = useMemo<ShopState>(() => {
    const isFav = (id: string) => favorites.includes(id);

    const toggleFav = (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    };

    const isInCart = (id: string) => (cart[id] ?? 0) > 0;

    // базовое добавление qty (страница корзины пригодится)
    const addToCart = (id: string, qty = 1) => {
      const q = Math.max(1, Math.floor(qty || 1));
      setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + q }));
    };

    const removeFromCart = (id: string) => {
      setCart((prev) => {
        const n = { ...prev };
        delete n[id];
        return n;
      });
    };

    // ✅ toggle логика: клик = добавить 1, повторный клик = убрать полностью
    const toggleCart = (id: string) => {
      setCart((prev) => {
        const exists = (prev[id] ?? 0) > 0;
        if (exists) {
          const n = { ...prev };
          delete n[id];
          return n;
        }
        return { ...prev, [id]: 1 };
      });
    };

    // ✅ qty setter для /cart
    const setCartQty = (id: string, qty: number) => {
      setCart((prev) => {
        const q = Math.max(0, Math.floor(qty || 0));
        if (q <= 0) {
          const n = { ...prev };
          delete n[id];
          return n;
        }
        return { ...prev, [id]: q };
      });
    };

    // ✅ clear для /cart
    const clearCart = () => setCart({});

    // ✅ one-click: оставить только один товар
    const setCartOnly = (id: string, qty = 1) => {
      const q = Math.max(1, Math.floor(qty || 1));
      setCart({ [id]: q });
    };

    const favCount = favorites.length;
    const cartCount = Object.values(cart).reduce((a, b) => a + (b || 0), 0);

    return {
      favorites,
      isFav,
      toggleFav,
      favCount,

      cart,
      cartCount,
      isInCart,

      addToCart,
      removeFromCart,
      toggleCart,

      setCartQty,
      clearCart,

      setCartOnly,
    };
  }, [favorites, cart]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useShopState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShopState must be used within ShopStateProvider");
  return v;
}
