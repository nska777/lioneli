// app/checkout/CheckoutClient.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { useRegionLang } from "../context/region-lang";
import { useShopState } from "../context/shop-state";
import { CATALOG_BY_ID } from "@/app/lib/mock/catalog-products";

import { supabase } from "@/app/lib/supabase/client";

function formatMoney(n: number, region: "uz" | "ru") {
  if (region === "uz") return new Intl.NumberFormat("ru-RU").format(n) + " сум";
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

function makeOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LNT-${y}${m}${day}-${rand}`;
}

const LS_CUSTOMER = "lioneto:customer:v1";
const LS_ONECLICK = "lioneto:oneclick:v1";

type CustomerCache = {
  phone?: string;
  name?: string;
  address?: string;
  comment?: string;
};

type ProfileRow = {
  full_name: string | null;
  phone_e164: string | null;
  phone_verified: boolean;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type VariantAny = {
  id: string;
  title?: string;
  priceDeltaRUB?: number;
  priceDeltaUZS?: number;
};

export default function CheckoutClient() {
  const sp = useSearchParams();
  const mode = sp.get("mode"); // "oneclick" | null

  const { region } = useRegionLang();
  const shop = useShopState();

  const [phone, setPhone] = useState(region === "uz" ? "+998 " : "+7 ");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [doneOrderId, setDoneOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const c = safeParse<CustomerCache>(localStorage.getItem(LS_CUSTOMER), {});
    if (c.phone) setPhone(c.phone);
    if (c.name) setName(c.name);
    if (c.address) setAddress(c.address);
    if (c.comment) setComment(c.comment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user?.id;
        if (!userId) return;

        const { data: prof } = await supabase
          .from("profiles")
          .select("full_name, phone_e164, phone_verified")
          .eq("user_id", userId)
          .single();

        if (!alive) return;

        const p = prof as ProfileRow | null;
        if (p?.full_name && !name) setName(p.full_name);
        if (p?.phone_e164 && (!phone || phone.trim().length < 5)) {
          setPhone(p.phone_e164);
        }
      } catch {
        // молча
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== items source =====
  const cart = shop.cart ?? {};
  const cartKeys = useMemo(
    () => Object.keys(cart).filter((k) => (cart[k] ?? 0) > 0),
    [cart],
  );

  const oneClick = shop.oneClick ?? null;

  const oneClickFromLS = useMemo(() => {
    if (typeof window === "undefined") return null;
    const oc = safeParse<{ id: string; qty: number } | null>(
      localStorage.getItem(LS_ONECLICK),
      null,
    );
    if (!oc?.id) return null;
    return { id: String(oc.id), qty: Math.max(1, Math.floor(oc.qty || 1)) };
  }, []);

  const effectiveOneClick = oneClick?.id
    ? oneClick
    : oneClickFromLS?.id
      ? oneClickFromLS
      : null;

  const items = useMemo(() => {
    const useOneClick = mode === "oneclick";

    const keys = useOneClick
      ? effectiveOneClick?.id
        ? [effectiveOneClick.id]
        : []
      : cartKeys;

    return keys
      .map((key) => {
        const k = String(key);

        // ✅ используем parseKey из shop-state (единая логика)
        const { productId, variantId } = shop.parseKey(k);

        const p = CATALOG_BY_ID.get(String(productId));
        if (!p) return null;

        const qty = useOneClick
          ? (effectiveOneClick?.qty ?? 1)
          : (cart[k] ?? 1);

        const baseUnit =
          region === "uz" ? (p as any).price_uzs : (p as any).price_rub;

        const variants: VariantAny[] = Array.isArray((p as any).variants)
          ? ((p as any).variants as VariantAny[])
          : [];

        const variant =
          variantId && variantId !== "base"
            ? (variants.find((v) => String(v.id) === String(variantId)) ?? null)
            : null;

        const delta =
          region === "uz"
            ? Number(variant?.priceDeltaUZS ?? 0) || 0
            : Number(variant?.priceDeltaRUB ?? 0) || 0;

        const unit = Number(baseUnit || 0) + Number(delta || 0);

        const variantTitle = variant?.title ? String(variant.title) : null;

        return {
          key: k,
          productId: String(productId),
          variantId: String(variantId),
          variantTitle,
          title: String((p as any).title ?? ""),
          qty,
          unit,
          sum: unit * qty,
        };
      })
      .filter(Boolean) as Array<{
      key: string;
      productId: string;
      variantId: string;
      variantTitle: string | null;
      title: string;
      qty: number;
      unit: number;
      sum: number;
    }>;
  }, [mode, effectiveOneClick, cartKeys, cart, region, shop]);

  const total = useMemo(() => items.reduce((a, b) => a + b.sum, 0), [items]);

  const canSubmit = phone.trim().length >= 7 && items.length > 0 && !submitting;

  async function submit() {
    setError(null);
    if (!canSubmit) return;

    const orderId = makeOrderId();
    setSubmitting(true);

    try {
      const cache: CustomerCache = {
        phone: phone.trim(),
        name: name.trim(),
        address: address.trim(),
        comment: comment.trim(),
      };
      localStorage.setItem(LS_CUSTOMER, JSON.stringify(cache));

      const payload = {
        orderId,
        createdAt: new Date().toLocaleString("ru-RU"),
        region,
        customer: {
          phone: phone.trim(),
          name: name.trim() || undefined,
          address: address.trim() || undefined,
          comment: comment.trim() || undefined,
        },
        items: items.map((it) => ({
          id: it.productId,
          variantId: it.variantId,
          variantTitle: it.variantTitle || undefined,
          qty: it.qty,
          unit: it.unit,
          sum: it.sum,
          title: it.title,
        })),
        total,
        meta: { mode: mode === "oneclick" ? "oneclick" : "cart" },
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.ok) {
        throw new Error(j?.error || j?.details || "Ошибка отправки заказа");
      }

      setDoneOrderId(orderId);

      if (mode === "oneclick") {
        shop.clearOneClick?.();
      } else {
        shop.clearCart?.();
      }
    } catch (e: any) {
      setError(e?.message || "Ошибка");
    } finally {
      setSubmitting(false);
    }
  }

  if (doneOrderId) {
    return (
      <main className="mx-auto w-full max-w-[900px] px-4 py-14">
        <div className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-black/5">
              <CheckCircle2 className="h-6 w-6 text-black/70" />
            </div>
            <div>
              <div className="text-xl font-semibold tracking-[-0.02em]">
                Ваш заказ оформлен
              </div>
              <div className="mt-1 text-sm text-black/60">
                Номер заказа:{" "}
                <span className="font-medium text-black">{doneOrderId}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition cursor-pointer"
            >
              В каталог <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90 transition cursor-pointer"
            >
              На главную <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-5 text-xs text-black/45">
            Менеджер увидит заказ в Telegram и свяжется с вами.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div>
        <div className="text-[12px] tracking-[0.28em] text-black/45">
          LIONETO
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.02em]">
          Оформление заказа
        </h1>
        <p className="mt-2 text-sm text-black/55">
          Введите данные, проверьте заказ и подтвердите.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-3xl border border-black/10 bg-white p-5">
          <div className="text-base font-semibold">Данные клиента</div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="block">
              <div className="text-xs text-black/50">Телефон *</div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25"
                placeholder={
                  region === "uz" ? "+998 90 123 45 67" : "+7 999 123 45 67"
                }
              />
            </label>

            <label className="block">
              <div className="text-xs text-black/50">Имя</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25"
                placeholder="Роман"
              />
            </label>

            <label className="block md:col-span-2">
              <div className="text-xs text-black/50">Адрес</div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25"
                placeholder="Город, улица, дом"
              />
            </label>

            <label className="block md:col-span-2">
              <div className="text-xs text-black/50">Комментарий</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 min-h-[96px] w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/25"
                placeholder="Например: позвонить после 18:00"
              />
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-3xl border border-black/10 bg-white p-5">
          <div className="text-base font-semibold">Ваш заказ</div>

          <div className="mt-4 space-y-3">
            {items.length ? (
              items.map((it) => (
                <div
                  key={it.key}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {it.title}
                    </div>

                    {it.variantTitle && it.variantId !== "base" && (
                      <div className="mt-1 text-[12px] text-black/55">
                        Вариант:{" "}
                        <span className="font-semibold text-black/75">
                          {it.variantTitle}
                        </span>
                      </div>
                    )}

                    <div className="mt-1 text-xs text-black/45">
                      {it.qty} × {formatMoney(it.unit, region)}
                    </div>
                  </div>

                  <div className="text-sm font-semibold">
                    {formatMoney(it.sum, region)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-black/55">Товар не выбран</div>
            )}
          </div>

          <div className="mt-5 h-px bg-black/10" />

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-black/60">Итого</span>
            <span className="font-semibold">{formatMoney(total, region)}</span>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
              canSubmit
                ? "bg-black text-white hover:opacity-90 cursor-pointer"
                : "bg-black/10 text-black/40"
            }`}
          >
            {submitting ? "Оформляем..." : "Подтвердить заказ"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            href="/cart"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/75 hover:text-black hover:border-black/20 transition cursor-pointer"
          >
            Вернуться в корзину
          </Link>

          <p className="mt-4 text-xs text-black/45">
            * Оплаты нет — заказ улетает менеджеру в Telegram.
          </p>
        </aside>
      </div>
    </main>
  );
}
