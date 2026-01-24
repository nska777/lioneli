"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, User, ShoppingCart, Heart } from "lucide-react";
import { useShopState } from "../../context/shop-state";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/app/lib/supabase/client";
import { getDict, t as tByKey } from "@/i18n";

function IconBtn({
  label,
  href,
  onClick,
  children,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const base =
    "relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black transition";

  // ✅ если передали href — это ссылка
  if (href) {
    return (
      <Link aria-label={label} href={href} className={base}>
        {children}
      </Link>
    );
  }

  // ✅ иначе — кнопка
  return (
    <button type="button" aria-label={label} onClick={onClick} className={base}>
      {children}
    </button>
  );
}

export default function BrandRow({
  region,
  setRegion,
  lang,
  setLang,
}: {
  region: "uz" | "ru";
  setRegion: (v: "uz" | "ru") => void;
  lang: "ru" | "uz";
  setLang: (v: "ru" | "uz") => void;
}) {
  const { favCount, cartCount } = useShopState();

  const dict = useMemo(() => getDict(lang), [lang]);
  const t = (key: string) => tByKey(dict, key);

  // ✅ ACCOUNT LINK: если есть сессия → /account, иначе → /auth?next=/account
  const [accountHref, setAccountHref] = useState("/auth?next=/account");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAccountHref(data.session ? "/account" : "/auth?next=/account");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountHref(session ? "/account" : "/auth?next=/account");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="py-1.5 md:py-2.5">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* LEFT: REGION */}
          <div className="flex items-center justify-between md:w-[360px] md:justify-start md:gap-4">
            <div className="text-[11px] md:text-[12px] tracking-[0.20em] text-black/45">
              {t("header.pickRegion")}
            </div>

            <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setRegion("uz")}
                className={[
                  "h-8 px-4 rounded-full text-[12px] tracking-[0.12em] transition cursor-pointer",
                  region === "uz"
                    ? "bg-black text-white"
                    : "text-black/70 hover:text-black hover:bg-black/5",
                ].join(" ")}
              >
                {t("header.regionUz")}
              </button>

              <button
                type="button"
                onClick={() => setRegion("ru")}
                className={[
                  "h-8 px-4 rounded-full text-[12px] tracking-[0.12em] transition cursor-pointer",
                  region === "ru"
                    ? "bg-black text-white"
                    : "text-black/70 hover:text-black hover:bg-black/5",
                ].join(" ")}
              >
                {t("header.regionRu")}
              </button>
            </div>
          </div>

          {/* CENTER: LOGO */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center cursor-pointer"
            >
              <Image
                src="/logo-lioneto.svg"
                alt="Lioneto"
                width={160}
                height={45}
                priority
                className="transition-transform duration-300 hover:scale-[1.03]"
              />
            </Link>
          </div>

          {/* RIGHT: LANG + ICONS */}
          <div className="flex items-center justify-end gap-3 md:w-[360px]">
            <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setLang("ru")}
                className={[
                  "h-8 px-3 rounded-full text-[12px] tracking-[0.14em] transition cursor-pointer",
                  lang === "ru"
                    ? "bg-black text-white"
                    : "text-black/70 hover:text-black hover:bg-black/5",
                ].join(" ")}
              >
                RU
              </button>

              <button
                type="button"
                onClick={() => setLang("uz")}
                className={[
                  "h-8 px-3 rounded-full text-[12px] tracking-[0.14em] transition cursor-pointer",
                  lang === "uz"
                    ? "bg-black text-white"
                    : "text-black/70 hover:text-black hover:bg-black/5",
                ].join(" ")}
              >
                UZ
              </button>
            </div>

            {/* SEARCH */}
            <IconBtn
              label={t("header.ariaSearch")}
              onClick={() => {
                // позже: открыть модалку поиска
              }}
            >
              <Search className="h-5 w-5" />
            </IconBtn>

            {/* ACCOUNT */}
            <IconBtn label={t("header.ariaAccount")} href={accountHref}>
              <User className="h-5 w-5" />
            </IconBtn>

            {/* FAVORITES */}
            <div className="relative">
              <IconBtn label={t("header.ariaFavorites")} href="/favorites">
                <Heart className="h-5 w-5" />
              </IconBtn>

              {favCount > 0 && (
                <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] text-white shadow">
                  {favCount}
                </span>
              )}
            </div>

            {/* CART */}
            <div className="relative">
              <IconBtn label={t("header.ariaCart")} href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </IconBtn>

              {cartCount > 0 && (
                <span className="pointer-events-none absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[11px] text-white shadow">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
