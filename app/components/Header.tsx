"use client";

import { useMemo, useState } from "react";
import { useRegionLang } from "../context/region-lang";
import { getDict, tF } from "@/i18n";

import TopBar from "./header/TopBar";
import BrandRow from "./header/BrandRow";
import CategoryNav from "./header/CategoryNav";
import MobileMenu from "./header/MobileMenu";

import MapModal from "./modals/MapModal";
import CallModal from "./modals/CallModal";

import {
  REGION_DATA,
  megaCategories,
  topLinks as TOPLINKS_FALLBACK,
} from "../lib/headerData";

type RegionKey = "uz" | "ru";

type GlobalFromStrapi = {
  callCtaLabel?: string | null;
  topLinks?: Array<{
    id?: number;
    label?: string | null;
    href?: string | null;
    isExternal?: boolean | null;
  }> | null;
  phones?: Array<{
    id?: number;
    region?: RegionKey | string | null;
    phone?: string | null;
  }> | null;
  addresses?: Array<{
    id?: number;
    region?: RegionKey | string | null;
    city?: string | null;
    addressLine?: string | null;
    workTime?: string | null;
    mapUrl?: string | null;
  }> | null;
};

function getRegionLabel(dict: any, meta: any): string {
  // новый формат: { labelKey, fallback, ... }
  if (meta && typeof meta === "object" && "labelKey" in meta) {
    return tF(dict, String(meta.labelKey), String(meta.fallback ?? ""));
  }
  // старый формат: { label, ... }
  return String(meta?.label ?? "");
}

export default function Header({
  global,
}: {
  global?: GlobalFromStrapi | null;
}) {
  const { region, setRegion, lang, setLang } = useRegionLang();
  const dict = useMemo(() => getDict(lang), [lang]);

  const [mapOpen, setMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [callOpen, setCallOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ top links из Strapi (если есть), иначе fallback
  const topLinks = useMemo(() => {
    const fromCms = (global?.topLinks ?? [])
      .filter(Boolean)
      .map((x) => ({
        label: (x?.label ?? "").trim(),
        href: (x?.href ?? "").trim(),
        isExternal: Boolean(x?.isExternal),
      }))
      .filter((x) => x.label && x.href);

    // fallback из headerData, если CMS пустой
    // (у тебя сейчас headerData может быть старым или уже новым — страхуемся)
    const fallback = (TOPLINKS_FALLBACK as any[]).map((x) => ({
      label: String(x?.title ?? x?.label ?? x?.fallback ?? "").trim(),
      href: String(x?.href ?? "").trim(),
      isExternal: false,
    }));

    return fromCms.length ? fromCms : fallback;
  }, [global?.topLinks]);

  const regionMeta: any =
    (REGION_DATA as any)[region] ?? (REGION_DATA as any).uz;

  // ✅ phone из Strapi по региону, иначе REGION_DATA
  const phone = useMemo(() => {
    const p = (global?.phones ?? []).find(
      (x) => String(x?.region) === region,
    )?.phone;

    const v =
      p && String(p).trim()
        ? String(p).trim()
        : String(regionMeta?.phone ?? "");

    return v;
  }, [global?.phones, region, regionMeta]);

  // ✅ addresses из Strapi по региону, иначе REGION_DATA
  const addresses = useMemo(() => {
    const list = (global?.addresses ?? [])
      .filter((x) => String(x?.region) === region)
      .map((x) => {
        const city = (x?.city ?? "").trim();
        const addr = (x?.addressLine ?? "").trim();
        const work = (x?.workTime ?? "").trim();
        const base = [city, addr].filter(Boolean).join(", ");
        return work ? `${base} — ${work}` : base;
      })
      .filter(Boolean);

    const fallback = Array.isArray(regionMeta?.addresses)
      ? regionMeta.addresses
      : [];

    return list.length ? list : fallback;
  }, [global?.addresses, region, regionMeta]);

  // ✅ регион в шапке — переводим безопасно
  const regionLabel = getRegionLabel(dict, regionMeta);
  const regionTitle = String(regionLabel || "").toUpperCase();

  const phonePrefix = String(regionMeta?.phonePrefix ?? "");

  // ✅ CTA “Заказать звонок” — если из CMS нет, берём перевод
  const callCta =
    (global?.callCtaLabel ?? "").trim() ||
    tF(dict, "header.call", "Заказать звонок");

  return (
    <>
      <header className="w-full bg-white">
        <TopBar
          topLinks={topLinks}
          phone={phone}
          regionTitle={regionTitle}
          addresses={addresses}
          callCtaLabel={callCta}
          onPickAddress={(a) => {
            setSelectedAddress(a);
            setMapOpen(true);
          }}
          onOpenCall={() => setCallOpen(true)}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <BrandRow
          region={region}
          setRegion={setRegion}
          lang={lang}
          setLang={setLang}
        />

        <CategoryNav categories={megaCategories} />
      </header>

      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        address={selectedAddress}
      />

      <CallModal
        open={callOpen}
        onClose={() => setCallOpen(false)}
        regionLabel={regionLabel}
        phonePrefix={phonePrefix}
        regionKey={region}
        onSubmit={async (data) => {
          try {
            const res = await fetch("/api/call-request", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...data,
                region: regionLabel,
                pageUrl:
                  typeof window !== "undefined" ? window.location.href : "",
              }),
            });

            if (!res.ok) {
              const text = await res.text();
              console.error("CALL REQUEST FAILED:", text);
            }
          } catch (err) {
            console.error("CALL REQUEST ERROR:", err);
          }
        }}
      />

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={topLinks}
      />
    </>
  );
}
