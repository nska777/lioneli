"use client";

import { useState } from "react";
import { useRegionLang } from "../context/region-lang";

import TopBar from "./header/TopBar";
import BrandRow from "./header/BrandRow";
import CategoryNav from "./header/CategoryNav";
import MobileMenu from "./header/MobileMenu";

import MapModal from "./modals/MapModal";
import CallModal from "./modals/CallModal";

import { REGION_DATA, megaCategories, topLinks } from "../lib/headerData";

export default function Header() {
  const { region, setRegion, lang, setLang } = useRegionLang();

  // modals
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [callOpen, setCallOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const phone = REGION_DATA[region].phone;
  const regionTitle = REGION_DATA[region].label.toUpperCase();
  const addresses = REGION_DATA[region].addresses;
  const phonePrefix = REGION_DATA[region].phonePrefix;

  return (
    <>
      <header className="w-full bg-white">
        <TopBar
          topLinks={topLinks}
          phone={phone}
          regionTitle={regionTitle}
          addresses={addresses}
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
        regionLabel={REGION_DATA[region].label}
        phonePrefix={phonePrefix}
        regionKey={region}
        onSubmit={(data) => {
          // пока просто заглушка, потом подключим отправку
          console.log("CALL REQUEST:", data);
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
