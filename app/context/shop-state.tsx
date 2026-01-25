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

type OneClick = { id: string; qty: number } | null;

export type ShopState = {
  favorites: string[];
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  favCount: number;

  cart: CartMap;
  cartCount: number;
  isInCart: (id: string) => boolean;

  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  toggleCart: (id: string) => void;

  setCartQty: (id: string, qty: number) => void;
  clearCart: () => void;

  // ✅ one-click режим (checkout?mode=oneclick)
  oneClick: OneClick;
  setOneClick: (id: string, qty?: number) => void;
  clearOneClick: () => void;
};

const Ctx = createContext<ShopState | null>(null);

const LS_FAV = "lioneto:favorites:v1";
const LS_CART = "lioneto:cart:v1";
const LS_ONECLICK = "lioneto:oneclick:v1";

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
  const [oneClick, setOneClickState] = useState<OneClick>(null);

  // init from localStorage
  useEffect(() => {
    const fav = safeParse<string[]>(localStorage.getItem(LS_FAV), []);
    const crt = safeParse<CartMap>(localStorage.getItem(LS_CART), {});
    const oc = safeParse<OneClick>(localStorage.getItem(LS_ONECLICK), null);

    setFavorites(Array.isArray(fav) ? fav : []);
    setCart(crt && typeof crt === "object" ? crt : {});
    setOneClickState(
      oc?.id ? { id: String(oc.id), qty: Math.max(1, oc.qty || 1) } : null,
    );
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS_FAV, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LS_ONECLICK, JSON.stringify(oneClick));
  }, [oneClick]);

  const api = useMemo<ShopState>(() => {
    const isFav = (id: string) => favorites.includes(id);

    const toggleFav = (id: string) => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    };

    const isInCart = (id: string) => (cart[id] ?? 0) > 0;

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

    const clearCart = () => setCart({});

    const setOneClick = (id: string, qty = 1) => {
      const q = Math.max(1, Math.floor(qty || 1));
      setOneClickState({ id: String(id), qty: q });
    };

    const clearOneClick = () => setOneClickState(null);

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

      oneClick,
      setOneClick,
      clearOneClick,
    };
  }, [favorites, cart, oneClick]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useShopState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShopState must be used within ShopStateProvider");
  return v;
}
