"use client";

import Link from "next/link";
import { Phone, Menu } from "lucide-react";
import StoresDropdown from "./StoresDropdown";
import CallButton from "./CallButton";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const cn = (...s: Array<string | false | null | undefined>) =>
  s.filter(Boolean).join(" ");

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function TopLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    if (!root || !line) return;

    // старт
    gsap.set(line, {
      scaleX: active ? 1 : 0,
      opacity: active ? 1 : 0,
      transformOrigin: "left center",
    });

    const onEnter = () => {
      gsap.killTweensOf(line);
      gsap.to(line, {
        scaleX: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
        transformOrigin: "left center",
      });
    };

    const onLeave = () => {
      if (active) return;
      gsap.killTweensOf(line);
      gsap.to(line, {
        scaleX: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power3.inOut",
        transformOrigin: "right center",
      });
    };

    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [active]);

  return (
    <Link
      ref={rootRef}
      href={href}
      className={cn(
        "relative cursor-pointer select-none transition-colors",
        "text-[13px] tracking-[0.02em]",
        active ? "text-black" : "text-black/70 hover:text-black",
      )}
    >
      {children}

      {/* underline */}
      <span
        ref={lineRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-0 -bottom-[0.75px] w-full rounded-full",
          active ? "h-[0.75px]" : "h-[0.75px]",
        )}
        style={{
          background: "rgba(0,0,0,0.65)",
        }}
      />
    </Link>
  );
}

export default function TopBar({
  topLinks,
  phone,
  regionTitle,
  addresses,
  onPickAddress,
  onOpenCall,
  onOpenMobileMenu,
}: {
  topLinks: readonly { label: string; href: string }[];
  phone: string;
  regionTitle: string;
  addresses: string[];
  onPickAddress: (address: string) => void;
  onOpenCall: () => void;
  onOpenMobileMenu: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="border-b border-black/10">
      <div className="mx-auto w-full max-w-[1200px] px-4">
        <div className="flex h-12 items-center justify-between text-[14px] text-black/80">
          {/* left links */}
          <nav className="hidden items-center gap-8 md:flex">
            {topLinks.map((l) => (
              <TopLink
                key={l.href}
                href={l.href}
                active={isActive(pathname, l.href)}
              >
                {l.label}
              </TopLink>
            ))}
          </nav>

          {/* mobile burger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-black/5 transition"
              onClick={onOpenMobileMenu}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 text-black/70" />
            </button>
          </div>

          {/* right */}
          <div className="flex items-center gap-4 md:gap-8">
            <StoresDropdown
              regionTitle={regionTitle}
              addresses={addresses}
              onPickAddress={onPickAddress}
            />

            <div className="hidden items-center gap-2 lg:inline-flex">
              <Phone className="h-4 w-4 opacity-70" />
              <a
                href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`}
                className="cursor-pointer hover:text-black transition"
              >
                {phone}
              </a>
            </div>

            <CallButton onClick={onOpenCall} />
          </div>
        </div>
      </div>
    </div>
  );
}
