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
    isActive?: boolean | null; // ✅ скрывать/показывать ссылку
  }> | null;
  phones?: Array<{
    id?: number;
    region?: RegionKey | string | null;
    phone?: string | null;
  }> | null;
  addresses?: Array<{
    id?: number;
    region?: RegionKey | string | null;

    // RU
    city?: string | null;
    addressLine?: string | null;
    workTime?: string | null;

    // UZ (вариант 1)
    city_uz?: string | null;
    addressLine_uz?: string | null;
    workTime_uz?: string | null;

    mapUrl?: string | null;
  }> | null;
};

function normalizeRegionKey(x: any): RegionKey {
  return x === "ru" ? "ru" : "uz";
}

// ✅ защита от падений, если key вдруг undefined/null
function safeTF(dict: any, key: any, fallback: string) {
  const k = typeof key === "string" ? key : "";
  return tF(dict, k, fallback);
}

export default function Header({
  global,
}: {
  global?: GlobalFromStrapi | null;
}) {
  const { region, setRegion, lang, setLang } = useRegionLang();
  const dict = useMemo(() => getDict(lang as any), [lang]);

  const [mapOpen, setMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [callOpen, setCallOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const regionKey = normalizeRegionKey(region);
  const regionMeta: any =
    (REGION_DATA as any)[regionKey] ?? (REGION_DATA as any).uz;

  /**
   * ✅ TOP LINKS:
   * - если есть Strapi -> пытаемся распознать label и подставить key (чтобы переводилось)
   * - иначе -> берём fallback из headerData (labelKey/fallback)
   */
  const topLinks = useMemo(() => {
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[«»"']/g, "")
        .trim();

    const KEY_BY_LABEL: Record<string, string> = {
      [normalize("Каталог")]: "header.top.catalog",
      [normalize("О компании")]: "header.top.about",
      [normalize("Новости")]: "header.top.news",
      [normalize("Контакты")]: "header.top.contacts",
      [normalize("Сотрудничество")]: "header.top.cooperation",
      [normalize("Акции")]: "header.top.sale",

      [normalize("CATALOG")]: "header.top.catalog",
      [normalize("ABOUT")]: "header.top.about",
      [normalize("NEWS")]: "header.top.news",
      [normalize("CONTACTS")]: "header.top.contacts",
      [normalize("COOPERATION")]: "header.top.cooperation",
      [normalize("SALE")]: "header.top.sale",
    };

    const fromCmsRaw = (global?.topLinks ?? [])
      .filter(Boolean)
      .filter((x) => x?.isActive !== false) // ✅ скрываем если isActive=false
      .map((x) => ({
        label: (x?.label ?? "").trim(),
        href: (x?.href ?? "").trim(),
        isExternal: Boolean(x?.isExternal),
      }))
      .filter((x) => x.label && x.href);

    if (fromCmsRaw.length) {
      return fromCmsRaw.map((x) => {
        const k = KEY_BY_LABEL[normalize(x.label)];
        return {
          labelKey: k ?? "",
          fallback: x.label,
          href: x.href,
          isExternal: x.isExternal,
        };
      });
    }

    return (TOPLINKS_FALLBACK as any[]).map((x) => ({
      labelKey: String(x?.labelKey ?? ""),
      fallback: String(x?.fallback ?? x?.label ?? x?.title ?? "").trim(),
      href: String(x?.href ?? "").trim(),
      isExternal: Boolean(x?.isExternal),
    }));
  }, [global?.topLinks]);

  // ✅ phone из Strapi по региону, иначе REGION_DATA
  const phone = useMemo(() => {
    const p = (global?.phones ?? []).find(
      (x) => String(x?.region) === regionKey,
    )?.phone;

    return p && String(p).trim()
      ? String(p).trim()
      : String(regionMeta?.phone ?? "");
  }, [global?.phones, regionKey, regionMeta]);

  /**
   * ✅ addresses (вариант 1):
   * - RU берём из city/addressLine/workTime
   * - UZ берём из city_uz/addressLine_uz/workTime_uz
   * - если UZ-поля пустые — падаем обратно на RU (чтобы не было пустоты)
   */
  const addresses = useMemo(() => {
    const isUzLang = String(lang) === "uz";

    const list = (global?.addresses ?? [])
      .filter((x) => String(x?.region) === regionKey)
      .map((x) => {
        const cityRaw = isUzLang ? x?.city_uz : x?.city;
        const addrRaw = isUzLang ? x?.addressLine_uz : x?.addressLine;
        const workRaw = isUzLang ? x?.workTime_uz : x?.workTime;

        // если узбекские поля не заполнены — берём RU, чтобы не было пусто
        const city = String(cityRaw ?? x?.city ?? "").trim();
        const addr = String(addrRaw ?? x?.addressLine ?? "").trim();
        const work = String(workRaw ?? x?.workTime ?? "").trim();

        const base = [city, addr].filter(Boolean).join(", ");
        return work ? `${base} — ${work}` : base;
      })
      .filter((s) => String(s).trim().length > 0);

    const fallback = Array.isArray(regionMeta?.addresses)
      ? regionMeta.addresses
      : [];

    return list.length ? list : fallback;
  }, [global?.addresses, regionKey, regionMeta, lang]);

  const callCta =
    (global?.callCtaLabel ?? "").trim() ||
    safeTF(dict, "header.ui.callMe", "Заказать звонок");

  const regionLabel = safeTF(
    dict,
    String(regionMeta?.labelKey ?? "region.uz"),
    String(regionMeta?.fallback ?? "Узбекистан"),
  );

  const phonePrefix = String(regionMeta?.phonePrefix ?? "");

  return (
    <>
      <header className="w-full bg-white">
        <TopBar
          dict={dict} // ✅ оставил как у тебя
          topLinks={topLinks}
          phone={phone}
          regionTitleKey={String(regionMeta?.labelKey ?? "region.uz")}
          regionTitleFallback={String(regionMeta?.fallback ?? "Узбекистан")}
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
          region={regionKey}
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
        regionKey={regionKey}
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
        links={topLinks.map((x) => ({
          label: x.labelKey ? safeTF(dict, x.labelKey, x.fallback) : x.fallback,
          href: x.href,
          isExternal: x.isExternal,
        }))}
      />
    </>
  );
}
